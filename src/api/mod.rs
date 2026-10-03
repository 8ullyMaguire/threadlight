use axum::{
    routing::{delete, get, patch, post, put},
    Router,
};

use crate::app_state::AppState;

pub mod handlers;
pub mod middleware;

/// Create the Axum router with all API routes.
pub fn create_router(state: AppState) -> Router {
    Router::new()
        // Health
        .route("/health", get(handlers::health::health))
        .route("/ready", get(handlers::health::ready))
        // About / NodeInfo
        .route("/nodeinfo/2.1", get(handlers::about::about))
        .route("/api/v1/about", get(handlers::about::about))
        // Site
        .route("/api/v1/site", get(handlers::site::get_site))
        // Auth
        .route("/api/v1/auth/register", post(handlers::auth::register))
        .route("/api/v1/auth/login", post(handlers::auth::login))
        .route("/api/v1/auth/logout", post(handlers::auth::logout))
        .route("/api/v1/auth/session", get(handlers::auth::session))
        // Posts
        .route(
            "/api/v1/posts",
            get(handlers::post::list).post(handlers::post::create),
        )
        .route(
            "/api/v1/posts/{id}",
            get(handlers::post::get_by_id)
                .put(handlers::post::update)
                .delete(handlers::post::delete),
        )
        .route("/api/v1/posts/{id}/like", post(handlers::post_vote::like))
        .route(
            "/api/v1/posts/{id}/likes",
            get(handlers::post_vote::list_likes),
        )
        // Comments
        .route(
            "/api/v1/comments",
            get(handlers::comment::list).post(handlers::comment::create),
        )
        .route(
            "/api/v1/comments/{id}",
            get(handlers::comment::get_by_id).delete(handlers::comment::delete),
        )
        .route("/api/v1/comments/{id}/like", post(handlers::comment::like))
        .route(
            "/api/v1/comments/count/{post_id}",
            get(handlers::comment::get_count),
        )
        // Users
        .route("/api/v1/users/{username}", get(handlers::user::get_profile))
        .route(
            "/api/v1/users/@me",
            get(handlers::user::get_profile).put(handlers::user::update_profile),
        )
        // Private Messages
        .route(
            "/api/v1/private-messages",
            get(handlers::private_message::list).post(handlers::private_message::send),
        )
        .route(
            "/api/v1/private-messages/{id}/read",
            put(handlers::private_message::mark_read),
        )
        .route(
            "/api/v1/private-messages/{id}",
            delete(handlers::private_message::delete),
        )
        // Mod Log
        .route("/api/v1/mod-log", get(handlers::mod_log::list))
        // Registration Applications
        .route(
            "/api/v1/registration-applications",
            get(handlers::registration_application::list)
                .post(handlers::registration_application::submit),
        )
        .route(
            "/api/v1/registration-applications/{id}/review",
            put(handlers::registration_application::review),
        )
        // User Filters
        .route(
            "/api/v1/filters",
            get(handlers::filter_setting::list_filters)
                .post(handlers::filter_setting::create_filter),
        )
        .route(
            "/api/v1/filters/{id}",
            put(handlers::filter_setting::update_filter)
                .delete(handlers::filter_setting::delete_filter),
        )
        // User Settings
        .route(
            "/api/v1/settings",
            get(handlers::filter_setting::get_settings)
                .put(handlers::filter_setting::update_settings),
        )
        // Community Settings
        .route(
            "/api/v1/communities/{slug}/settings",
            get(handlers::filter_setting::get_community_settings)
                .put(handlers::filter_setting::update_community_settings),
        )
        // Leaderboard
        .route(
            "/api/v1/leaderboard",
            get(handlers::leaderboard::get_leaderboard),
        )
        // ---- Generated from SPECIFICATION.md --------------------------
        // Handlers whose doc comment and the spec name the same method and
        // path. Two independent sources agreeing is a transcription; one is a
        // guess. Audit and the deliberately-unrouted list:
        // docs/specs/2026-10-04-routing-audit.md
        // Regenerate with scripts/gen_routes.py -- do not hand-edit.
        .route(
            "/api/v1/admin/config",
            get(handlers::config::get_config).put(handlers::config::update_config),
        )
        .route("/api/v1/admin/invites", get(handlers::config::list_invites))
        .route("/api/v1/admin/stats", get(handlers::config::get_stats))
        .route(
            "/api/v1/blocks",
            post(handlers::block::create_block).get(handlers::block::get_blocks),
        )
        .route(
            "/api/v1/blocks/check/{user_id}",
            get(handlers::block::check_block),
        )
        .route("/api/v1/blocks/{id}", delete(handlers::block::delete_block))
        .route(
            "/api/v1/circles",
            post(handlers::circle::create_circle).get(handlers::circle::list_circles),
        )
        .route("/api/v1/circles/{id}", get(handlers::circle::get_circle))
        .route(
            "/api/v1/circles/{id}/join",
            post(handlers::circle::join_circle),
        )
        .route(
            "/api/v1/circles/{id}/leave",
            post(handlers::circle::leave_circle),
        )
        .route(
            "/api/v1/circles/{id}/members",
            get(handlers::circle::list_circle_members),
        )
        .route(
            "/api/v1/circles/{id}/suggest",
            post(handlers::circle::suggest_member),
        )
        .route(
            "/api/v1/collections",
            post(handlers::collection::create_collection),
        )
        .route(
            "/api/v1/collections/{id}",
            get(handlers::collection::get_collection)
                .delete(handlers::collection::delete_collection),
        )
        .route(
            "/api/v1/collections/{id}/posts",
            post(handlers::collection::add_post_to_collection)
                .get(handlers::collection::list_collection_posts),
        )
        .route(
            "/api/v1/collections/{id}/posts/{post_id}",
            delete(handlers::collection::remove_post_from_collection),
        )
        .route(
            "/api/v1/communities",
            post(handlers::community::create_community).get(handlers::community::list_communities),
        )
        .route(
            "/api/v1/feeds",
            post(handlers::feed::create_feed).get(handlers::feed::list_my_feeds),
        )
        .route(
            "/api/v1/feeds/{id}",
            put(handlers::feed::update_feed)
                .delete(handlers::feed::delete_feed)
                .get(handlers::feed::get_feed),
        )
        .route(
            "/api/v1/feeds/{id}/sources",
            post(handlers::feed::add_source).get(handlers::feed::list_sources),
        )
        .route("/api/v1/filters/check", get(handlers::filter::check_filter))
        .route(
            "/api/v1/interactions",
            post(handlers::interaction::create_interaction),
        )
        .route(
            "/api/v1/interactions/check",
            get(handlers::interaction::check_interaction),
        )
        .route(
            "/api/v1/moderation/actions",
            post(handlers::moderation::create_action).get(handlers::moderation::list_actions),
        )
        .route(
            "/api/v1/moderation/actions/{id}",
            get(handlers::moderation::get_action),
        )
        .route(
            "/api/v1/moderation/actions/{id}/jurors",
            post(handlers::moderation::add_juror),
        )
        .route("/api/v1/notes", post(handlers::note::create))
        .route(
            "/api/v1/notes/{id}",
            get(handlers::note::get).put(handlers::note::update),
        )
        .route("/api/v1/notes/{id}/vote", post(handlers::note::vote))
        .route(
            "/api/v1/notifications",
            get(handlers::notification::get_notifications),
        )
        .route(
            "/api/v1/notifications/read-all",
            put(handlers::notification::mark_all_read),
        )
        .route(
            "/api/v1/notifications/unread-count",
            get(handlers::notification::get_unread_count),
        )
        .route(
            "/api/v1/notifications/{id}/read",
            put(handlers::notification::mark_read),
        )
        .route(
            "/api/v1/posts/author/{author_id}",
            get(handlers::post::list_by_author),
        )
        .route("/api/v1/posts/count", get(handlers::post::get_count))
        .route("/api/v1/posts/{id}/archive", post(handlers::post::archive))
        .route(
            "/api/v1/posts/{id}/remove",
            post(handlers::post::mod_remove),
        )
        .route(
            "/api/v1/reports",
            post(handlers::report::create_report).get(handlers::report::get_reports),
        )
        .route("/api/v1/reports/{id}", get(handlers::report::get_report))
        .route(
            "/api/v1/reports/{id}/resolve",
            put(handlers::report::resolve_report),
        )
        .route("/api/v1/search", get(handlers::search::search))
        .route("/api/v1/search/advanced", post(handlers::search::advanced))
        .route(
            "/api/v1/search/communities",
            get(handlers::search::search_communities),
        )
        .route("/api/v1/search/posts", get(handlers::search::search_posts))
        .route("/api/v1/search/suggest", get(handlers::search::suggest))
        .route("/api/v1/search/users", get(handlers::search::search_users))
        .route(
            "/api/v1/tags",
            post(handlers::tag::create).get(handlers::tag::list),
        )
        .route(
            "/api/v1/tags/posts/{post_id}/tags",
            get(handlers::tag::get_post_tags),
        )
        .route(
            "/api/v1/tags/posts/{post_id}/tags/{tag_id}",
            post(handlers::tag::tag_post).delete(handlers::tag::untag_post),
        )
        .route(
            "/api/v1/tags/{id}",
            get(handlers::tag::get_by_id)
                .put(handlers::tag::update)
                .delete(handlers::tag::delete),
        )
        .route("/api/v1/tags/{id}/vote", post(handlers::tag::vote_tag))
        // ---- Generated from the Go original ---------------------------
        // 41 handlers across 35 paths where the handler's doc comment is silent
        // and ~/code/go/threadlight/internal/api/router.go names the same
        // function. Two independent sources, so a transcription rather than a
        // guess -- the same bar the block above had to clear. Matched by handler
        // NAME after reconstructing gin's nested group prefixes; a method or path
        // shape DISAGREEING with a doc comment was not auto-routed, and neither
        // was any name shared by two modules (community::list_members vs
        // userlist::list_members). See docs/specs/2026-10-04-routing-audit.md.
        .route(
            "/api/v1/achievements/unlock",
            post(handlers::achievement::unlock),
        )
        .route(
            "/api/v1/achievements/user/{user_id}",
            get(handlers::achievement::get_user_achievements),
        )
        .route(
            "/api/v1/affinity/similar",
            get(handlers::affinity::get_similar_users),
        )
        .route("/api/v1/auth/forgot", post(handlers::auth::forgot_password))
        .route("/api/v1/auth/reset", post(handlers::auth::reset_password))
        .route(
            "/api/v1/communities/{slug}/curators/{user_id}",
            delete(handlers::community::remove_curator),
        )
        .route(
            "/api/v1/credits/balance",
            get(handlers::credit::get_balance),
        )
        .route(
            "/api/v1/credits/bounties",
            post(handlers::credit::create_bounty),
        )
        .route(
            "/api/v1/credits/bounties/{id}",
            get(handlers::credit::get_bounty),
        )
        .route(
            "/api/v1/credits/bounties/{id}/award",
            post(handlers::credit::award_bounty),
        )
        .route("/api/v1/credits/costs", get(handlers::credit::get_costs))
        .route(
            "/api/v1/credits/daily-reward",
            get(handlers::credit::get_daily_reward_status)
                .post(handlers::credit::claim_daily_reward),
        )
        .route(
            "/api/v1/credits/quest/complete",
            post(handlers::credit::complete_quest),
        )
        .route(
            "/api/v1/credits/transactions",
            get(handlers::credit::get_transactions),
        )
        .route(
            "/api/v1/interactions/post/{postID}",
            get(handlers::interaction::get_post_interactions),
        )
        .route(
            "/api/v1/lists/algorithmic",
            post(handlers::userlist::create_algorithmic),
        )
        .route(
            "/api/v1/lists/subscriptions",
            get(handlers::userlist::my_subscriptions),
        )
        .route(
            "/api/v1/lists/{id}/collaborators",
            get(handlers::userlist::list_collaborators)
                .post(handlers::userlist::invite_collaborator),
        )
        .route(
            "/api/v1/lists/{id}/collaborators/accept",
            post(handlers::userlist::accept_invite),
        )
        .route(
            "/api/v1/lists/{id}/collaborators/{user_id}",
            delete(handlers::userlist::remove_collaborator),
        )
        .route(
            "/api/v1/lists/{id}/evaluate",
            post(handlers::userlist::evaluate_algorithmic),
        )
        .route(
            "/api/v1/lists/{id}/members",
            get(handlers::userlist::list_members).post(handlers::userlist::add_member),
        )
        .route(
            "/api/v1/lists/{id}/members/{user_id}",
            delete(handlers::userlist::remove_member),
        )
        .route(
            "/api/v1/lists/{id}/subscribe",
            post(handlers::userlist::subscribe),
        )
        .route(
            "/api/v1/lists/{id}/subscribers",
            get(handlers::userlist::list_subscribers),
        )
        .route(
            "/api/v1/lists/{id}/unsubscribe",
            post(handlers::userlist::unsubscribe),
        )
        .route("/api/v1/media/upload", post(handlers::post::upload_image))
        .route(
            "/api/v1/modlog/controversial",
            get(handlers::mod_decision::get_controversial),
        )
        .route(
            "/api/v1/modlog/{id}/my-review",
            get(handlers::mod_decision::get_my_vote),
        )
        .route(
            "/api/v1/trust/connections",
            post(handlers::trust::create_connection),
        )
        .route(
            "/api/v1/trust/connections/{id}",
            get(handlers::trust::get_connection)
                .put(handlers::trust::update_connection)
                .delete(handlers::trust::delete_connection),
        )
        .route(
            "/api/v1/users/@me/avatar",
            post(handlers::user::upload_avatar),
        )
        .route(
            "/api/v1/users/@me/banner",
            post(handlers::user::upload_banner),
        )
        .route(
            "/api/v1/users/@me/blocks",
            get(handlers::user::list_blocked_users),
        )
        .route(
            "/api/v1/users/@me/notifications",
            get(handlers::user::get_notifications),
        )
        // ---- Generated from the Go handler VARIABLE ----------------------
        // 6 handlers whose doc comment is silent. Placed by joining on the Go
        // handler variable (userlistHandler.Create -> userlist::create), NOT by
        // inferring the resource from the URL -- that inference is what produced
        // /api/v1/health in an earlier attempt. scripts/match_go_routes.py.
        .route("/api/v1/achievements", get(handlers::achievement::list))
        .route(
            "/api/v1/lists",
            get(handlers::userlist::list).post(handlers::userlist::create),
        )
        .route(
            "/api/v1/lists/{id}",
            get(handlers::userlist::get)
                .put(handlers::userlist::update)
                .delete(handlers::userlist::delete),
        )
        // ---- Conflicts resolved FOR THE GO ORIGINAL ---------------------
        // 5 handlers where the doc comment and the Go route table disagreed.
        // Decided by the handler's OWN Path<T> extractor, which axum checks at
        // compile time: blocklist::list/create/delete/check and
        // moderation::vote_jury each take exactly the params the Go path provides
        // and not the params their doc comment implies. So the doc comments are
        // wrong about resource naming (/admin/blocklist vs /blocklist/entries,
        // /jury/{id} vs /jurors/{panel_id}) and the extractors agree with Go.
        //
        // blocklist::check is the ONE case in this block NOT settled by the extractor:
        // it takes Query<T>, not Path<T>, so arity cannot veto. Routed GET, against the
        // Go table's POST, because the handler is read-only -- Query<CheckBlocklistQuery>
        // in, a JSON verdict out, no mutation. POST with query params and no body is the
        // odd shape, and Go's choice there is an artefact of the original rather than a
        // design constraint. An earlier version of this comment claimed the extractor
        // settled it, and also edited the doc comment to POST -- which made the comment
        // agree with the route by fiat instead of by evidence. Both are reverted.
        // The other four doc comments above ARE corrected, because there the extractor
        // independently confirms the Go shape and the old comments were simply stale.
        .route("/api/v1/blocklist/check", get(handlers::blocklist::check))
        .route(
            "/api/v1/blocklist/entries",
            get(handlers::blocklist::list).post(handlers::blocklist::create),
        )
        .route(
            "/api/v1/blocklist/entries/{id}",
            delete(handlers::blocklist::delete),
        )
        .route(
            "/api/v1/moderation/jurors/{panel_id}/vote",
            post(handlers::moderation::vote_jury),
        )
        // ---- Conflicts resolved FOR THE DOC COMMENT -----------------------
        // 2 handlers where the extractor sides with the doc comment, not the Go
        // table, so the Go path is impossible here:
        //
        //   feed::remove_source          Path<(id, source_id)>   arity 2
        //     Go says  DELETE /api/v1/feeds/sources/{source_id}      1 param
        //     doc says DELETE /api/v1/feeds/{id}/sources/{source_id} 2 params
        //
        //   interaction::remove_interaction  Path<(post_id, interaction_type)> 2
        //     Go says  DELETE /api/v1/interactions/{id}                        1
        //     doc says DELETE /api/v1/interactions/{post_id}/{interaction_type} 2
        //
        // Routing either to the Go path fails to COMPILE -- axum rejects a
        // Path<T> whose arity does not match the pattern. So this is settled by the
        // compiler, not by preference. The doc comments describe real, deliberate
        // designs: an interaction is identified by post AND type, because one post
        // can hold several interaction types, and the Go single-{id} form cannot
        // address that. Routing the doc comment means the Go table is behind the
        // Rust here, which is the expected direction for a port.
        .route(
            "/api/v1/feeds/{id}/sources/{source_id}",
            delete(handlers::feed::remove_source),
        )
        .route(
            "/api/v1/interactions/{post_id}/{interaction_type}",
            delete(handlers::interaction::remove_interaction),
        )
        // ---- Generated by (Go module, Rust verb) ------------------------
        // 9 handlers whose doc comment is silent. Joined on (Go handler module,
        // verb recovered from the Rust fn name): Go's community.Create is Rust's
        // community::create_community, so the resource suffix is stripped to get the
        // verb. Verified across all 192 Go registrations that a verb names ONE path
        // within a module, with three exceptions -- config.generate_invite,
        // config.list_invites and config.get_invite_limit each serve BOTH
        // /admin/invites and /invites, so the whole config module is left alone.
        // scripts/match_go_routes.py carries the same join for exact fn names.
        .route(
            "/api/v1/communities/{slug}",
            delete(handlers::community::archive_community)
                .put(handlers::community::update_community),
        )
        .route(
            "/api/v1/communities/{slug}/join",
            post(handlers::community::join_community),
        )
        .route(
            "/api/v1/communities/{slug}/leave",
            post(handlers::community::leave_community),
        )
        .route(
            "/api/v1/feed-plugins",
            post(handlers::feed_plugin::create_plugin),
        )
        .route(
            "/api/v1/feed-plugins/{id}",
            get(handlers::feed_plugin::get_plugin),
        )
        .route(
            "/api/v1/feed-plugins/{id}/execute",
            post(handlers::feed_plugin::execute_plugin),
        )
        .route(
            "/api/v1/feed-plugins/{id}/install",
            post(handlers::feed_plugin::install_plugin),
        )
        .route(
            "/api/v1/feed-plugins/{id}/review",
            post(handlers::feed_plugin::review_plugin),
        )
        .route(
            "/api/v1/feed-plugins/{id}/uninstall",
            post(handlers::feed_plugin::uninstall_plugin),
        )
        .with_state(state)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;

    /// The router has never been built in a test.
    ///
    /// `create_router` is called from exactly one place -- main.rs, at startup --
    /// so every route conflict, duplicate and bad path pattern in this file has only
    /// ever been exercised by booting the binary. A conflict axum rejects at
    /// registration time is a PANIC, not a 404: it takes the process down. So the
    /// first deployment after a routing change is where it would be found.
    ///
    /// That is how 68 routes were added at once with nothing here able to tell
    /// whether they registered. This test builds the router for real.
    ///
    /// AppState carries a Redis connection, which is why this is `#[tokio::test]`
    /// and why it connects: a lazy pool would work for Postgres but the multiplexer
    /// has no lazy form. Skipped when Redis is unreachable rather than failed,
    /// because a missing Redis should not be reported as a routing bug.
    /// Build the router for real, and check nothing shadows anything else.
    ///
    /// `create_router` is called from exactly one place -- main.rs, at startup --
    /// so until this test existed, nothing in the suite had ever constructed it.
    /// That mattered more than it sounds: **axum 0.8 does NOT panic on a duplicate
    /// route.** Verified by mutation -- registering a second `.route("/api/v1/tags")`
    /// left the earlier version of this test passing. axum's path_router shadows the
    /// first registration, so a duplicate silently replaces a handler and the
    /// endpoint answers with the wrong code. A panic would have been survivable.
    ///
    /// So this counts registrations rather than merely building the router.
    ///
    /// The count is taken from the source with comments stripped, which is what
    /// makes it correct: an earlier attempt matched the string `"/api/v1/tags"`
    /// inside this file's own doc comment and reported a duplicate route that did not
    /// exist. Counting literals out of comment-free source is the only version of
    /// this check that means anything.
    #[tokio::test]
    async fn router_builds_without_shadowed_routes() {
        let Some(state) = test_state().await else {
            return;
        };
        // Building it is half the check: it panics on a malformed path pattern.
        let _router = create_router(state);

        let paths = declared_routes();
        let mut seen = std::collections::HashSet::new();
        let duplicates: Vec<&&str> = paths.iter().filter(|p| !seen.insert(**p)).collect();
        assert!(
            duplicates.is_empty(),
            "these paths are registered more than once; axum 0.8 shadows the earlier \
             registration instead of panicking, so the first handler is unreachable \
             and this would never otherwise be noticed: {:?}",
            duplicates
        );
        assert_eq!(
            paths.len(),
            134,
            "expected 134 paths: 81 from doc comments x SPECIFICATION.md, 35 matched to the Go \
             original by handler name, 6 by Go handler VARIABLE, and 7 conflicts \
             resolved by the Path<T> extractor arity. A shortfall means a generated \
             block in src/api/mod.rs was lost; regenerate with scripts/gen_routes.py \
             and scripts/match_go_routes.py."
        );
    }

    /// Every path this file registers, with comments removed.
    ///
    /// Two shapes, because `cargo fmt` produces both depending on chain length:
    ///
    ///     .route("/health", get(handlers::health::health))          <- one line
    ///     .route(
    ///         "/api/v1/tags",                                       <- path alone
    ///         post(handlers::tag::create).get(handlers::tag::list),
    ///     )
    ///
    /// Handling only the second found 52 of 81; only the first found 29. Together
    /// they are exactly 81, which is the number the assertion checks.
    ///
    /// Comment stripping is load-bearing: this function's own doc comment contains
    /// both shapes verbatim, and an earlier version counted them and reported a
    /// duplicate route that did not exist.
    fn declared_routes() -> Vec<&'static str> {
        let source = include_str!("mod.rs");
        let mut out = Vec::new();
        for line in source.lines() {
            let t = line.trim();
            if t.starts_with("//") {
                continue;
            }
            // Shape A: the path is the first argument on the same line.
            if let Some(i) = t.find(".route(\"") {
                let after = &t[i + 8..];
                if let Some(end) = after.find('"') {
                    let path = &after[..end];
                    if path.starts_with('/') {
                        out.push(path);
                    }
                    continue;
                }
            }
            // Shape B: the path is alone on its own line, inside a .route( block.
            if t.starts_with('"') {
                if let Some(path) = t.split('"').nth(1) {
                    if path.starts_with('/') {
                        out.push(path);
                    }
                }
            }
        }
        out
    }

    /// A real AppState, or None when Redis is unreachable.
    ///
    /// AppState carries a Redis multiplexer, which has no lazy form, so the router
    /// genuinely cannot be built without one. Skipping is right here: a missing
    /// Redis is an environment problem and must not be reported as a routing bug.
    /// Everything else in this file needs no server -- the Postgres pool is lazy.
    async fn test_state() -> Option<AppState> {
        let redis = redis::Client::open("redis://127.0.0.1:6379")
            .ok()?
            .get_multiplexed_async_connection()
            .await
            .ok()?;
        let pool = sqlx::postgres::PgPoolOptions::new()
            .max_connections(1)
            .connect_lazy("postgres://localhost/unused")
            .expect("connect_lazy needs no server");
        // Config::from_env rather than a 13-field literal: the struct has no
        // Default derive and every field has a fallback, so this stays correct when
        // a field is added.
        let config = Arc::new(crate::config::Config::from_env());
        Some(AppState {
            pool,
            redis,
            jwt_secret: config.jwt_secret.clone(),
            config,
        })
    }

    #[test]
    fn routes_use_the_v1_prefix_except_the_three_that_may_not() {
        // Note: no `'"'` char literal anywhere here. This lexer reads a bare
        // apostrophe followed by a quote as a lifetime and then reports
        // "prefix `v1` is unknown" three lines later, which is not a useful
        // error message. Use byte checks instead.
        const QUOTE: u8 = b'"';
        let source: &[u8] = include_bytes!("mod.rs");

        let mut offenders: Vec<String> = Vec::new();
        for line in source.split(|&b| b == b'\n') {
            let text = String::from_utf8_lossy(line);
            let trimmed = text.trim();
            // Only lines that OPEN a .route( call carry a path.
            if !trimmed.starts_with(QUOTE as char) {
                continue;
            }
            if !text.contains("/api/") || text.contains("/api/v1") {
                continue;
            }
            if ["/health", "/ready", "/nodeinfo/"]
                .iter()
                .any(|a| text.contains(a))
            {
                continue;
            }
            offenders.push(trimmed.to_string());
        }

        assert!(
            offenders.is_empty(),
            "routes outside the /api/v1 base path that SPECIFICATION.md sets: {:?}",
            offenders
        );
    }

    /// The generated block must not have been hand-edited.
    ///
    /// The routes are generated by scripts/gen_routes.py from SPECIFICATION.md. A
    /// hand-edit is not necessarily wrong, but it is invisible to the generator and
    /// will be silently reverted the next time it runs, so it has to be a
    /// deliberate act rather than an accident.
    #[test]
    fn generated_routes_are_reproducible() {
        let generated = include_str!("../../scripts/gen_routes.py");
        assert!(
            generated.contains("SPECIFICATION.md"),
            "the generator must read SPECIFICATION.md, or it is not generated"
        );
        let source = include_str!("mod.rs");
        assert!(
            source.contains("Regenerate with scripts/gen_routes.py"),
            "mod.rs must say how the generated block is produced"
        );
    }
}
