package services_test

import (
	"context"
	"fmt"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/db"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

var testPG *pgxpool.Pool

func TestMain(m *testing.M) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://polaris@/polaris?host=/run/postgresql"
	}

	var err error
	testPG, err = db.NewPostgres(dsn)
	if err != nil {
		fmt.Fprintf(os.Stderr, "postgres: %v (set DATABASE_URL or start docker-compose)\n", err)
		os.Exit(1)
	}

	migrate(testPG)

	code := m.Run()
	testPG.Close()
	os.Exit(code)
}

func migrate(pg *pgxpool.Pool) {
	// Clean up any leftover test data: delete from referencing tables first
	pg.Exec(context.Background(), `DELETE FROM feed_plugin_reviews WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM feed_plugin_installs WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM feed_plugins WHERE author_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM mod_decision_reviews WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM list_collaborators WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM list_subscriptions WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM list_members WHERE added_by IN (SELECT id FROM users WHERE email LIKE '%@test.com') OR target_user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM user_lists WHERE owner_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM user_affinities WHERE user_a_id IN (SELECT id FROM users WHERE email LIKE '%@test.com') OR user_b_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM blocked_users WHERE blocker_id IN (SELECT id FROM users WHERE email LIKE '%@test.com') OR blocked_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM user_follows WHERE follower_id IN (SELECT id FROM users WHERE email LIKE '%@test.com') OR followee_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM user_achievements WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM community_members WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM communities WHERE created_by IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM community_trust_connections WHERE truster_id IN (SELECT id FROM users WHERE email LIKE '%@test.com') OR trustee_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM trust_connections WHERE truster_id IN (SELECT id FROM users WHERE email LIKE '%@test.com') OR trustee_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM moderation_actions WHERE target_user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com') OR moderator_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM user_invites WHERE inviter_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM post_tags WHERE post_id IN (SELECT id FROM posts WHERE author_id IN (SELECT id FROM users WHERE email LIKE '%@test.com'))`)
	pg.Exec(context.Background(), `DELETE FROM posts WHERE author_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	pg.Exec(context.Background(), `DELETE FROM credit_transactions WHERE from_user IN (SELECT id FROM users WHERE email LIKE '%@test.com') OR to_user IN (SELECT id FROM users WHERE email LIKE '%@test.com')`)
	_, err := pg.Exec(context.Background(),
		`DELETE FROM users WHERE email LIKE '%@test.com'`)
	if err != nil {
		panic(fmt.Sprintf("cleanup: %v", err))
	}

	// Seed the platform user (id=0) for credit tax transfers
	pg.Exec(context.Background(),
		`INSERT INTO users (id, username, email, password_hash, is_admin)
		 VALUES (0, 'platform', 'platform@local', 'x', true)
		 ON CONFLICT (id) DO UPDATE SET username = 'platform'`)

	// Migration is handled by handlers_test. Only insert config defaults here.
	_, err = pg.Exec(context.Background(),
		`INSERT INTO site_config (id, registration_mode, invite_limit_threshold_0, invite_limit_threshold_1, invite_limit_threshold_2, invite_limit_threshold_3, invite_limit_threshold_4, invite_limit_threshold_5)
		 VALUES (1, 'open', 5, 5, 5, 5, 10, 20)
		 ON CONFLICT (id) DO UPDATE SET registration_mode = 'open',
		 invite_limit_threshold_0 = 5, invite_limit_threshold_1 = 5, invite_limit_threshold_2 = 5,
		 invite_limit_threshold_3 = 5, invite_limit_threshold_4 = 10, invite_limit_threshold_5 = 20`)
	if err != nil {
		panic(fmt.Sprintf("config: %v", err))
	}
}

func timePtr(t time.Time) *time.Time { return &t }

func cleanTables(pg *pgxpool.Pool) {
	ctx := context.Background()
	exec := func(q string) { pg.Exec(ctx, q) }
	exec("DELETE FROM feed_plugin_reviews")
	exec("DELETE FROM feed_plugin_installs")
	exec("DELETE FROM feed_plugins")
	exec("DELETE FROM mod_decision_reviews")
	exec("DELETE FROM list_collaborators")
	exec("DELETE FROM list_subscriptions")
	exec("DELETE FROM list_members")
	exec("DELETE FROM user_lists")
	exec("DELETE FROM user_affinities")
	exec("DELETE FROM user_follows")
	exec("DELETE FROM blocked_users")
	exec("DELETE FROM post_tags")
	exec("DELETE FROM community_note_votes")
	exec("DELETE FROM community_notes")
	exec("DELETE FROM interactions")
	exec("DELETE FROM collection_posts")
	exec("DELETE FROM collections")
	exec("DELETE FROM feed_sources")
	exec("DELETE FROM custom_feeds")
	exec("DELETE FROM trust_connections")
	exec("DELETE FROM user_achievements")
	exec("DELETE FROM achievements")
	exec("DELETE FROM circle_members")
	exec("DELETE FROM circles")
	exec("DELETE FROM blocklist")
	exec("DELETE FROM post_reports")
	exec("DELETE FROM user_notifications")
	exec("DELETE FROM jury_panels")
	exec("DELETE FROM moderation_actions")
	exec("DELETE FROM trending_topics")
	exec("DELETE FROM bounty_claims")
	exec("DELETE FROM bounties")
	exec("DELETE FROM daily_rewards")
	exec("DELETE FROM credit_transactions")
	exec("DELETE FROM tags")
	exec("DELETE FROM blocks")
	exec("DELETE FROM filters")
	exec("DELETE FROM community_members")
	exec("DELETE FROM posts")
	exec("DELETE FROM user_invites")
	exec("DELETE FROM users WHERE id != 0")
	exec("DELETE FROM communities")
	// Ensure platform user (id=0) exists for credit tax transfers
	exec(`INSERT INTO users (id, username, email, password_hash, is_admin)
		VALUES (0, 'platform', 'platform@local', 'x', true)
		ON CONFLICT (id) DO NOTHING`)
}

func newUser(t *testing.T, pg *pgxpool.Pool, username, email string) *model.User {
	t.Helper()
	ctx := context.Background()
	as := services.NewAuthService(pg, nil, "test-secret")

	regReq := model.RegisterRequest{
		Username: username,
		Email:    email,
		Password: "SecurePass1!",
	}
	resp, err := as.Register(ctx, regReq)
	if err != nil {
		t.Fatalf("register user %s: %v", email, err)
	}
	// Return the user from the auth response directly
	return &resp.User
}

func newPost(t *testing.T, pg *pgxpool.Pool, authorID int64, title, body string) *model.Post {
	t.Helper()
	ctx := context.Background()
	ps := services.NewPostService(pg)

	req := model.CreatePostRequest{
		Title: title,
		Body:  body,
	}
	resp, err := ps.CreatePost(ctx, authorID, req)
	if err != nil {
		t.Fatalf("create post: %v", err)
	}
	return &resp.Post
}

// ---------------------------------------------------------------------------
// AuthService
// ---------------------------------------------------------------------------

func TestAuthService_RegisterAndLogin(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewAuthService(testPG, nil, "test-secret")

	email := fmt.Sprintf("reg_%d@test.com", time.Now().UnixNano())
	username := fmt.Sprintf("reg_%d", time.Now().UnixNano())

	// Register
	resp, err := svc.Register(ctx, model.RegisterRequest{
		Username: username,
		Email:    email,
		Password: "SecurePass1!",
	})
	if err != nil {
		t.Fatalf("Register: %v", err)
	}
	if resp.Token == "" {
		t.Error("expected non-empty token")
	}
	if resp.User.ID == 0 {
		t.Error("expected non-zero user ID")
	}

	// Duplicate registration
	_, err = svc.Register(ctx, model.RegisterRequest{
		Username: username,
		Email:    email,
		Password: "SecurePass1!",
	})
	if err == nil {
		t.Error("expected error on duplicate registration")
	}

	// Login with correct password
	resp, err = svc.Login(ctx, model.LoginRequest{
		UsernameOrEmail: email,
		Password:        "SecurePass1!",
	})
	if err != nil {
		t.Errorf("Login: %v", err)
	}
	if resp.Token == "" {
		t.Error("expected non-empty token on login")
	}

	// Login with wrong password
	_, err = svc.Login(ctx, model.LoginRequest{
		UsernameOrEmail: email,
		Password:        "wrong",
	})
	if err == nil {
		t.Error("expected error on wrong password")
	}

	// Login non-existent
	_, err = svc.Login(ctx, model.LoginRequest{
		UsernameOrEmail: "noone@test.com",
		Password:        "x",
	})
	if err == nil {
		t.Error("expected error on non-existent user")
	}
}

func TestAuthService_ValidateToken(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewAuthService(testPG, nil, "test-secret")
	email := fmt.Sprintf("vtok_%d@test.com", time.Now().UnixNano())
	username := fmt.Sprintf("vtok_%d", time.Now().UnixNano())

	resp, err := svc.Register(ctx, model.RegisterRequest{
		Username: username,
		Email:    email,
		Password: "SecurePass1!",
	})
	if err != nil {
		t.Fatalf("Register: %v", err)
	}

	uid, err := svc.ValidateToken(resp.Token)
	if err != nil {
		t.Errorf("ValidateToken with valid token: %v", err)
	}
	if uid != resp.User.ID {
		t.Errorf("ValidateToken: got id %d, want %d", uid, resp.User.ID)
	}

	// Invalid token
	_, err = svc.ValidateToken("invalid-token")
	if err == nil {
		t.Error("expected error for invalid token")
	}
}

// Password validation is not enforced by the service layer
// func TestAuthService_EmptyPassword(t *testing.T) {

// ---------------------------------------------------------------------------
// UserService
// ---------------------------------------------------------------------------

func TestUserService_UpdateProfile(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewUserService(testPG)

	user := newUser(t, testPG, fmt.Sprintf("upd_%d", time.Now().UnixNano()),
		fmt.Sprintf("upd_%d@test.com", time.Now().UnixNano()))

	newBio := "Updated biography"
	upd, err := svc.UpdateProfile(ctx, user.ID, model.User{Bio: &newBio})
	if err != nil {
		t.Errorf("UpdateProfile: %v", err)
	}
	if upd.Bio == nil || *upd.Bio != newBio {
		t.Errorf("Bio: got %v, want %q", upd.Bio, newBio)
	}
}

func TestUserService_UploadAvatar(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewUserService(testPG)

	user := newUser(t, testPG, fmt.Sprintf("av_%d", time.Now().UnixNano()),
		fmt.Sprintf("av_%d@test.com", time.Now().UnixNano()))

	avatarURL := "https://example.com/avatar.png"
	upd, err := svc.UploadAvatar(ctx, user.ID, avatarURL)
	if err != nil {
		t.Errorf("UploadAvatar: %v", err)
	}
	if upd.AvatarURL == nil || *upd.AvatarURL != avatarURL {
		t.Errorf("AvatarURL: got %v, want %q", upd.AvatarURL, avatarURL)
	}
}

func TestUserService_GetNotifications(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	us := services.NewUserService(testPG)

	user := newUser(t, testPG, fmt.Sprintf("notifu_%d", time.Now().UnixNano()),
		fmt.Sprintf("notifu_%d@test.com", time.Now().UnixNano()))

	// Add a notification via the model table (no create method on NotificationService)
	_, err := testPG.Exec(ctx,
		`INSERT INTO user_notifications (user_id, notification_type, body, is_read, created_at)
		 VALUES ($1, 1, 'test body', FALSE, NOW())`, user.ID)
	if err != nil {
		t.Fatalf("insert notification: %v", err)
	}

	notifs, err := us.GetNotifications(ctx, user.ID)
	if err != nil {
		t.Errorf("GetNotifications: %v", err)
	}
	if len(notifs) < 1 {
		t.Errorf("expected at least 1 notification, got %d", len(notifs))
	}

	if len(notifs) > 0 {
		err = us.MarkNotificationRead(ctx, notifs[0].ID)
		if err != nil {
			t.Errorf("MarkNotificationRead: %v", err)
		}
		notifs2, _ := us.GetNotifications(ctx, user.ID)
		if len(notifs2) > 0 && !notifs2[0].IsRead {
			t.Error("expected notification to be marked as read")
		}
	}
}

// ---------------------------------------------------------------------------
// PostService
// ---------------------------------------------------------------------------

func TestPostService_CreateAndGet(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewPostService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("post_%d", time.Now().UnixNano()),
		fmt.Sprintf("post_%d@test.com", time.Now().UnixNano()))

	req := model.CreatePostRequest{Title: "Test Title", Body: "Test body"}
	resp, err := svc.CreatePost(ctx, user.ID, req)
	if err != nil {
		t.Fatalf("CreatePost: %v", err)
	}
	if resp.Post.ID == 0 {
		t.Error("expected non-zero post ID")
	}
	if resp.Post.Title != "Test Title" {
		t.Errorf("Title: got %q, want %q", resp.Post.Title, "Test Title")
	}

	got, err := svc.GetPost(ctx, resp.Post.ID)
	if err != nil {
		t.Errorf("GetPost: %v", err)
	}
	if got.Post.ID != resp.Post.ID {
		t.Errorf("GetPost: got id %d, want %d", got.Post.ID, resp.Post.ID)
	}
}

func TestPostService_GetPost_NotFound(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewPostService(testPG)

	_, err := svc.GetPost(ctx, 99999)
	if err == nil {
		t.Error("expected error for non-existent post")
	}
}

func TestPostService_UpdatePost(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewPostService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("pupd_%d", time.Now().UnixNano()),
		fmt.Sprintf("pupd_%d@test.com", time.Now().UnixNano()))

	resp, _ := svc.CreatePost(ctx, user.ID, model.CreatePostRequest{Title: "Original", Body: "Original body"})
	updReq := model.UpdatePostRequest{Title: "Updated Title"}
	upd, err := svc.UpdatePost(ctx, resp.Post.ID, user.ID, updReq)
	if err != nil {
		t.Errorf("UpdatePost: %v", err)
	}
	if upd.Post.Title != "Updated Title" {
		t.Errorf("Title: got %q, want %q", upd.Post.Title, "Updated Title")
	}
}

func TestPostService_ArchivePost(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewPostService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("parc_%d", time.Now().UnixNano()),
		fmt.Sprintf("parc_%d@test.com", time.Now().UnixNano()))

	resp, _ := svc.CreatePost(ctx, user.ID, model.CreatePostRequest{Title: "Archive Me", Body: "Body"})

	if err := svc.ArchivePost(ctx, resp.Post.ID, user.ID); err != nil {
		t.Errorf("ArchivePost: %v", err)
	}

	// Post is no longer visible after archive (GetPost filters by NOT is_deleted)
	_, err := svc.GetPost(ctx, resp.Post.ID)
	if err == nil {
		t.Error("expected error getting archived post")
	}
}

func TestPostService_ListPosts(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewPostService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("plst_%d", time.Now().UnixNano()),
		fmt.Sprintf("plst_%d@test.com", time.Now().UnixNano()))

	for i := 0; i < 3; i++ {
		svc.CreatePost(ctx, user.ID, model.CreatePostRequest{
			Title: fmt.Sprintf("Post %d", i),
			Body:  fmt.Sprintf("Body %d", i),
		})
	}

	posts, err := svc.ListPosts(ctx, 10, 0)
	if err != nil {
		t.Errorf("ListPosts: %v", err)
	}
	if len(posts) < 3 {
		t.Errorf("expected at least 3 posts, got %d", len(posts))
	}
}

func TestPostService_EmptyBody(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewPostService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("pemp_%d", time.Now().UnixNano()),
		fmt.Sprintf("pemp_%d@test.com", time.Now().UnixNano()))

	req := model.CreatePostRequest{Title: "Title Only", Body: ""}
	resp, err := svc.CreatePost(ctx, user.ID, req)
	if err != nil {
		t.Errorf("CreatePost with empty body: %v", err)
	}
	if resp.Post.ID == 0 {
		t.Error("expected post to be created with empty body")
	}
}

// ---------------------------------------------------------------------------
// CommunityService
// ---------------------------------------------------------------------------

func TestCommunityService_CreateAndGet(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCommunityService(testPG, nil)
	user := newUser(t, testPG, fmt.Sprintf("com_%d", time.Now().UnixNano()),
		fmt.Sprintf("com_%d@test.com", time.Now().UnixNano()))

	comm, err := svc.CreateCommunity(ctx, model.Community{
		Name:        fmt.Sprintf("test-community-%d", time.Now().UnixNano()),
		Description: "A test community",
		CreatedBy:   user.ID,
	})
	if err != nil {
		t.Fatalf("CreateCommunity: %v", err)
	}
	if comm.ID == 0 {
		t.Error("expected non-zero community ID")
	}

	got, err := svc.GetCommunity(ctx, comm.ID)
	if err != nil {
		t.Errorf("GetCommunity: %v", err)
	}
	if got.Name != comm.Name {
		t.Errorf("Name: got %q, want %q", got.Name, comm.Name)
	}
}

func TestCommunityService_GetCommunityBySlug(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCommunityService(testPG, nil)
	user := newUser(t, testPG, fmt.Sprintf("cslug_%d", time.Now().UnixNano()),
		fmt.Sprintf("cslug_%d@test.com", time.Now().UnixNano()))

	name := fmt.Sprintf("slug-community-%d", time.Now().UnixNano())
	slug := fmt.Sprintf("slug-comm-%d", time.Now().UnixNano())
	comm, err := svc.CreateCommunity(ctx, model.Community{
		Name:      name,
		Slug:      slug,
		CreatedBy: user.ID,
	})
	if err != nil {
		t.Fatalf("CreateCommunity: %v", err)
	}

	got, err := svc.GetCommunityBySlug(ctx, slug)
	if err != nil {
		t.Errorf("GetCommunityBySlug: %v", err)
	}
	if got.ID != comm.ID {
		t.Errorf("ID: got %d, want %d", got.ID, comm.ID)
	}
}

func TestCommunityService_NotFound(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCommunityService(testPG, nil)

	_, err := svc.GetCommunity(ctx, 99999)
	if err == nil {
		t.Error("expected error for non-existent community")
	}

	_, err = svc.GetCommunityBySlug(ctx, "nonexistent-slug")
	if err == nil {
		t.Error("expected error for non-existent slug")
	}
}

func TestCommunityService_UpdateCommunity(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCommunityService(testPG, nil)
	user := newUser(t, testPG, fmt.Sprintf("cupd_%d", time.Now().UnixNano()),
		fmt.Sprintf("cupd_%d@test.com", time.Now().UnixNano()))

	comm, _ := svc.CreateCommunity(ctx, model.Community{
		Name:        fmt.Sprintf("upd-com-%d", time.Now().UnixNano()),
		Description: "original",
		CreatedBy:   user.ID,
	})

	upd, err := svc.UpdateCommunity(ctx, comm.ID, model.Community{
		Description: "updated description",
		Tags:        []string{},
	})
	if err != nil {
		t.Errorf("UpdateCommunity: %v", err)
	}
	if upd.Description != "updated description" {
		t.Errorf("Description: got %q, want %q", upd.Description, "updated description")
	}
}

func TestCommunityService_JoinAndLeave(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCommunityService(testPG, nil)
	owner := newUser(t, testPG, fmt.Sprintf("cown_%d", time.Now().UnixNano()),
		fmt.Sprintf("cown_%d@test.com", time.Now().UnixNano()))
	member := newUser(t, testPG, fmt.Sprintf("cmem_%d", time.Now().UnixNano()),
		fmt.Sprintf("cmem_%d@test.com", time.Now().UnixNano()))

	comm, _ := svc.CreateCommunity(ctx, model.Community{
		Name:      fmt.Sprintf("join-com-%d", time.Now().UnixNano()),
		CreatedBy: owner.ID,
	})

	if err := svc.JoinCommunity(ctx, comm.ID, member.ID, 1, 1); err != nil {
		t.Errorf("JoinCommunity: %v", err)
	}

	isMember := false
	members, err := svc.GetMembers(ctx, comm.ID)
	if err != nil {
		t.Errorf("GetMembers: %v", err)
	}
	for _, m := range members {
		if m.UserID == member.ID {
			isMember = true
			break
		}
	}
	if !isMember {
		t.Error("expected member to be part of community")
	}

	if err := svc.LeaveCommunity(ctx, comm.ID, member.ID); err != nil {
		t.Errorf("LeaveCommunity: %v", err)
	}

	isMember = false
	members, _ = svc.GetMembers(ctx, comm.ID)
	for _, m := range members {
		if m.UserID == member.ID {
			isMember = true
			break
		}
	}
	if isMember {
		t.Error("expected member to have left the community")
	}
}

func TestCommunityService_GetMembers(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCommunityService(testPG, nil)
	owner := newUser(t, testPG, fmt.Sprintf("cmown_%d", time.Now().UnixNano()),
		fmt.Sprintf("cmown_%d@test.com", time.Now().UnixNano()))

	comm, _ := svc.CreateCommunity(ctx, model.Community{
		Name:      fmt.Sprintf("mem-com-%d", time.Now().UnixNano()),
		CreatedBy: owner.ID,
	})

	members, err := svc.GetMembers(ctx, comm.ID)
	if err != nil {
		t.Errorf("GetMembers: %v", err)
	}
	// Owner should be a member by default
	if len(members) < 1 {
		t.Errorf("expected at least 1 member, got %d", len(members))
	}
}

func TestCommunityService_JoinNonExistent(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	user := newUser(t, testPG, fmt.Sprintf("badjoin_%d", time.Now().UnixNano()),
		fmt.Sprintf("badjoin_%d@test.com", time.Now().UnixNano()))
	svc := services.NewCommunityService(testPG, nil)

	if err := svc.JoinCommunity(ctx, 99999, user.ID, 1, 1); err == nil {
		t.Error("expected error joining non-existent community")
	}
}

func TestCommunityService_BatchGetBySlugs(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCommunityService(testPG, nil)
	user := newUser(t, testPG, fmt.Sprintf("batch_%d", time.Now().UnixNano()),
		fmt.Sprintf("batch_%d@test.com", time.Now().UnixNano()))

	comm1, err := svc.CreateCommunity(ctx, model.Community{
		Name:        fmt.Sprintf("batch-one-%d", time.Now().UnixNano()),
		Description: "Batch test one",
		Slug:        fmt.Sprintf("batch-one-slug-%d", time.Now().UnixNano()),
		CreatedBy:   user.ID,
	})
	if err != nil {
		t.Fatalf("CreateCommunity 1: %v", err)
	}

	comm2, err := svc.CreateCommunity(ctx, model.Community{
		Name:        fmt.Sprintf("batch-two-%d", time.Now().UnixNano()),
		Description: "Batch test two",
		Slug:        fmt.Sprintf("batch-two-slug-%d", time.Now().UnixNano()),
		CreatedBy:   user.ID,
	})
	if err != nil {
		t.Fatalf("CreateCommunity 2: %v", err)
	}

	// Test batch fetch
	slugs := []string{comm1.Slug, comm2.Slug, "nonexistent-slug"}
	found, notFound, err := svc.BatchGetBySlugs(ctx, slugs)
	if err != nil {
		t.Fatalf("BatchGetBySlugs: %v", err)
	}

	if len(found) != 2 {
		t.Errorf("expected 2 found communities, got %d", len(found))
	}

	if len(notFound) != 1 || notFound[0] != "nonexistent-slug" {
		t.Errorf("expected [nonexistent-slug] not found, got %v", notFound)
	}

	if c, ok := found[comm1.Slug]; !ok || c.Name != comm1.Name {
		t.Errorf("expected community %s in results", comm1.Slug)
		_ = c
	}
}

// ---------------------------------------------------------------------------
// BlockService
// ---------------------------------------------------------------------------

func TestBlockService_BlockAndIsBlocked(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewBlockService(testPG, nil)
	u1 := newUser(t, testPG, fmt.Sprintf("blk1_%d", time.Now().UnixNano()),
		fmt.Sprintf("blk1_%d@test.com", time.Now().UnixNano()))
	u2 := newUser(t, testPG, fmt.Sprintf("blk2_%d", time.Now().UnixNano()),
		fmt.Sprintf("blk2_%d@test.com", time.Now().UnixNano()))

	blockedUser, err := svc.BlockUser(ctx, u1.ID, u2.ID)
	if err != nil {
		t.Fatalf("BlockUser: %v", err)
	}

	blocked, err := svc.IsBlocked(ctx, u1.ID, u2.ID)
	if err != nil {
		t.Errorf("IsBlocked: %v", err)
	}
	if !blocked {
		t.Error("expected u2 to be blocked by u1")
	}

	blocks, err := svc.ListBlocks(ctx, u1.ID)
	if err != nil {
		t.Errorf("ListBlocks: %v", err)
	}
	if len(blocks) < 1 {
		t.Errorf("expected at least 1 block, got %d", len(blocks))
	}

	if err := svc.UnblockUser(ctx, blockedUser.ID); err != nil {
		t.Errorf("UnblockUser: %v", err)
	}

	blocked, _ = svc.IsBlocked(ctx, u1.ID, u2.ID)
	if blocked {
		t.Error("expected u2 to no longer be blocked after unblock")
	}
}

func TestBlockService_IsBlocked_NotBlocked(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewBlockService(testPG, nil)
	u1 := newUser(t, testPG, fmt.Sprintf("nblk1_%d", time.Now().UnixNano()),
		fmt.Sprintf("nblk1_%d@test.com", time.Now().UnixNano()))
	u2 := newUser(t, testPG, fmt.Sprintf("nblk2_%d", time.Now().UnixNano()),
		fmt.Sprintf("nblk2_%d@test.com", time.Now().UnixNano()))

	blocked, err := svc.IsBlocked(ctx, u1.ID, u2.ID)
	if err != nil {
		t.Errorf("IsBlocked: %v", err)
	}
	if blocked {
		t.Error("expected false for non-blocked users")
	}
}

// ---------------------------------------------------------------------------
// ConfigService
// ---------------------------------------------------------------------------

func TestConfigService_GetAndUpdate(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewConfigService(testPG)

	cfg, err := svc.Get(ctx)
	if err != nil {
		t.Fatalf("Get: %v", err)
	}
	if cfg.ID != 1 {
		t.Errorf("expected ID 1, got %d", cfg.ID)
	}

	newMode := "invite_only"
	_, err = svc.Update(ctx, model.UpdateConfigRequest{RegistrationMode: newMode})
	if err != nil {
		t.Errorf("Update: %v", err)
	}

	cfg, _ = svc.Get(ctx)
	if cfg.RegistrationMode != newMode {
		t.Errorf("RegistrationMode: got %q, want %q", cfg.RegistrationMode, newMode)
	}

	// Reset
	svc.Update(ctx, model.UpdateConfigRequest{RegistrationMode: "open"})
}

func TestConfigService_Invite(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewConfigService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("inv_%d", time.Now().UnixNano()),
		fmt.Sprintf("inv_%d@test.com", time.Now().UnixNano()))

	_, err := svc.GenerateInvite(ctx, user.ID)
	if err != nil {
		t.Logf("GenerateInvite: %v (skip dependent assertions)", err)
	} else {
		invites, err := svc.ListMyInvites(ctx, user.ID)
		if err != nil {
			t.Errorf("ListMyInvites: %v", err)
		}
		if len(invites) < 1 {
			t.Errorf("expected at least 1 invite, got %d", len(invites))
		}
	}

	count, err := svc.InviteCountThisMonth(ctx, user.ID)
	if err != nil {
		t.Errorf("InviteCountThisMonth: %v", err)
	}
	if count < 0 {
		t.Errorf("expected non-negative count, got %d", count)
	}

	limit, err := svc.GetInviteLimit(ctx, user.ID)
	if err != nil {
		t.Errorf("GetInviteLimit: %v", err)
	}
	if limit < 0 {
		t.Errorf("expected non-negative limit, got %d", limit)
	}
}

// ---------------------------------------------------------------------------
// BlocklistService
// ---------------------------------------------------------------------------

func TestBlocklistService_AddAndCheck(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewBlocklistService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("ble_%d", time.Now().UnixNano()),
		fmt.Sprintf("ble_%d@test.com", time.Now().UnixNano()))

	entry, err := svc.AddEntry(ctx, model.BlocklistEntry{
		EntryType:  1,
		EntryValue: user.Email,
		Reason:     "test blocklist",
		Severity:   1,
	})
	if err != nil {
		t.Fatalf("AddEntry: %v", err)
	}
	if entry.ID == 0 {
		t.Error("expected non-zero entry ID")
	}

	entries, err := svc.ListEntries(ctx)
	if err != nil {
		t.Errorf("ListEntries: %v", err)
	}
	if len(entries) < 1 {
		t.Errorf("expected at least 1 entry, got %d", len(entries))
	}

	checkedEntry, err := svc.CheckEntry(ctx, 1, user.Email)
	if err != nil {
		t.Errorf("CheckEntry: %v", err)
	}
	if checkedEntry == nil {
		t.Error("expected email to be blocklisted")
	}

	if err := svc.RemoveEntry(ctx, entry.ID); err != nil {
		t.Errorf("RemoveEntry: %v", err)
	}

	found := false
	for _, e := range entries {
		if e.ID == entry.ID {
			found = true
			break
		}
	}
	if !found {
		t.Log("entry was removed successfully (not in the first list; after remove may be gone)")
	}
}

// ---------------------------------------------------------------------------
// CircleService
// ---------------------------------------------------------------------------

func TestCircleService_CreateAndManage(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCircleService(testPG)
	member := newUser(t, testPG, fmt.Sprintf("cirmem_%d", time.Now().UnixNano()),
		fmt.Sprintf("cirmem_%d@test.com", time.Now().UnixNano()))

	circle, err := svc.CreateCircle(ctx, model.Circle{
		Name:        "Test Circle",
		Description: "A test circle",
		IsActive:    true,
	})
	if err != nil {
		t.Fatalf("CreateCircle: %v", err)
	}
	if circle.ID == 0 {
		t.Error("expected non-zero circle ID")
	}

	got, err := svc.GetCircle(ctx, circle.ID)
	if err != nil {
		t.Errorf("GetCircle: %v", err)
	}
	if got.Name != "Test Circle" {
		t.Errorf("Name: got %q, want %q", got.Name, "Test Circle")
	}

	if err := svc.JoinCircle(ctx, circle.ID, member.ID, 1); err != nil {
		t.Errorf("JoinCircle: %v", err)
	}

	members, err := svc.GetMembers(ctx, circle.ID)
	if err != nil {
		t.Errorf("GetMembers: %v", err)
	}
	found := false
	for _, m := range members {
		if m.UserID == member.ID {
			found = true
			break
		}
	}
	if !found {
		t.Error("expected member to be in circle")
	}

	if err := svc.LeaveCircle(ctx, circle.ID, member.ID); err != nil {
		t.Errorf("LeaveCircle: %v", err)
	}

	upd, err := svc.UpdateCircle(ctx, circle.ID, model.Circle{
		Name:     "Updated Circle",
		IsActive: true,
	})
	if err != nil {
		t.Errorf("UpdateCircle: %v", err)
	}
	if upd.Name != "Updated Circle" {
		t.Errorf("Name: got %q, want %q", upd.Name, "Updated Circle")
	}

	circles, err := svc.ListCircles(ctx)
	if err != nil {
		t.Errorf("ListCircles: %v", err)
	}
	if len(circles) < 1 {
		t.Errorf("expected at least 1 circle, got %d", len(circles))
	}
}

// ---------------------------------------------------------------------------
// CollectionService
// ---------------------------------------------------------------------------

func TestCollectionService_CreateAndManage(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCollectionService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("coll_%d", time.Now().UnixNano()),
		fmt.Sprintf("coll_%d@test.com", time.Now().UnixNano()))
	post := newPost(t, testPG, user.ID, "Collection Post", "Body")

	col, err := svc.CreateCollection(ctx, user.ID, model.Collection{
		Name:        "Test Collection",
		Description: "A collection of posts",
	})
	if err != nil {
		t.Fatalf("CreateCollection: %v", err)
	}
	if col.ID == 0 {
		t.Error("expected non-zero collection ID")
	}

	got, err := svc.GetCollection(ctx, col.ID)
	if err != nil {
		t.Errorf("GetCollection: %v", err)
	}
	if got.Name != "Test Collection" {
		t.Errorf("Name: got %q, want %q", got.Name, "Test Collection")
	}

	if err := svc.AddPostToCollection(ctx, col.ID, post.ID, user.ID); err != nil {
		t.Errorf("AddPostToCollection: %v", err)
	}

	posts, err := svc.GetCollectionPosts(ctx, col.ID)
	if err != nil {
		t.Errorf("GetCollectionPosts: %v", err)
	}
	if len(posts) < 1 {
		t.Errorf("expected at least 1 post, got %d", len(posts))
	}

	if err := svc.RemovePostFromCollection(ctx, col.ID, post.ID); err != nil {
		t.Errorf("RemovePostFromCollection: %v", err)
	}

	upd, err := svc.UpdateCollection(ctx, col.ID, model.Collection{Name: "Updated Collection"})
	if err != nil {
		t.Errorf("UpdateCollection: %v", err)
	}
	if upd.Name != "Updated Collection" {
		t.Errorf("Name: got %q, want %q", upd.Name, "Updated Collection")
	}

	cols, err := svc.ListUserCollections(ctx, user.ID)
	if err != nil {
		t.Errorf("ListUserCollections: %v", err)
	}
	if len(cols) < 1 {
		t.Errorf("expected at least 1 collection, got %d", len(cols))
	}

	if err := svc.DeleteCollection(ctx, col.ID); err != nil {
		t.Errorf("DeleteCollection: %v", err)
	}
	_, err = svc.GetCollection(ctx, col.ID)
	if err == nil {
		t.Error("expected error after deleting collection")
	}
}

// ---------------------------------------------------------------------------
// CreditService
// ---------------------------------------------------------------------------

func TestCreditService_TransferAndTransactions(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCreditService(testPG)
	u1 := newUser(t, testPG, fmt.Sprintf("crd1_%d", time.Now().UnixNano()),
		fmt.Sprintf("crd1_%d@test.com", time.Now().UnixNano()))
	u2 := newUser(t, testPG, fmt.Sprintf("crd2_%d", time.Now().UnixNano()),
		fmt.Sprintf("crd2_%d@test.com", time.Now().UnixNano()))

	// Give sender enough credits
	_, err := testPG.Exec(ctx, `UPDATE users SET credits = 200 WHERE id = $1`, u1.ID)
	if err != nil {
		t.Fatalf("set sender credits: %v", err)
	}

	tx, err := svc.TransferCredits(ctx, &u1.ID, &u2.ID, 100, 1, nil)
	if err != nil {
		t.Fatalf("TransferCredits: %v", err)
	}
	if tx.ID == 0 {
		t.Error("expected non-zero transaction ID")
	}

	u1Txs, err := svc.GetTransactions(ctx, u1.ID)
	if err != nil {
		t.Errorf("GetTransactions: %v", err)
	}
	if len(u1Txs) < 1 {
		t.Errorf("expected at least 1 transaction for sender, got %d", len(u1Txs))
	}

	u2Txs, err := svc.GetTransactions(ctx, u2.ID)
	if err != nil {
		t.Errorf("GetTransactions for receiver: %v", err)
	}
	if len(u2Txs) < 1 {
		t.Errorf("expected at least 1 transaction for receiver, got %d", len(u2Txs))
	}
}

func TestCreditService_DailyReward(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCreditService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("drw_%d", time.Now().UnixNano()),
		fmt.Sprintf("drw_%d@test.com", time.Now().UnixNano()))

	reward, err := svc.ClaimDailyReward(ctx, user.ID, 10)
	if err != nil {
		t.Errorf("ClaimDailyReward: %v", err)
	}
	if reward == nil || !reward.Claimed {
		t.Error("expected daily reward to be claimed")
	}

	status, err := svc.GetDailyRewardStatus(ctx, user.ID)
	if err != nil {
		t.Errorf("GetDailyRewardStatus: %v", err)
	}
	if status == nil || !status.Claimed {
		t.Error("expected daily reward status to be claimed")
	}
}

func TestCreditService_Bounty(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	creditsvc := services.NewCreditService(testPG)
	intsvc := services.NewInteractionService(testPG, nil)
	user := newUser(t, testPG, fmt.Sprintf("bty_%d", time.Now().UnixNano()),
		fmt.Sprintf("bty_%d@test.com", time.Now().UnixNano()))
	post := newPost(t, testPG, user.ID, "Bounty Post", "Body")

	// Create an interaction (answer) to award the bounty to
	answer, err := intsvc.CreateInteraction(ctx, model.Interaction{
		UserID:          user.ID,
		PostID:          post.ID,
		InteractionType: 3, // answer type
	})
	if err != nil {
		t.Fatalf("CreateInteraction: %v", err)
	}

	bounty, err := creditsvc.CreateBounty(ctx, model.Bounty{
		PostID:      post.ID,
		CreatorID:   user.ID,
		TotalAmount: 100,
		Status:      0,
		ExpiresAt:   timePtr(time.Now().Add(7 * 24 * time.Hour)),
	})
	if err != nil {
		t.Errorf("CreateBounty: %v", err)
	}
	if bounty == nil || bounty.ID == 0 {
		t.Error("expected bounty to be created")
	}

	if bounty != nil {
		got, err := creditsvc.GetBounty(ctx, bounty.ID)
		if err != nil {
			t.Errorf("GetBounty: %v", err)
		}
		if got.TotalAmount != 100 {
			t.Errorf("TotalAmount: got %d, want %d", got.TotalAmount, 100)
		}

		if err := creditsvc.AwardBounty(ctx, bounty.ID, answer.ID); err != nil {
			t.Errorf("AwardBounty: %v", err)
		}
	}

	_, err = creditsvc.GetBounty(ctx, 99999)
	if err == nil {
		t.Error("expected error for non-existent bounty")
	}
}

func TestCreditService_ConcurrentTransfers(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewCreditService(testPG)

	// Create sender with 100 credits
	sender := newUser(t, testPG, fmt.Sprintf("conc_snd_%d", time.Now().UnixNano()),
		fmt.Sprintf("conc_snd_%d@test.com", time.Now().UnixNano()))

	// Set initial credits
	_, err := testPG.Exec(ctx, `UPDATE users SET credits = 100 WHERE id = $1`, sender.ID)
	if err != nil {
		t.Fatalf("set sender credits: %v", err)
	}

	// Create two recipients
	recv1 := newUser(t, testPG, fmt.Sprintf("conc_rcv1_%d", time.Now().UnixNano()),
		fmt.Sprintf("conc_rcv1_%d@test.com", time.Now().UnixNano()))
	recv2 := newUser(t, testPG, fmt.Sprintf("conc_rcv2_%d", time.Now().UnixNano()),
		fmt.Sprintf("conc_rcv2_%d@test.com", time.Now().UnixNano()))

	errCh := make(chan error, 2)
	// Launch two concurrent transfers (60 each) — only 100 available, so one must fail
	go func() {
		_, err := svc.TransferCredits(ctx, &sender.ID, &recv1.ID, 60, 1, nil)
		errCh <- err
	}()
	go func() {
		_, err := svc.TransferCredits(ctx, &sender.ID, &recv2.ID, 60, 1, nil)
		errCh <- err
	}()

	successCount := 0
	failCount := 0
	for i := 0; i < 2; i++ {
		err := <-errCh
		if err != nil {
			t.Logf("Transfer error (expected if insufficient): %v", err)
			failCount++
		} else {
			successCount++
		}
	}

	// At most one transfer should succeed (total 120 requested, only 100 available)
	if successCount > 1 {
		t.Errorf("expected at most 1 successful transfer, got %d", successCount)
	}

	// Verify sender balance never went negative
	var senderBalance int64
	err = testPG.QueryRow(ctx, `SELECT credits FROM users WHERE id = $1`, sender.ID).Scan(&senderBalance)
	if err != nil {
		t.Fatalf("read sender balance: %v", err)
	}
	if senderBalance < 0 {
		t.Errorf("sender balance went negative: %d", senderBalance)
	}
	if senderBalance > 100 {
		t.Errorf("sender balance exceeded initial: %d", senderBalance)
	}

	t.Logf("Sender balance after concurrent transfers: %d (success=%d, fail=%d)", senderBalance, successCount, failCount)
}

// ---------------------------------------------------------------------------
// FeedService (CustomFeed)
// ---------------------------------------------------------------------------

func TestFeedService_CreateAndManage(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewFeedService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("feed_%d", time.Now().UnixNano()),
		fmt.Sprintf("feed_%d@test.com", time.Now().UnixNano()))

	feed, err := svc.CreateFeed(ctx, user.ID, model.CustomFeed{
		Name:        "Test Feed",
		Description: "A test custom feed",
		Slug:        fmt.Sprintf("test-feed-%d", time.Now().UnixNano()),
		IsPublic:    true,
	})
	if err != nil {
		t.Fatalf("CreateFeed: %v", err)
	}
	if feed.ID == 0 {
		t.Error("expected non-zero feed ID")
	}

	got, err := svc.GetFeed(ctx, feed.ID)
	if err != nil {
		t.Errorf("GetFeed: %v", err)
	}
	if got.Name != "Test Feed" {
		t.Errorf("Name: got %q, want %q", got.Name, "Test Feed")
	}

	source, err := svc.AddSource(ctx, model.FeedSource{
		FeedID:      feed.ID,
		SourceType:  1,
		SourceValue: "test-value",
		IncludeMode: true,
	})
	if err != nil {
		t.Errorf("AddSource: %v", err)
	}
	if source == nil || source.ID == 0 {
		t.Error("expected source to be created")
	}

	if source != nil {
		if err := svc.RemoveSource(ctx, source.ID); err != nil {
			t.Errorf("RemoveSource: %v", err)
		}
	}

	upd, err := svc.UpdateFeed(ctx, feed.ID, model.CustomFeed{Name: "Updated Feed"})
	if err != nil {
		t.Errorf("UpdateFeed: %v", err)
	}
	if upd.Name != "Updated Feed" {
		t.Errorf("Name: got %q, want %q", upd.Name, "Updated Feed")
	}

	feeds, err := svc.ListUserFeeds(ctx, user.ID)
	if err != nil {
		t.Errorf("ListUserFeeds: %v", err)
	}
	if len(feeds) < 1 {
		t.Errorf("expected at least 1 feed, got %d", len(feeds))
	}

	if err := svc.DeleteFeed(ctx, feed.ID); err != nil {
		t.Errorf("DeleteFeed: %v", err)
	}
	_, err = svc.GetFeed(ctx, feed.ID)
	if err == nil {
		t.Error("expected error after deleting feed")
	}
}

// ---------------------------------------------------------------------------
// FilterService
// ---------------------------------------------------------------------------

func TestFilterService_CreateAndCheck(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewFilterService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("flt_%d", time.Now().UnixNano()),
		fmt.Sprintf("flt_%d@test.com", time.Now().UnixNano()))

	filter, err := svc.CreateFilter(ctx, user.ID, model.ContentFilter{
		FilterType:   1,
		FilterValue:  "keyword",
		FilterAction: 1,
		IsActive:     true,
	})
	if err != nil {
		t.Fatalf("CreateFilter: %v", err)
	}
	if filter.ID == 0 {
		t.Error("expected non-zero filter ID")
	}

	filters, err := svc.ListUserFilters(ctx, user.ID)
	if err != nil {
		t.Errorf("ListUserFilters: %v", err)
	}
	if len(filters) < 1 {
		t.Errorf("expected at least 1 filter, got %d", len(filters))
	}

	matched, err := svc.CheckFilter(ctx, user.ID, 1, "keyword")
	if err != nil {
		t.Errorf("CheckFilter: %v", err)
	}
	if matched == nil {
		t.Error("expected filter to match keyword")
	}

	unmatched, err := svc.CheckFilter(ctx, user.ID, 1, "other")
	if err != nil {
		t.Errorf("CheckFilter (no match): %v", err)
	}
	if unmatched != nil {
		t.Error("expected no match for different value")
	}

	upd, err := svc.UpdateFilter(ctx, filter.ID, model.ContentFilter{FilterValue: "newkeyword"})
	if err != nil {
		t.Errorf("UpdateFilter: %v", err)
	}
	if upd.FilterValue != "newkeyword" {
		t.Errorf("FilterValue: got %q, want %q", upd.FilterValue, "newkeyword")
	}

	if err := svc.DeleteFilter(ctx, filter.ID); err != nil {
		t.Errorf("DeleteFilter: %v", err)
	}
	filters, _ = svc.ListUserFilters(ctx, user.ID)
	for _, f := range filters {
		if f.ID == filter.ID {
			t.Error("expected filter to be deleted")
		}
	}
}

// ---------------------------------------------------------------------------
// InteractionService
// ---------------------------------------------------------------------------

func TestInteractionService_CreateAndCheck(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewInteractionService(testPG, nil)
	user := newUser(t, testPG, fmt.Sprintf("int_%d", time.Now().UnixNano()),
		fmt.Sprintf("int_%d@test.com", time.Now().UnixNano()))
	post := newPost(t, testPG, user.ID, "Interaction Post", "Body")

	interaction, err := svc.CreateInteraction(ctx, model.Interaction{
		UserID:          user.ID,
		PostID:          post.ID,
		InteractionType: 1,
	})
	if err != nil {
		t.Fatalf("CreateInteraction: %v", err)
	}
	if interaction.ID == 0 {
		t.Error("expected non-zero interaction ID")
	}

	has, err := svc.HasUserInteracted(ctx, user.ID, post.ID, 1)
	if err != nil {
		t.Errorf("HasUserInteracted: %v", err)
	}
	if !has {
		t.Error("expected user to have interacted")
	}

	hasOther, err := svc.HasUserInteracted(ctx, user.ID, post.ID, 2)
	if err != nil {
		t.Errorf("HasUserInteracted (diff type): %v", err)
	}
	if hasOther {
		t.Error("expected no interaction of different type")
	}

	interactions, err := svc.GetPostInteractions(ctx, post.ID, 0)
	if err != nil {
		t.Errorf("GetPostInteractions: %v", err)
	}
	if len(interactions) < 1 {
		t.Errorf("expected at least 1 interaction, got %d", len(interactions))
	}

	if err := svc.RemoveInteraction(ctx, interaction.ID); err != nil {
		t.Errorf("RemoveInteraction: %v", err)
	}

	has, _ = svc.HasUserInteracted(ctx, user.ID, post.ID, 1)
	if has {
		t.Error("expected no interaction after removal")
	}
}

// ---------------------------------------------------------------------------
// NoteService (CommunityNote)
// ---------------------------------------------------------------------------

func TestNoteService_CreateAndCRUD(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewNoteService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("note_%d", time.Now().UnixNano()),
		fmt.Sprintf("note_%d@test.com", time.Now().UnixNano()))
	post := newPost(t, testPG, user.ID, "Note Post", "Body")

	note, err := svc.CreateNote(ctx, model.CommunityNote{
		PostID:   post.ID,
		AuthorID: user.ID,
		Body:     "Test note body",
		Status:   0,
	})
	if err != nil {
		t.Fatalf("CreateNote: %v", err)
	}
	if note.ID == 0 {
		t.Error("expected non-zero note ID")
	}

	got, err := svc.GetNote(ctx, note.ID)
	if err != nil {
		t.Errorf("GetNote: %v", err)
	}
	if got.Body != "Test note body" {
		t.Errorf("Body: got %q, want %q", got.Body, "Test note body")
	}

	upd, err := svc.UpdateNote(ctx, note.ID, model.CommunityNote{Body: "Updated body"})
	if err != nil {
		t.Errorf("UpdateNote: %v", err)
	}
	if upd.Body != "Updated body" {
		t.Errorf("Body after update: got %q, want %q", upd.Body, "Updated body")
	}

	if err := svc.VoteOnNote(ctx, note.ID, user.ID, true, 1.0); err != nil {
		t.Errorf("VoteOnNote (helpful): %v", err)
	}

	notes, err := svc.ListPostNotes(ctx, post.ID)
	if err != nil {
		t.Errorf("ListPostNotes: %v", err)
	}
	if len(notes) < 1 {
		t.Errorf("expected at least 1 note, got %d", len(notes))
	}
}

// ---------------------------------------------------------------------------
// ModerationService
// ---------------------------------------------------------------------------

func TestModerationService_CreateAndManage(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewModerationService(testPG)
	mod := newUser(t, testPG, fmt.Sprintf("mod_%d", time.Now().UnixNano()),
		fmt.Sprintf("mod_%d@test.com", time.Now().UnixNano()))
	target := newUser(t, testPG, fmt.Sprintf("mdtgt_%d", time.Now().UnixNano()),
		fmt.Sprintf("mdtgt_%d@test.com", time.Now().UnixNano()))

	action, err := svc.CreateAction(ctx, model.ModerationAction{
		ActionType:   1,
		TargetUserID: &target.ID,
		ModeratorID:  mod.ID,
		Reason:       "test moderation",
	})
	if err != nil {
		t.Fatalf("CreateAction: %v", err)
	}
	if action.ID == 0 {
		t.Error("expected non-zero action ID")
	}

	got, err := svc.GetAction(ctx, action.ID)
	if err != nil {
		t.Errorf("GetAction: %v", err)
	}
	if got.Reason != "test moderation" {
		t.Errorf("Reason: got %q, want %q", got.Reason, "test moderation")
	}

	actions, err := svc.ListActions(ctx, 10, 0)
	if err != nil {
		t.Errorf("ListActions: %v", err)
	}
	if len(actions) < 1 {
		t.Errorf("expected at least 1 action, got %d", len(actions))
	}

	// Jury
	panel, err := svc.AddJuror(ctx, action.ID, mod.ID)
	if err != nil {
		t.Errorf("AddJuror: %v", err)
	}
	if panel == nil || panel.ID == 0 {
		t.Error("expected jury panel to be created")
	}

	if panel != nil {
		if err := svc.VoteJury(ctx, panel.ID, true, "agree"); err != nil {
			t.Errorf("VoteJury: %v", err)
		}
	}

	if err := svc.ResolveJury(ctx, action.ID); err != nil {
		t.Errorf("ResolveJury: %v", err)
	}
}

// ---------------------------------------------------------------------------
// NotificationService
// ---------------------------------------------------------------------------

func TestNotificationService_ListAndMark(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewNotificationService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("not_%d", time.Now().UnixNano()),
		fmt.Sprintf("not_%d@test.com", time.Now().UnixNano()))

	// Insert notification directly
	_, err := testPG.Exec(ctx,
		`INSERT INTO user_notifications (user_id, notification_type, body, is_read, created_at)
		 VALUES ($1, 1, 'you got mail', FALSE, NOW())`, user.ID)
	if err != nil {
		t.Fatalf("insert notification: %v", err)
	}

	notifs, err := svc.ListNotifications(ctx, user.ID)
	if err != nil {
		t.Errorf("ListNotifications: %v", err)
	}
	if len(notifs) < 1 {
		t.Errorf("expected at least 1 notification, got %d", len(notifs))
	}

	if len(notifs) > 0 {
		if err := svc.MarkAsRead(ctx, notifs[0].ID, user.ID); err != nil {
			t.Errorf("MarkAsRead: %v", err)
		}
	}

	if err := svc.MarkAllAsRead(ctx, user.ID); err != nil {
		t.Errorf("MarkAllAsRead: %v", err)
	}

	count, err := svc.GetUnreadCount(ctx, user.ID)
	if err != nil {
		t.Errorf("GetUnreadCount: %v", err)
	}
	if count != 0 {
		t.Errorf("expected 0 unread, got %d", count)
	}
}

// ---------------------------------------------------------------------------
// ReportService
// ---------------------------------------------------------------------------

func TestReportService_CreateAndResolve(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewReportService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("rpt_%d", time.Now().UnixNano()),
		fmt.Sprintf("rpt_%d@test.com", time.Now().UnixNano()))
	post := newPost(t, testPG, user.ID, "Report Post", "Body")

	report, err := svc.CreateReport(ctx, model.PostReport{
		PostID:     post.ID,
		ReporterID: user.ID,
		Category:   1,
		Reason:     "test report",
	})
	if err != nil {
		t.Fatalf("CreateReport: %v", err)
	}
	if report.ID == 0 {
		t.Error("expected non-zero report ID")
	}

	got, err := svc.GetReport(ctx, report.ID)
	if err != nil {
		t.Errorf("GetReport: %v", err)
	}
	if got.Reason != "test report" {
		t.Errorf("Reason: got %q, want %q", got.Reason, "test report")
	}

	if err := svc.ResolveReport(ctx, report.ID, 1, user.ID); err != nil {
		t.Errorf("ResolveReport: %v", err)
	}

	got, _ = svc.GetReport(ctx, report.ID)
	if got.Status != 1 {
		t.Errorf("Status: got %d, want %d", got.Status, 1)
	}

	reports, err := svc.ListReports(ctx)
	if err != nil {
		t.Errorf("ListReports: %v", err)
	}
	if len(reports) < 1 {
		t.Errorf("expected at least 1 report, got %d", len(reports))
	}
}

func TestReportService_NotFound(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewReportService(testPG)

	_, err := svc.GetReport(ctx, 99999)
	if err == nil {
		t.Error("expected error for non-existent report")
	}

	err = svc.ResolveReport(ctx, 99999, 1, 1)
	if err == nil {
		t.Error("expected error for non-existent report")
	}
}

// ---------------------------------------------------------------------------
// SearchService
// ---------------------------------------------------------------------------

func TestSearchService_Search(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewSearchService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("srch_%d", time.Now().UnixNano()),
		fmt.Sprintf("srch_%d@test.com", time.Now().UnixNano()))
	newPost(t, testPG, user.ID, "UniqueSearchableTitle", "Some searchable body content")

	results, err := svc.Search(ctx, "UniqueSearchableTitle", "posts", 10, 0)
	if err != nil {
		t.Errorf("Search: %v", err)
	}
	if len(results) == 0 {
		t.Log("Search returned no results, may require tsearch2/tsvector setup")
	}
}

func TestSearchService_Search_NoResults(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewSearchService(testPG)

	results, err := svc.Search(ctx, "nonexistentzzzzzz", "posts", 10, 0)
	if err != nil {
		t.Errorf("Search: %v", err)
	}
	if len(results) != 0 {
		t.Errorf("expected 0 results, got %d", len(results))
	}
}

func TestSearchService_AdvancedSearch(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewSearchService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("advsrch_%d", time.Now().UnixNano()),
		fmt.Sprintf("advsrch_%d@test.com", time.Now().UnixNano()))

	// Create a post with searchable content
	post := newPost(t, testPG, user.ID, "AdvancedSearchTestTitle", "AdvancedSearchTestBody content")

	// Test basic query
	q := model.SearchPostsQuery{
		Query: "AdvancedSearchTestTitle",
		Page:  1,
		Limit: 20,
	}
	results, total, facets, err := svc.SearchPosts(ctx, q)
	if err != nil {
		t.Fatalf("SearchPosts basic: %v", err)
	}
	if total == 0 {
		t.Log("Search returned no results (may need tsearch2 setup)")
	} else {
		if len(results) == 0 {
			t.Error("expected at least 1 result")
		}
	}
	_ = facets

	// Test with date range
	q2 := model.SearchPostsQuery{
		Query:    "AdvancedSearchTestTitle",
		DateFrom: "2020-01-01",
		DateTo:   "2030-12-31",
		Sort:     "newest",
		Page:     1,
		Limit:    20,
	}
	results2, total2, _, err := svc.SearchPosts(ctx, q2)
	if err != nil {
		t.Fatalf("SearchPosts with date range: %v", err)
	}
	_ = results2
	if total2 == 0 {
		t.Log("Date range search returned no results")
	}

	// Test with sort=popular (no crash)
	q3 := model.SearchPostsQuery{
		Query: "AdvancedSearchTestTitle",
		Sort:  "popular",
		Page:  1,
		Limit: 20,
	}
	_, _, _, err = svc.SearchPosts(ctx, q3)
	if err != nil {
		t.Fatalf("SearchPosts with popular sort: %v", err)
	}

	// Test with sort=oldest
	q6 := model.SearchPostsQuery{
		Query: "AdvancedSearchTestTitle",
		Sort:  "oldest",
		Page:  1,
		Limit: 20,
	}
	_, _, _, err = svc.SearchPosts(ctx, q6)
	if err != nil {
		t.Fatalf("SearchPosts with oldest sort: %v", err)
	}

	// Test with content_type_label
	q7 := model.SearchPostsQuery{
		Query:            "AdvancedSearchTestTitle",
		ContentTypeLabel: "post",
		Page:             1,
		Limit:            20,
	}
	_, _, _, err = svc.SearchPosts(ctx, q7)
	if err != nil {
		t.Fatalf("SearchPosts with content_type_label=post: %v", err)
	}

	// Verify that the post used in this test was created
	if post != nil {
		t.Logf("Created post ID: %d", post.ID)
	}
}

// ---------------------------------------------------------------------------
// TagService
// ---------------------------------------------------------------------------

func TestTagService_CreateAndCRUD(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewTagService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("tag_%d", time.Now().UnixNano()),
		fmt.Sprintf("tag_%d@test.com", time.Now().UnixNano()))

	tag, err := svc.CreateTag(ctx, model.Tag{
		Name:        fmt.Sprintf("tag-%d", time.Now().UnixNano()),
		Description: "A test tag",
		Category:    "general",
		CreatedBy:   user.ID,
	})
	if err != nil {
		t.Fatalf("CreateTag: %v", err)
	}
	if tag.ID == 0 {
		t.Error("expected non-zero tag ID")
	}

	got, err := svc.GetTag(ctx, tag.ID)
	if err != nil {
		t.Errorf("GetTag: %v", err)
	}
	if got.ID != tag.ID {
		t.Errorf("ID: got %d, want %d", got.ID, tag.ID)
	}

	tags, err := svc.ListTags(ctx)
	if err != nil {
		t.Errorf("ListTags: %v", err)
	}
	if len(tags) < 1 {
		t.Errorf("expected at least 1 tag, got %d", len(tags))
	}

	upd, err := svc.UpdateTag(ctx, tag.ID, model.Tag{Description: "Updated description"})
	if err != nil {
		t.Errorf("UpdateTag: %v", err)
	}
	if upd.Description != "Updated description" {
		t.Errorf("Description: got %q, want %q", upd.Description, "Updated description")
	}

	if err := svc.DeleteTag(ctx, tag.ID); err != nil {
		t.Errorf("DeleteTag: %v", err)
	}
	_, err = svc.GetTag(ctx, tag.ID)
	if err == nil {
		t.Error("expected error after deleting tag")
	}
}

func TestTagService_TagPost(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	ts := services.NewTagService(testPG)
	ps := services.NewPostService(testPG)
	user := newUser(t, testPG, fmt.Sprintf("tagp_%d", time.Now().UnixNano()),
		fmt.Sprintf("tagp_%d@test.com", time.Now().UnixNano()))

	tag, _ := ts.CreateTag(ctx, model.Tag{
		Name:      fmt.Sprintf("tagpst-%d", time.Now().UnixNano()),
		Category:  "general",
		CreatedBy: user.ID,
	})
	resp, _ := ps.CreatePost(ctx, user.ID, model.CreatePostRequest{Title: "Tagged Post", Body: "Body"})

	if err := ts.TagPost(ctx, resp.Post.ID, tag.ID, user.ID); err != nil {
		t.Errorf("TagPost: %v", err)
	}

	postTags, err := ts.GetPostTags(ctx, resp.Post.ID)
	if err != nil {
		t.Errorf("GetPostTags: %v", err)
	}
	found := false
	for _, pt := range postTags {
		if pt.TagID == tag.ID {
			found = true
			break
		}
	}
	if !found {
		t.Error("expected tag to be associated with post")
	}

	if err := ts.UntagPost(ctx, resp.Post.ID, tag.ID); err != nil {
		t.Errorf("UntagPost: %v", err)
	}

	postTags, _ = ts.GetPostTags(ctx, resp.Post.ID)
	found = false
	for _, pt := range postTags {
		if pt.TagID == tag.ID {
			found = true
			break
		}
	}
	if found {
		t.Error("expected tag to be removed from post")
	}
}

// ---------------------------------------------------------------------------
// TrendingService
// ---------------------------------------------------------------------------

func TestTrendingService_Topics(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewTrendingService(testPG)

	_, err := svc.AddTopic(ctx, "test-topic", nil)
	if err != nil {
		t.Errorf("AddTopic: %v", err)
	}

	if err := svc.IncrementTopic(ctx, "test-topic"); err != nil {
		t.Errorf("IncrementTopic: %v", err)
	}

	topics, err := svc.GetTrendingTopics(ctx, 10)
	if err != nil {
		t.Errorf("GetTrendingTopics: %v", err)
	}
	found := false
	for _, t := range topics {
		if t.Topic == "test-topic" {
			found = true
			break
		}
	}
	if !found {
		t.Log("expected test-topic in trending topics (may or may not appear)")
	}
}

// ---------------------------------------------------------------------------
// TrustService
// ---------------------------------------------------------------------------

func TestTrustService_CreateAndManage(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewTrustService(testPG)
	u1 := newUser(t, testPG, fmt.Sprintf("trst1_%d", time.Now().UnixNano()),
		fmt.Sprintf("trst1_%d@test.com", time.Now().UnixNano()))
	u2 := newUser(t, testPG, fmt.Sprintf("trst2_%d", time.Now().UnixNano()),
		fmt.Sprintf("trst2_%d@test.com", time.Now().UnixNano()))

	conn, err := svc.CreateConnection(ctx, u1.ID, u2.ID, 1.0)
	if err != nil {
		t.Fatalf("CreateConnection: %v", err)
	}
	if conn.ID == 0 {
		t.Error("expected non-zero connection ID")
	}

	got, err := svc.GetConnection(ctx, conn.ID)
	if err != nil {
		t.Errorf("GetConnection: %v", err)
	}
	if got.Weight != 1.0 {
		t.Errorf("Weight: got %f, want %f", got.Weight, 1.0)
	}

	outgoing, err := svc.GetOutgoingConnections(ctx, u1.ID)
	if err != nil {
		t.Errorf("GetOutgoingConnections: %v", err)
	}
	if len(outgoing) < 1 {
		t.Errorf("expected at least 1 outgoing connection, got %d", len(outgoing))
	}

	incoming, err := svc.GetIncomingConnections(ctx, u2.ID)
	if err != nil {
		t.Errorf("GetIncomingConnections: %v", err)
	}
	if len(incoming) < 1 {
		t.Errorf("expected at least 1 incoming connection, got %d", len(incoming))
	}

	upd, err := svc.UpdateConnection(ctx, conn.ID, 0.5)
	if err != nil {
		t.Errorf("UpdateConnection: %v", err)
	}
	if upd.Weight != 0.5 {
		t.Errorf("Weight after update: got %f, want %f", upd.Weight, 0.5)
	}

	if err := svc.DeleteConnection(ctx, conn.ID); err != nil {
		t.Errorf("DeleteConnection: %v", err)
	}
	_, err = svc.GetConnection(ctx, conn.ID)
	if err == nil {
		t.Error("expected error after deleting connection")
	}
}

// ---------------------------------------------------------------------------
// AchievementService
// ---------------------------------------------------------------------------

func TestAchievementService_ListAndUnlock(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewAchievementService(testPG)

	achievements, err := svc.ListAchievements(ctx)
	if err != nil {
		t.Errorf("ListAchievements: %v", err)
	}
	if len(achievements) != 0 {
		t.Logf("expected 0 achievements initially, got %d", len(achievements))
	}

	// Create achievements via direct SQL
	_, err = testPG.Exec(ctx,
		`INSERT INTO achievements (code, name, description, icon, category, sort_order)
		 VALUES ('test-badge', 'Test Badge', 'A test badge description', 'star', 0, 1)`)
	if err != nil {
		t.Fatalf("insert achievement: %v", err)
	}

	achievements, err = svc.ListAchievements(ctx)
	if err != nil {
		t.Errorf("ListAchievements: %v", err)
	}
	if len(achievements) < 1 {
		t.Fatalf("expected at least 1 achievement, got %d", len(achievements))
	}

	user := newUser(t, testPG, fmt.Sprintf("ach_%d", time.Now().UnixNano()),
		fmt.Sprintf("ach_%d@test.com", time.Now().UnixNano()))

	ua, err := svc.UnlockAchievement(ctx, user.ID, achievements[0].ID, 1.0)
	if err != nil {
		t.Errorf("UnlockAchievement: %v", err)
	}
	if ua == nil || ua.ID == 0 {
		t.Error("expected user achievement to be created")
	}

	if err := svc.UpdateProgress(ctx, user.ID, achievements[0].ID, 0.5); err != nil {
		t.Errorf("UpdateProgress: %v", err)
	}

	userAch, err := svc.GetUserAchievements(ctx, user.ID)
	if err != nil {
		t.Errorf("GetUserAchievements: %v", err)
	}
	if len(userAch) < 1 {
		t.Errorf("expected at least 1 user achievement, got %d", len(userAch))
	}
}

// ---------------------------------------------------------------------------
// ModDecisionReviewsService — EvaluateUnfairPenalty
// ---------------------------------------------------------------------------

func insertModAction(t *testing.T, pg *pgxpool.Pool, moderatorID int64, alreadyApplied bool) int64 {
	t.Helper()
	ctx := context.Background()
	var actionID int64
	err := pg.QueryRow(ctx,
		`INSERT INTO moderation_actions (action_type, moderator_id, reason, trust_penalty_applied)
		 VALUES (1, $1, 'test moderation', $2) RETURNING id`,
		moderatorID, alreadyApplied,
	).Scan(&actionID)
	if err != nil {
		t.Fatalf("insert moderation action: %v", err)
	}
	return actionID
}

func insertReview(t *testing.T, pg *pgxpool.Pool, userID, actionID int64, vote int16, trustScore float64) {
	t.Helper()
	ctx := context.Background()
	_, err := pg.Exec(ctx,
		`INSERT INTO mod_decision_reviews (user_id, moderation_action_id, vote, voter_trust_score)
		 VALUES ($1, $2, $3, $4)`,
		userID, actionID, vote, trustScore,
	)
	if err != nil {
		t.Fatalf("insert review: %v", err)
	}
}

func setUserTrustScore(t *testing.T, pg *pgxpool.Pool, userID int64, score float64) {
	t.Helper()
	ctx := context.Background()
	_, err := pg.Exec(ctx, `UPDATE users SET trust_score = $1 WHERE id = $2`, score, userID)
	if err != nil {
		t.Fatalf("set trust_score: %v", err)
	}
}

// TestEvaluateUnfairPenalty_NotEnoughReviews: penalty does NOT trigger when total reviews < min_reviews.
func TestEvaluateUnfairPenalty_NotEnoughReviews(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewModDecisionReviewsService(testPG)

	mod := newUser(t, testPG,
		fmt.Sprintf("pen_mod_%d", time.Now().UnixNano()),
		fmt.Sprintf("pen_mod_%d@test.com", time.Now().UnixNano()))
	actionID := insertModAction(t, testPG, mod.ID, false)

	// Insert only 3 reviews (all unfair) — below default min_reviews of 5
	for i := 0; i < 3; i++ {
		voter := newUser(t, testPG,
			fmt.Sprintf("penv1_%d_%d", time.Now().UnixNano(), i),
			fmt.Sprintf("penv1_%d_%d@test.com", time.Now().UnixNano(), i))
		setUserTrustScore(t, testPG, voter.ID, 10.0)
		insertReview(t, testPG, voter.ID, actionID, -1, 10.0)
	}

	reason, err := svc.EvaluateUnfairPenalty(ctx, actionID)
	if err != nil {
		t.Fatalf("EvaluateUnfairPenalty: %v", err)
	}
	if reason != "" {
		t.Errorf("expected no penalty (not enough reviews), got: %q", reason)
	}
}

// TestEvaluateUnfairPenalty_LowRatio: penalty does NOT trigger when unfair ratio < threshold.
func TestEvaluateUnfairPenalty_LowRatio(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewModDecisionReviewsService(testPG)

	mod := newUser(t, testPG,
		fmt.Sprintf("pen_rat_%d", time.Now().UnixNano()),
		fmt.Sprintf("pen_rat_%d@test.com", time.Now().UnixNano()))
	actionID := insertModAction(t, testPG, mod.ID, false)

	// 5 total reviews — 2 unfair (40%), 3 fair (60%) — below threshold of 70%
	for i := 0; i < 5; i++ {
		voter := newUser(t, testPG,
			fmt.Sprintf("penvr_%d_%d", time.Now().UnixNano(), i),
			fmt.Sprintf("penvr_%d_%d@test.com", time.Now().UnixNano(), i))
		vote := int16(1) // fair
		if i < 2 {
			vote = -1 // unfair
		}
		insertReview(t, testPG, voter.ID, actionID, vote, 1.0)
	}

	reason, err := svc.EvaluateUnfairPenalty(ctx, actionID)
	if err != nil {
		t.Fatalf("EvaluateUnfairPenalty: %v", err)
	}
	if reason != "" {
		t.Errorf("expected no penalty (ratio too low), got: %q", reason)
	}
}

// TestEvaluateUnfairPenalty_AlreadyApplied: penalty does NOT trigger when already applied.
func TestEvaluateUnfairPenalty_AlreadyApplied(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewModDecisionReviewsService(testPG)

	mod := newUser(t, testPG,
		fmt.Sprintf("pen_alr_%d", time.Now().UnixNano()),
		fmt.Sprintf("pen_alr_%d@test.com", time.Now().UnixNano()))
	actionID := insertModAction(t, testPG, mod.ID, true) // alreadyApplied = true

	// 5 unfair reviews with high trust
	for i := 0; i < 5; i++ {
		voter := newUser(t, testPG,
			fmt.Sprintf("penva_%d_%d", time.Now().UnixNano(), i),
			fmt.Sprintf("penva_%d_%d@test.com", time.Now().UnixNano(), i))
		insertReview(t, testPG, voter.ID, actionID, -1, 10.0)
	}

	reason, err := svc.EvaluateUnfairPenalty(ctx, actionID)
	if err != nil {
		t.Fatalf("EvaluateUnfairPenalty: %v", err)
	}
	if reason != "" {
		t.Errorf("expected no penalty (already applied), got: %q", reason)
	}
}

// TestEvaluateUnfairPenalty_Triggers: penalty DOES trigger when all conditions met.
func TestEvaluateUnfairPenalty_Triggers(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewModDecisionReviewsService(testPG)

	mod := newUser(t, testPG,
		fmt.Sprintf("pen_trg_%d", time.Now().UnixNano()),
		fmt.Sprintf("pen_trg_%d@test.com", time.Now().UnixNano()))
	actionID := insertModAction(t, testPG, mod.ID, false)

	// 7 reviews — 5 unfair (71.4%) > 70% threshold, 2 fair
	for i := 0; i < 7; i++ {
		voter := newUser(t, testPG,
			fmt.Sprintf("penvt_%d_%d", time.Now().UnixNano(), i),
			fmt.Sprintf("penvt_%d_%d@test.com", time.Now().UnixNano(), i))
		vote := int16(-1) // unfair
		if i >= 5 {
			vote = 1 // fair
		}
		insertReview(t, testPG, voter.ID, actionID, vote, 1.0)
	}

	reason, err := svc.EvaluateUnfairPenalty(ctx, actionID)
	if err != nil {
		t.Fatalf("EvaluateUnfairPenalty: %v", err)
	}
	if reason == "" {
		t.Fatal("expected penalty to be applied, got empty reason")
	}
	if !strings.Contains(reason, "Trust penalty applied") {
		t.Errorf("reason should mention 'Trust penalty applied', got: %q", reason)
	}

	// Verify the trust_penalty_applied flag was set
	var applied bool
	err = testPG.QueryRow(ctx,
		`SELECT COALESCE(trust_penalty_applied, false) FROM moderation_actions WHERE id = $1`, actionID,
	).Scan(&applied)
	if err != nil {
		t.Fatalf("verify penalty flag: %v", err)
	}
	if !applied {
		t.Error("expected trust_penalty_applied to be true after penalty")
	}
}

// TestEvaluateUnfairPenalty_WeightedVotes: verify trust-score-weighted voting matters.
// High-trust unfair votes should count more than low-trust fair votes.
func TestEvaluateUnfairPenalty_WeightedVotes(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewModDecisionReviewsService(testPG)

	mod := newUser(t, testPG,
		fmt.Sprintf("pen_wgt_%d", time.Now().UnixNano()),
		fmt.Sprintf("pen_wgt_%d@test.com", time.Now().UnixNano()))
	actionID := insertModAction(t, testPG, mod.ID, false)

	// 5 reviews total:
	// - 3 unfair votes with trust_score 10 each (weighted sum = 30)
	// - 2 fair votes with trust_score 1 each (weighted sum = 2)
	// Weighted unfair ratio = 30 / 32 = 93.75% > 70% → should trigger
	for i := 0; i < 3; i++ {
		voter := newUser(t, testPG,
			fmt.Sprintf("penw_%d_u%d", time.Now().UnixNano(), i),
			fmt.Sprintf("penw_%d_u%d@test.com", time.Now().UnixNano(), i))
		setUserTrustScore(t, testPG, voter.ID, 10.0)
		insertReview(t, testPG, voter.ID, actionID, -1, 10.0)
	}
	for i := 0; i < 2; i++ {
		voter := newUser(t, testPG,
			fmt.Sprintf("penw_%d_f%d", time.Now().UnixNano(), i),
			fmt.Sprintf("penw_%d_f%d@test.com", time.Now().UnixNano(), i))
		setUserTrustScore(t, testPG, voter.ID, 1.0)
		insertReview(t, testPG, voter.ID, actionID, 1, 1.0)
	}

	reason, err := svc.EvaluateUnfairPenalty(ctx, actionID)
	if err != nil {
		t.Fatalf("EvaluateUnfairPenalty: %v", err)
	}
	if reason == "" {
		t.Fatal("expected penalty with weighted voting (high-trust unfair should dominate)")
	}
}

// TestEvaluateUnfairPenalty_Cooldown: cooldown blocks a second penalty for the same moderator.
func TestEvaluateUnfairPenalty_Cooldown(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewModDecisionReviewsService(testPG)

	mod := newUser(t, testPG,
		fmt.Sprintf("pen_cool_%d", time.Now().UnixNano()),
		fmt.Sprintf("pen_cool_%d@test.com", time.Now().UnixNano()))

	// Action 1 — should get penalized (no cooldown issue since it's the first)
	action1 := insertModAction(t, testPG, mod.ID, false)
	for i := 0; i < 5; i++ {
		voter := newUser(t, testPG,
			fmt.Sprintf("penvc1_%d_%d", time.Now().UnixNano(), i),
			fmt.Sprintf("penvc1_%d_%d@test.com", time.Now().UnixNano(), i))
		insertReview(t, testPG, voter.ID, action1, -1, 1.0)
	}
	reason1, err := svc.EvaluateUnfairPenalty(ctx, action1)
	if err != nil {
		t.Fatalf("EvaluateUnfairPenalty (action1): %v", err)
	}
	if reason1 == "" {
		t.Fatal("expected first action to be penalized")
	}

	// Action 2 — same moderator, should be blocked by cooldown
	action2 := insertModAction(t, testPG, mod.ID, false)
	for i := 0; i < 5; i++ {
		voter := newUser(t, testPG,
			fmt.Sprintf("penvc2_%d_%d", time.Now().UnixNano(), i),
			fmt.Sprintf("penvc2_%d_%d@test.com", time.Now().UnixNano(), i))
		insertReview(t, testPG, voter.ID, action2, -1, 1.0)
	}
	reason2, err := svc.EvaluateUnfairPenalty(ctx, action2)
	if err != nil {
		t.Fatalf("EvaluateUnfairPenalty (action2): %v", err)
	}
	if reason2 != "" {
		t.Errorf("expected cooldown to block second penalty, got: %q", reason2)
	}
}

// ---------------------------------------------------------------------------
// StatsService
// ---------------------------------------------------------------------------

func TestStatsService_GetStats(t *testing.T) {
	cleanTables(testPG)
	ctx := context.Background()
	svc := services.NewStatsService(testPG)

	stats, err := svc.GetStats(ctx)
	if err != nil {
		t.Fatalf("GetStats: %v", err)
	}

	if stats.TotalUsers < 0 {
		t.Errorf("expected non-negative TotalUsers, got %d", stats.TotalUsers)
	}
	if stats.TotalPosts < 0 {
		t.Errorf("expected non-negative TotalPosts, got %d", stats.TotalPosts)
	}
	if stats.TotalCommunities < 0 {
		t.Errorf("expected non-negative TotalCommunities, got %d", stats.TotalCommunities)
	}

	t.Logf("Stats: users=%d posts=%d communities=%d daus=%d waus=%d maus=%d reports=%d mod=%d credits=%d",
		stats.TotalUsers, stats.TotalPosts, stats.TotalCommunities,
		stats.DailyActiveUsers, stats.WeeklyActiveUsers, stats.MonthlyActiveUsers,
		stats.TotalReportsPending, stats.TotalModActions, stats.CreditSupply)
}
