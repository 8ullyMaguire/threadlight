package api

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/api/handlers"
	"github.com/opencode-ai/polaris/internal/api/middleware"
	"github.com/opencode-ai/polaris/internal/services"
	"github.com/redis/go-redis/v9"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func NewRouter(pg *pgxpool.Pool, rdb *redis.Client, jwtSecret string) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery(), middleware.CORS("http://localhost:8000"))

	authSvc := services.NewAuthService(pg, rdb, jwtSecret)
	affAcc := services.NewAffinityAccumulator(pg, rdb)
	postSvc := services.NewPostService(pg)
	tagSvc := services.NewTagService(pg)
	feedSvc := services.NewFeedService(pg)
	trendingSvc := services.NewTrendingService(pg)
	interactionSvc := services.NewInteractionService(pg, affAcc)
	trustSvc := services.NewTrustService(pg)
	achievementSvc := services.NewAchievementService(pg)
	blocklistSvc := services.NewBlocklistService(pg)
	circleSvc := services.NewCircleService(pg)
	collectionSvc := services.NewCollectionService(pg)
	communitySvc := services.NewCommunityService(pg, affAcc)
	creditSvc := services.NewCreditService(pg)

	// Create MediaService (MinIO image storage)
	var mediaSvc *services.MediaService
	if ms, svcErr := services.NewMediaService(pg); svcErr == nil {
		mediaSvc = ms
	}

	// Wire credit economy hooks
	postSvc.SetCreditService(creditSvc)
	tagSvc.SetCreditService(creditSvc)
	filterSvc := services.NewFilterService(pg)
	configSvc := services.NewConfigService(pg)
	moderationSvc := services.NewModerationService(pg)
	noteSvc := services.NewNoteService(pg)
	searchSvc := services.NewSearchService(pg)
	userSvc := services.NewUserService(pg)
	blockSvc := services.NewBlockService(pg, affAcc)
	reportSvc := services.NewReportService(pg)
	notifSvc := services.NewNotificationService(pg)
	userlistSvc := services.NewUserListService(pg, affAcc)
	algorithmicSvc := services.NewAlgorithmicListService(pg)
	affinitySvc := services.NewUserAffinityService(pg)
	feedPluginSvc := services.NewFeedPluginService(pg)
	modDecisionSvc := services.NewModDecisionReviewsService(pg)
	statsSvc := services.NewStatsService(pg)

	// NEW: Comment, voting, and site services
	commentSvc := services.NewCommentService(pg)
	voteSvc := services.NewPostVoteService(pg)
	siteSvc := services.NewSiteService(pg)

	authMw := middleware.NewAuthMiddleware(authSvc)
	rl := middleware.NewRateLimiter(rdb, 60, 200, time.Minute) // 60 req/min per IP, 200 req/min per user

	authHandler := handlers.NewAuthHandler(authSvc)
	healthHandler := handlers.NewHealthHandler(pg, rdb)
	if mediaSvc != nil {
		healthHandler.SetMinioClient(mediaSvc.MinioClient())
	}
	healthHandler.SetMigrationCheck(func() bool { return true })
	postHandler := handlers.NewPostHandler(postSvc, userSvc, mediaSvc, creditSvc, configSvc)
	tagHandler := handlers.NewTagHandler(tagSvc)
	feedHandler := handlers.NewFeedHandler(feedSvc)
	trendingHandler := handlers.NewTrendingHandler(trendingSvc)
	interactionHandler := handlers.NewInteractionHandler(interactionSvc)
	trustHandler := handlers.NewTrustHandler(trustSvc)
	achievementHandler := handlers.NewAchievementHandler(achievementSvc)
	blocklistHandler := handlers.NewBlocklistHandler(blocklistSvc)
	circleHandler := handlers.NewCircleHandler(circleSvc)
	collectionHandler := handlers.NewCollectionHandler(collectionSvc)
	communityHandler := handlers.NewCommunityHandler(communitySvc, configSvc)
	creditHandler := handlers.NewCreditHandler(creditSvc, configSvc)
	filterHandler := handlers.NewFilterHandler(filterSvc)
	configHandler := handlers.NewConfigHandler(configSvc)
	configHandler.SetStatsService(statsSvc)
	moderationHandler := handlers.NewModerationHandler(moderationSvc)
	noteHandler := handlers.NewNoteHandler(noteSvc)
	searchHandler := handlers.NewSearchHandler(searchSvc)
	userHandler := handlers.NewUserHandler(userSvc)
	blockHandler := handlers.NewBlockHandler(blockSvc)
	reportHandler := handlers.NewReportHandler(reportSvc)
	notifHandler := handlers.NewNotificationHandler(notifSvc)
	userlistHandler := handlers.NewUserListHandler(userlistSvc, algorithmicSvc)
	affinityHandler := handlers.NewAffinityHandler(affinitySvc)
	feedPluginHandler := handlers.NewFeedPluginHandler(feedPluginSvc)
	aboutHandler := handlers.NewAboutHandler(configSvc)
	modDecisionHandler := handlers.NewModDecisionHandler(modDecisionSvc, configSvc)

	// NEW: Comment, voting, and site handlers
	commentHandler := handlers.NewCommentHandler(commentSvc)
	voteHandler := handlers.NewPostVoteHandler(voteSvc)
	siteHandler := handlers.NewSiteHandler(siteSvc)

	r.GET("/health", healthHandler.Health)
	r.GET("/ready", healthHandler.Ready)

	// Swagger API documentation
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// NodeInfo endpoint for client type detection (used by Photon frontend)
	r.GET("/nodeinfo/2.1", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"software": gin.H{
				"name":    "threadlight",
				"version": "0.1",
			},
		})
	})

	// Site info endpoint (no auth required, but enriched when authenticated)
	r.GET("/api/v1/site", authMw.OptionalAuth(), siteHandler.GetSite)
	r.GET("/api/v1/about", aboutHandler.GetAbout)

	apiV1 := r.Group("/api/v1")
	{
		auth := apiV1.Group("/auth")
		{
			auth.POST("/register", rl.RateLimit(), authHandler.Register)
			auth.POST("/login", rl.RateLimit(), authHandler.Login)
			auth.POST("/forgot", authHandler.ForgotPassword)
			auth.POST("/reset", authHandler.ResetPassword)
			auth.POST("/logout", authMw.RequireAuth(), authHandler.Logout)
			auth.GET("/session", authMw.RequireAuth(), authHandler.Session)
		}

		posts := apiV1.Group("/posts")
		posts.Use(authMw.RequireAuth())
		{
			posts.POST("", rl.RateLimit(), postHandler.Create)
			posts.GET("", postHandler.List)
			posts.GET("/count", postHandler.GetCount)
			posts.GET("/author/:author_id", postHandler.ListByAuthor)
			posts.GET("/:id", postHandler.GetByID)
			posts.PUT("/:id", postHandler.Update)
			posts.DELETE("/:id", postHandler.Delete)
			posts.POST("/:id/archive", postHandler.Archive)
			posts.POST("/:id/remove", postHandler.ModRemove)
			// Post voting
			posts.POST("/:id/like", voteHandler.LikePost)
			posts.GET("/:id/likes", voteHandler.ListLikes)
		}

		// Media/Image upload routes
		media := apiV1.Group("/media")
		media.Use(authMw.RequireAuth(), rl.RateLimit())
		{
			media.POST("/upload", postHandler.UploadImage)
		}

		tags := apiV1.Group("/tags")
		tags.Use(authMw.RequireAuth())
		{
			tags.POST("", tagHandler.Create)
			tags.GET("", tagHandler.List)
			tags.GET("/:id", tagHandler.GetByID)
			tags.PUT("/:id", tagHandler.Update)
			tags.DELETE("/:id", tagHandler.Delete)
			tags.POST("/:id/vote", tagHandler.VoteTag)
			tags.POST("/posts/:post_id/tags/:tag_id", tagHandler.TagPost)
			tags.DELETE("/posts/:post_id/tags/:tag_id", tagHandler.UntagPost)
			tags.GET("/posts/:post_id/tags", tagHandler.GetPostTags)
		}

		feeds := apiV1.Group("/feeds")
		feeds.Use(authMw.RequireAuth())
		{
			feeds.POST("", feedHandler.Create)
			feeds.GET("", feedHandler.ListByUser)
			feeds.GET("/:id", feedHandler.GetByID)
			feeds.PUT("/:id", feedHandler.Update)
			feeds.DELETE("/:id", feedHandler.Delete)
			feeds.POST("/:id/sources", feedHandler.AddSource)
			feeds.GET("/:id/sources", feedHandler.ListSources)
			feeds.DELETE("/sources/:source_id", feedHandler.RemoveSource)
		}

		trending := apiV1.Group("/trending")
		trending.Use(authMw.RequireAuth())
		{
			trending.GET("", trendingHandler.ListTrending)
			trending.POST("/increment", trendingHandler.IncrementTopic)
			trending.POST("/topics", trendingHandler.AddTopic)
		}

		interactions := apiV1.Group("/interactions")
		interactions.Use(authMw.RequireAuth())
		{
			interactions.POST("", interactionHandler.CreateInteraction)
			interactions.GET("/post/:postID", interactionHandler.GetPostInteractions)
			interactions.DELETE("/:id", interactionHandler.RemoveInteraction)
			interactions.GET("/check", interactionHandler.HasUserInteracted)
		}

		trust := apiV1.Group("/trust")
		trust.Use(authMw.RequireAuth())
		{
			trust.POST("/connections", trustHandler.CreateConnection)
			trust.GET("/connections/outgoing", trustHandler.GetOutgoingConnections)
			trust.GET("/connections/incoming", trustHandler.GetIncomingConnections)
			trust.GET("/connections/:id", trustHandler.GetConnection)
			trust.PUT("/connections/:id", trustHandler.UpdateConnection)
			trust.DELETE("/connections/:id", trustHandler.DeleteConnection)
		}

		achievements := apiV1.Group("/achievements")
		achievements.Use(authMw.RequireAuth())
		{
			achievements.GET("", achievementHandler.List)
			achievements.GET("/user/:user_id", achievementHandler.GetUserAchievements)
			achievements.POST("/unlock", achievementHandler.Unlock)
		}

		blocklist := apiV1.Group("/blocklist")
		blocklist.Use(authMw.RequireAuth())
		{
			blocklist.POST("/entries", blocklistHandler.Create)
			blocklist.GET("/entries", blocklistHandler.List)
			blocklist.DELETE("/entries/:id", blocklistHandler.Delete)
			blocklist.POST("/check", blocklistHandler.Check)
		}

		circles := apiV1.Group("/circles")
		circles.Use(authMw.RequireAuth())
		{
			circles.POST("", circleHandler.CreateCircle)
			circles.GET("", circleHandler.ListCircles)
			circles.GET("/:id", circleHandler.GetCircle)
			circles.PUT("/:id", circleHandler.UpdateCircle)
			circles.POST("/:id/join", circleHandler.JoinCircle)
			circles.POST("/:id/leave", circleHandler.LeaveCircle)
			circles.POST("/:id/suggest", circleHandler.SuggestMember)
			circles.GET("/:id/members", circleHandler.GetMembers)
		}

		collections := apiV1.Group("/collections")
		collections.Use(authMw.RequireAuth())
		{
			collections.POST("", collectionHandler.Create)
			collections.GET("", collectionHandler.ListByUser)
			collections.GET("/:id", collectionHandler.GetByID)
			collections.PUT("/:id", collectionHandler.Update)
			collections.DELETE("/:id", collectionHandler.Delete)
			collections.POST("/:id/posts", collectionHandler.AddPost)
			collections.GET("/:id/posts", collectionHandler.ListPosts)
			collections.DELETE("/:id/posts/:post_id", collectionHandler.RemovePost)
		}

		// Comments routes
		comments := apiV1.Group("/comments")
		comments.Use(authMw.RequireAuth())
		{
			comments.POST("", commentHandler.Create)
			comments.GET("/by-post/:post_id", commentHandler.ListByPost)
			comments.GET("/:id", commentHandler.GetByID)
			comments.PUT("/:id", commentHandler.Update)
			comments.DELETE("/:id", commentHandler.Delete)
		}

		communities := apiV1.Group("/communities")
		communities.Use(authMw.RequireAuth())
		{
			communities.POST("", communityHandler.Create)
			communities.POST("/batch", communityHandler.BatchGetBySlugs)
			communities.GET("", communityHandler.List)
			communities.GET("/:slug", communityHandler.GetBySlug)
			communities.PUT("/:slug", communityHandler.Update)
			communities.DELETE("/:slug", communityHandler.Archive)
			communities.POST("/:slug/join", communityHandler.Join)
			communities.POST("/:slug/leave", communityHandler.Leave)
			communities.GET("/:slug/members", communityHandler.Members)
			communities.POST("/:slug/curators", communityHandler.AddCurator)
			communities.DELETE("/:slug/curators/:user_id", communityHandler.RemoveCurator)
			communities.POST("/:slug/fork", communityHandler.Fork)
			communities.GET("/:slug/trust", communityHandler.GetTrustGraph)
			communities.POST("/:slug/trust", communityHandler.CreateTrustConnection)
			communities.GET("/:slug/trust/score", communityHandler.GetCommunityTrustScore)
			communities.GET("/:slug/join/check", communityHandler.CheckInviteStatus)
			communities.GET("/:slug/balance", communityHandler.GetTreasuryBalance)
		}

		credits := apiV1.Group("/credits")
		credits.Use(authMw.RequireAuth())
		{
			credits.POST("/transfer", rl.RateLimit(), creditHandler.TransferCredits)
			credits.GET("/transactions", creditHandler.GetTransactions)
			credits.POST("/daily-reward", creditHandler.ClaimDailyReward)
			credits.GET("/daily-reward", creditHandler.GetDailyRewardStatus)
			credits.POST("/bounties", creditHandler.CreateBounty)
			credits.GET("/bounties/:id", creditHandler.GetBounty)
			credits.POST("/bounties/:id/award", creditHandler.AwardBounty)
			credits.GET("/balance", creditHandler.GetBalance)
			credits.POST("/quest/complete", creditHandler.CompleteQuest)
			credits.GET("/costs", creditHandler.GetCosts)
		}

		filters := apiV1.Group("/filters")
		filters.Use(authMw.RequireAuth())
		{
			filters.POST("", filterHandler.Create)
			filters.GET("", filterHandler.List)
			filters.PUT("/:id", filterHandler.Update)
			filters.DELETE("/:id", filterHandler.Delete)
			filters.GET("/check", filterHandler.Check)
		}

		moderation := apiV1.Group("/moderation")
		moderation.Use(authMw.RequireAuth())
		{
			moderation.POST("/actions", moderationHandler.CreateAction)
			moderation.GET("/actions", moderationHandler.ListActions)
			moderation.GET("/actions/:id", moderationHandler.GetAction)
			moderation.POST("/actions/:id/jurors", moderationHandler.AddJuror)
			moderation.POST("/actions/:id/resolve", moderationHandler.ResolveJury)
			moderation.POST("/jurors/:panel_id/vote", moderationHandler.VoteJury)
		}

		// ── Mod Log (Public Reviews) ─────────────────────────────
		modlog := apiV1.Group("/modlog")
		modlog.Use(authMw.RequireAuth())
		{
			modlog.GET("/controversial", modDecisionHandler.GetControversial)
			modlog.POST("/:id/review", modDecisionHandler.CastVote)
			modlog.GET("/:id/reviews", modDecisionHandler.GetActionReviews)
			modlog.GET("/:id/my-review", modDecisionHandler.GetMyVote)
		}

		notes := apiV1.Group("/notes")
		notes.Use(authMw.RequireAuth())
		{
			notes.POST("", noteHandler.CreateNote)
			notes.GET("/:id", noteHandler.GetNote)
			notes.PUT("/:id", noteHandler.UpdateNote)
			notes.GET("/post/:postID", noteHandler.ListPostNotes)
			notes.POST("/:id/vote", noteHandler.VoteOnNote)
		}

		users := apiV1.Group("/users")
		{
			// Enriched user profile endpoint (public) — uses SiteHandler for enriched response
			users.GET("/:username", siteHandler.GetPersonDetails)

			authed := users.Group("")
			authed.Use(authMw.RequireAuth())
			{
				authed.GET("/@me", userHandler.GetProfile)
				authed.PUT("/@me", userHandler.UpdateProfile)
				authed.POST("/@me/avatar", userHandler.UploadAvatar)
				authed.POST("/@me/banner", userHandler.UploadBanner)
				authed.GET("/@me/notifications", userHandler.GetNotifications)
				authed.PUT("/notifications/:id/read", userHandler.MarkNotificationRead)
				authed.POST("/:id/block", userHandler.BlockUser)
				authed.DELETE("/:id/block", userHandler.UnblockUser)
				authed.GET("/@me/blocks", userHandler.ListBlockedUsers)
			}
		}

		search := apiV1.Group("/search")
		search.Use(authMw.RequireAuth())
		{
			search.GET("", searchHandler.Search)
			search.POST("/advanced", searchHandler.AdvancedSearch)
			search.GET("/posts", searchHandler.SearchPosts)
			search.GET("/users", searchHandler.SearchUsers)
			search.GET("/communities", searchHandler.SearchCommunities)
			search.GET("/suggest", searchHandler.SearchSuggest)
		}

		blocks := apiV1.Group("/blocks")
		blocks.Use(authMw.RequireAuth())
		{
			blocks.POST("", blockHandler.Create)
			blocks.DELETE("/:id", blockHandler.Delete)
			blocks.GET("", blockHandler.List)
			blocks.GET("/check/:user_id", blockHandler.Check)
		}

		reports := apiV1.Group("/reports")
		reports.Use(authMw.RequireAuth())
		{
			reports.POST("", reportHandler.Create)
			reports.GET("", reportHandler.List)
			reports.GET("/:id", reportHandler.Get)
			reports.PUT("/:id/resolve", reportHandler.Resolve)
		}

		notifications := apiV1.Group("/notifications")
		notifications.Use(authMw.RequireAuth())
		{
			notifications.GET("", notifHandler.List)
			notifications.PUT("/:id/read", notifHandler.MarkRead)
			notifications.PUT("/read-all", notifHandler.MarkAllRead)
			notifications.GET("/unread-count", notifHandler.UnreadCount)
		}

		// ── User Lists ─────────────────────────────────────────
		lists := apiV1.Group("/lists")
		lists.Use(authMw.RequireAuth())
		{
			lists.POST("", userlistHandler.Create)
			lists.GET("", userlistHandler.List)
			lists.GET("/:id", userlistHandler.Get)
			lists.PUT("/:id", userlistHandler.Update)
			lists.DELETE("/:id", userlistHandler.Delete)

			lists.POST("/:id/members", userlistHandler.AddMember)
			lists.DELETE("/:id/members/:user_id", userlistHandler.RemoveMember)
			lists.GET("/:id/members", userlistHandler.ListMembers)

			lists.POST("/:id/subscribe", userlistHandler.Subscribe)
			lists.POST("/:id/unsubscribe", userlistHandler.Unsubscribe)
			lists.GET("/:id/subscribers", userlistHandler.ListSubscribers)
			lists.GET("/subscriptions", userlistHandler.MySubscriptions)

			lists.POST("/:id/collaborators", userlistHandler.InviteCollaborator)
			lists.POST("/:id/collaborators/accept", userlistHandler.AcceptInvite)
			lists.DELETE("/:id/collaborators/:user_id", userlistHandler.RemoveCollaborator)
			lists.GET("/:id/collaborators", userlistHandler.ListCollaborators)

			lists.POST("/algorithmic", userlistHandler.CreateAlgorithmic)
			lists.POST("/:id/evaluate", userlistHandler.EvaluateAlgorithmic)
		}

		// ── User Affinity ──────────────────────────────────────
		affinity := apiV1.Group("/affinity")
		affinity.Use(authMw.RequireAuth())
		{
			affinity.GET("", affinityHandler.GetAffinities)
			affinity.GET("/similar", affinityHandler.GetSimilarUsers)
		}

		// ── Feed Plugins Marketplace ───────────────────────────
		plugins := apiV1.Group("/feed-plugins")
		plugins.Use(authMw.RequireAuth())
		{
			plugins.POST("", feedPluginHandler.Create)
			plugins.GET("", feedPluginHandler.List)
			plugins.GET("/:id", feedPluginHandler.Get)
			plugins.POST("/:id/install", feedPluginHandler.Install)
			plugins.POST("/:id/uninstall", feedPluginHandler.Uninstall)
			plugins.GET("/installs", feedPluginHandler.ListInstalls)
			plugins.POST("/:id/review", feedPluginHandler.Review)
			plugins.POST("/:id/execute", feedPluginHandler.Execute)
		}

		config := apiV1.Group("/admin")
		config.Use(authMw.RequireAuth())
		{
			config.GET("/config", configHandler.GetConfig)
			config.PUT("/config", configHandler.UpdateConfig)
			config.GET("/stats", configHandler.GetStats)
			config.POST("/invites", configHandler.GenerateInvite)
			config.GET("/invites", configHandler.ListInvites)
			config.GET("/invites/limit", configHandler.GetInviteLimit)
		}

		invites := apiV1.Group("/invites")
		invites.Use(authMw.RequireAuth())
		{
			invites.POST("", configHandler.GenerateInvite)
			invites.GET("", configHandler.ListInvites)
			invites.GET("/limit", configHandler.GetInviteLimit)
		}
	}

	return r
}
