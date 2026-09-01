package services_test

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
	"github.com/opencode-ai/polaris/internal/worker"
)

func cleanFeatureTables() {
	ctx := context.Background()
	exec := func(q string) { testPG.Exec(ctx, q) }
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
	exec("DELETE FROM posts")
	exec("DELETE FROM users")
}

// ── UserListService ──────────────────────────────────────────

func TestULS_CreateAndGet(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserListService(testPG, nil)

	u := newUser(t, testPG, "ulg1", fmt.Sprintf("ulg1_%d@test.com", time.Now().UnixNano()))

	list, err := svc.CreateUserList(ctx, u.ID, model.CreateUserListRequest{
		Name: "Test List", Description: "desc", ListType: 0, Visibility: 0,
	})
	if err != nil {
		t.Fatalf("CreateUserList: %v", err)
	}
	if list.Name != "Test List" {
		t.Errorf("got %q", list.Name)
	}

	got, _ := svc.GetUserList(ctx, list.ID)
	if got.Name != list.Name {
		t.Errorf("got %q", got.Name)
	}
}

func TestULS_List(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserListService(testPG, nil)

	u := newUser(t, testPG, "ul21", fmt.Sprintf("ul21_%d@test.com", time.Now().UnixNano()))

	svc.CreateUserList(ctx, u.ID, model.CreateUserListRequest{Name: "A", ListType: 0, Visibility: 0})
	svc.CreateUserList(ctx, u.ID, model.CreateUserListRequest{Name: "B", ListType: 0, Visibility: 0})

	lists, _ := svc.ListUserLists(ctx, u.ID)
	if len(lists) != 2 {
		t.Errorf("expected 2, got %d", len(lists))
	}
}

func TestULS_UpdateDelete(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserListService(testPG, nil)

	u := newUser(t, testPG, "ul31", fmt.Sprintf("ul31_%d@test.com", time.Now().UnixNano()))

	list, _ := svc.CreateUserList(ctx, u.ID, model.CreateUserListRequest{Name: "Old", ListType: 0, Visibility: 0})

	updated, err := svc.UpdateUserList(ctx, list.ID, u.ID, model.UpdateUserListRequest{Name: strPtr("New")})
	if err != nil {
		t.Fatalf("Update: %v", err)
	}
	if updated.Name != "New" {
		t.Errorf("got %q", updated.Name)
	}

	svc.DeleteUserList(ctx, list.ID, u.ID)
	if _, err := svc.GetUserList(ctx, list.ID); err == nil {
		t.Error("expected error after delete")
	}
}

func TestULS_Members(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserListService(testPG, nil)

	o := newUser(t, testPG, "ul41", fmt.Sprintf("ul41_%d@test.com", time.Now().UnixNano()))
	tg := newUser(t, testPG, "ul42", fmt.Sprintf("ul42_%d@test.com", time.Now().UnixNano()))

	list, _ := svc.CreateUserList(ctx, o.ID, model.CreateUserListRequest{Name: "Mems", ListType: 0, Visibility: 0})

	m, err := svc.AddMember(ctx, list.ID, o.ID, tg.ID)
	if err != nil {
		t.Fatalf("AddMember: %v", err)
	}
	if m.TargetUserID != tg.ID {
		t.Errorf("got %d", m.TargetUserID)
	}

	ms, _ := svc.ListMembers(ctx, list.ID)
	if len(ms) != 1 {
		t.Fatalf("expected 1, got %d", len(ms))
	}

	svc.RemoveMember(ctx, list.ID, o.ID, tg.ID)
	ms, _ = svc.ListMembers(ctx, list.ID)
	if len(ms) != 0 {
		t.Errorf("expected 0, got %d", len(ms))
	}
}

func TestULS_Subscribe(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserListService(testPG, nil)

	o := newUser(t, testPG, "ul_sb_o", fmt.Sprintf("ul_sb_o_%d@test.com", time.Now().UnixNano()))
	s := newUser(t, testPG, "ul_sb_u", fmt.Sprintf("ul_sb_u_%d@test.com", time.Now().UnixNano()))

	list, _ := svc.CreateUserList(ctx, o.ID, model.CreateUserListRequest{Name: "Subs", ListType: 0, Visibility: 1})

	sub, _ := svc.Subscribe(ctx, list.ID, s.ID)
	if sub.UserID != s.ID {
		t.Errorf("expected user %d, got %d", s.ID, sub.UserID)
	}

	// Re-subscribe should upsert (idempotent), not error
	sub2, err := svc.Subscribe(ctx, list.ID, s.ID)
	if err != nil {
		t.Errorf("unexpected error on re-subscribe: %v", err)
	}
	if sub2.UserID != s.ID {
		t.Errorf("expected user %d, got %d", s.ID, sub2.UserID)
	}
	if !sub2.Active {
		t.Error("expected active=true after re-subscribe")
	}

	svc.Unsubscribe(ctx, list.ID, s.ID)
	subs, _ := svc.ListSubscribers(ctx, list.ID)
	if len(subs) != 0 {
		t.Errorf("expected 0 after unsubscribe, got %d", len(subs))
	}
}

func TestULS_Collaborators(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserListService(testPG, nil)

	o := newUser(t, testPG, "ul61", fmt.Sprintf("ul61_%d@test.com", time.Now().UnixNano()))
	e := newUser(t, testPG, "ul62", fmt.Sprintf("ul62_%d@test.com", time.Now().UnixNano()))

	list, _ := svc.CreateUserList(ctx, o.ID, model.CreateUserListRequest{Name: "Collab", ListType: 0, Visibility: 0})

	c, err := svc.InviteCollaborator(ctx, list.ID, o.ID, e.ID, 1)
	if err != nil {
		t.Fatalf("Invite: %v", err)
	}
	if c.UserID != e.ID {
		t.Errorf("got %d", c.UserID)
	}

	accepted, _ := svc.AcceptInvite(ctx, list.ID, e.ID)
	if accepted.AcceptedAt == nil {
		t.Error("expected accepted_at to be set")
	}

	cs, _ := svc.ListCollaborators(ctx, list.ID)
	if len(cs) != 1 {
		t.Fatalf("expected 1, got %d", len(cs))
	}
	svc.RemoveCollaborator(ctx, list.ID, o.ID, e.ID)
}

func TestULS_Forbidden(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserListService(testPG, nil)

	o := newUser(t, testPG, "ul71", fmt.Sprintf("ul71_%d@test.com", time.Now().UnixNano()))
	x := newUser(t, testPG, "ul72", fmt.Sprintf("ul72_%d@test.com", time.Now().UnixNano()))

	list, _ := svc.CreateUserList(ctx, o.ID, model.CreateUserListRequest{Name: "FB", ListType: 0, Visibility: 0})

	if _, err := svc.UpdateUserList(ctx, list.ID, x.ID, model.UpdateUserListRequest{Name: strPtr("X")}); err == nil {
		t.Error("expected error on update by non-owner")
	}
	if err := svc.DeleteUserList(ctx, list.ID, x.ID); err == nil {
		t.Error("expected error on delete by non-owner")
	}
	if _, err := svc.AddMember(ctx, list.ID, x.ID, x.ID); err == nil {
		t.Error("expected error on add by non-owner")
	}
}

func TestULS_MultiSub(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserListService(testPG, nil)

	o := newUser(t, testPG, "ul81", fmt.Sprintf("ul81_%d@test.com", time.Now().UnixNano()))
	a := newUser(t, testPG, "ul82", fmt.Sprintf("ul82_%d@test.com", time.Now().UnixNano()))
	b := newUser(t, testPG, "ul83", fmt.Sprintf("ul83_%d@test.com", time.Now().UnixNano()))

	list, _ := svc.CreateUserList(ctx, o.ID, model.CreateUserListRequest{Name: "M", ListType: 0, Visibility: 1})
	svc.Subscribe(ctx, list.ID, a.ID)
	svc.Subscribe(ctx, list.ID, b.ID)

	subs, _ := svc.ListSubscribers(ctx, list.ID)
	if len(subs) != 2 {
		t.Errorf("expected 2, got %d", len(subs))
	}

	us, _ := svc.ListUserSubscriptions(ctx, a.ID)
	if len(us) != 1 {
		t.Errorf("expected a to have 1, got %d", len(us))
	}
}

func TestULS_Meta(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserListService(testPG, nil)

	o := newUser(t, testPG, "ul91", fmt.Sprintf("ul91_%d@test.com", time.Now().UnixNano()))
	v := newUser(t, testPG, "ul92", fmt.Sprintf("ul92_%d@test.com", time.Now().UnixNano()))

	list, _ := svc.CreateUserList(ctx, o.ID, model.CreateUserListRequest{Name: "M", ListType: 0, Visibility: 1})
	svc.Subscribe(ctx, list.ID, v.ID)

	lists, err := svc.ListUserLists(ctx, v.ID)
	if err != nil {
		t.Fatalf("ListUserLists: %v", err)
	}
	if len(lists) > 0 {
		if lists[0].Name != "M" {
			t.Errorf("got %q", lists[0].Name)
		}
	}
}

func TestULS_ApplyAction(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserListService(testPG, nil)

	o := newUser(t, testPG, "ul101", fmt.Sprintf("ul101_%d@test.com", time.Now().UnixNano()))
	m := newUser(t, testPG, "ul102", fmt.Sprintf("ul102_%d@test.com", time.Now().UnixNano()))
	tg := newUser(t, testPG, "ul103", fmt.Sprintf("ul103_%d@test.com", time.Now().UnixNano()))

	list, _ := svc.CreateUserList(ctx, o.ID, model.CreateUserListRequest{Name: "A", ListType: 0, Visibility: 1})
	svc.AddMember(ctx, list.ID, o.ID, tg.ID)
	sub, _ := svc.Subscribe(ctx, list.ID, m.ID)

	if err := svc.ApplyListAction(ctx, sub.ID); err != nil {
		t.Fatalf("ApplyListAction: %v", err)
	}
}

// ── AlgorithmicListService ─────────────────────────────────────

func TestALS_Create(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewAlgorithmicListService(testPG)

	u := newUser(t, testPG, "al11", fmt.Sprintf("al11_%d@test.com", time.Now().UnixNano()))

	list, err := svc.CreateAlgorithmicList(ctx, u.ID, model.CreateAlgorithmicListRequest{
		Name:       "New Users",
		Visibility: 0,
		Scope:      0,
		Criteria:   model.AlgorithmicListCriteria{},
		Refresh:    "24h",
	})
	if err != nil {
		t.Fatalf("Create: %v", err)
	}
	if !list.IsAlgorithmic {
		t.Error("expected IsAlgorithmic=true")
	}

	// Evaluate
	result, err := svc.EvaluateAlgorithmicList(ctx, list.ID, u.ID)
	if err != nil {
		t.Fatalf("Evaluate: %v", err)
	}
	_ = result
}

func TestALS_UpdateRefresh(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewAlgorithmicListService(testPG)

	u := newUser(t, testPG, "al21", fmt.Sprintf("al21_%d@test.com", time.Now().UnixNano()))

	list, _ := svc.CreateAlgorithmicList(ctx, u.ID, model.CreateAlgorithmicListRequest{
		Name: "Refresh", Visibility: 0, Scope: 0, Criteria: model.AlgorithmicListCriteria{}, Refresh: "24h",
	})

	err := svc.UpdateAlgorithmicListCriteria(ctx, list.ID, u.ID, model.AlgorithmicListCriteria{
		MinTrustLevel: int16Ptr(3),
	})
	if err != nil {
		t.Fatalf("Update: %v", err)
	}

	if err := svc.RefreshAlgorithmicLists(ctx); err != nil {
		t.Fatalf("Refresh: %v", err)
	}
}

func TestALS_WithCriteria(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewAlgorithmicListService(testPG)

	u := newUser(t, testPG, "al31", fmt.Sprintf("al31_%d@test.com", time.Now().UnixNano()))

	minPosts := 5
	minScore := int64(100)
	list, _ := svc.CreateAlgorithmicList(ctx, u.ID, model.CreateAlgorithmicListRequest{
		Name: "Active", Visibility: 0, Scope: 0,
		Criteria: model.AlgorithmicListCriteria{
			MinPostsLast30Days: &minPosts,
			MinReactionScore:   &minScore,
		},
		Refresh: "6h",
	})

	result, err := svc.EvaluateAlgorithmicList(ctx, list.ID, u.ID)
	if err != nil {
		t.Fatalf("Evaluate: %v", err)
	}
	_ = result
}

// ── UserAffinityService ────────────────────────────────────────

func TestUAF_Compute(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserAffinityService(testPG)

	newUser(t, testPG, "af11", fmt.Sprintf("af11_%d@test.com", time.Now().UnixNano()))
	newUser(t, testPG, "af12", fmt.Sprintf("af12_%d@test.com", time.Now().UnixNano()))

	if err := svc.ComputeAffinity(ctx); err != nil {
		t.Fatalf("Compute: %v", err)
	}
}

func TestUAF_GetAffinities(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserAffinityService(testPG)

	u := newUser(t, testPG, "af21", fmt.Sprintf("af21_%d@test.com", time.Now().UnixNano()))
	newUser(t, testPG, "af22", fmt.Sprintf("af22_%d@test.com", time.Now().UnixNano()))

	svc.ComputeAffinity(ctx)

	affs, err := svc.GetUserAffinities(ctx, u.ID, 10)
	if err != nil {
		t.Fatalf("GetUserAffinities: %v", err)
	}
	_ = affs
}

func TestUAF_SimilarUsers(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserAffinityService(testPG)

	u := newUser(t, testPG, "af31", fmt.Sprintf("af31_%d@test.com", time.Now().UnixNano()))
	newUser(t, testPG, "af32", fmt.Sprintf("af32_%d@test.com", time.Now().UnixNano()))

	svc.ComputeAffinity(ctx)

	similar, err := svc.GetSimilarUsers(ctx, u.ID, 10)
	if err != nil {
		t.Fatalf("GetSimilarUsers: %v", err)
	}
	_ = similar
}

func TestUAF_WithInteractions(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewUserAffinityService(testPG)
	ps := services.NewPostService(testPG)

	u1 := newUser(t, testPG, "af41", fmt.Sprintf("af41_%d@test.com", time.Now().UnixNano()))
	u2 := newUser(t, testPG, "af42", fmt.Sprintf("af42_%d@test.com", time.Now().UnixNano()))
	u3 := newUser(t, testPG, "af43", fmt.Sprintf("af43_%d@test.com", time.Now().UnixNano()))

	post, _ := ps.CreatePost(ctx, u1.ID, model.CreatePostRequest{Title: "Aff", Body: "Test"})

	testPG.Exec(ctx, `INSERT INTO interactions (user_id, target_type, target_id, interaction_type) VALUES ($1, 'post', $2, 'like')`, u2.ID, &post.Post.ID)
	testPG.Exec(ctx, `INSERT INTO interactions (user_id, target_type, target_id, interaction_type) VALUES ($1, 'post', $2, 'like')`, u3.ID, &post.Post.ID)

	if err := svc.ComputeAffinity(ctx); err != nil {
		t.Fatalf("Compute: %v", err)
	}
	affs, _ := svc.GetUserAffinities(ctx, u1.ID, 10)
	_ = affs
}

// ── FeedPluginService ─────────────────────────────────────────

func TestFPS_CreateGet(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewFeedPluginService(testPG)

	u := newUser(t, testPG, "fp11", fmt.Sprintf("fp11_%d@test.com", time.Now().UnixNano()))

	plugin, err := svc.CreatePlugin(ctx, u.ID, model.CreateFeedPluginRequest{
		Name: "TP", Description: "d", Version: "1.0.0", PluginType: 0, PriceCredits: 0,
	}, []byte(`(module)`), "sha256-t1")
	if err != nil {
		t.Fatalf("Create: %v", err)
	}
	if plugin.Name != "TP" {
		t.Errorf("got %q", plugin.Name)
	}

	got, _ := svc.GetPlugin(ctx, plugin.ID)
	if got.Name != plugin.Name {
		t.Errorf("got %q", got.Name)
	}
}

func TestFPS_InstallExecute(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewFeedPluginService(testPG)

	a := newUser(t, testPG, "fp21", fmt.Sprintf("fp21_%d@test.com", time.Now().UnixNano()))
	u := newUser(t, testPG, "fp22", fmt.Sprintf("fp22_%d@test.com", time.Now().UnixNano()))

	plugin, _ := svc.CreatePlugin(ctx, a.ID, model.CreateFeedPluginRequest{
		Name: "Exe", Description: "d", Version: "1.0.0", PluginType: 0, PriceCredits: 0,
	}, []byte(`(module)`), "sha256-e1")

	cfg := `{"t":"c"}`
	inst, _ := svc.InstallPlugin(ctx, u.ID, plugin.ID, &cfg)
	if inst.UserID != u.ID {
		t.Errorf("got %d", inst.UserID)
	}

	is, _ := svc.ListInstalls(ctx, u.ID)
	if len(is) != 1 {
		t.Errorf("expected 1, got %d", len(is))
	}

	res, err := svc.ExecutePlugin(ctx, plugin.ID, []int64{1, 2}, map[string]any{"u": u.ID})
	if err != nil {
		t.Fatalf("Execute: %v", err)
	}
	_ = res
}

func TestFPS_Review(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewFeedPluginService(testPG)

	a := newUser(t, testPG, "fp31", fmt.Sprintf("fp31_%d@test.com", time.Now().UnixNano()))
	r := newUser(t, testPG, "fp32", fmt.Sprintf("fp32_%d@test.com", time.Now().UnixNano()))

	plugin, _ := svc.CreatePlugin(ctx, a.ID, model.CreateFeedPluginRequest{
		Name: "Rv", Description: "d", Version: "1.0.0", PluginType: 0, PriceCredits: 0,
	}, []byte(`(module)`), "sha256-r1")

	rev, _ := svc.ReviewPlugin(ctx, r.ID, plugin.ID, 4, "G!")
	if rev.Rating != 4 {
		t.Errorf("got %d", rev.Rating)
	}
}

func TestFPS_List(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewFeedPluginService(testPG)

	u := newUser(t, testPG, "fp41", fmt.Sprintf("fp41_%d@test.com", time.Now().UnixNano()))

	svc.CreatePlugin(ctx, u.ID, model.CreateFeedPluginRequest{
		Name: "P1", Description: "d", Version: "1.0.0", PluginType: 0, PriceCredits: 0,
	}, []byte(`(module)`), "sha1")
	svc.CreatePlugin(ctx, u.ID, model.CreateFeedPluginRequest{
		Name: "P2", Description: "d", Version: "1.0.0", PluginType: 0, PriceCredits: 0,
	}, []byte(`(module)`), "sha2")

	r := true
	plugins, err := svc.ListPlugins(ctx, &r, "newest")
	if err != nil {
		t.Fatalf("List: %v", err)
	}
	_ = plugins
}

func TestFPS_Uninstall(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	svc := services.NewFeedPluginService(testPG)

	a := newUser(t, testPG, "fp51", fmt.Sprintf("fp51_%d@test.com", time.Now().UnixNano()))
	u := newUser(t, testPG, "fp52", fmt.Sprintf("fp52_%d@test.com", time.Now().UnixNano()))

	plugin, _ := svc.CreatePlugin(ctx, a.ID, model.CreateFeedPluginRequest{
		Name: "Uni", Description: "d", Version: "1.0.0", PluginType: 0, PriceCredits: 0,
	}, []byte(`(module)`), "sha256-u1")

	svc.InstallPlugin(ctx, u.ID, plugin.ID, nil)

	if err := svc.UninstallPlugin(ctx, u.ID, plugin.ID); err != nil {
		t.Fatalf("Uninstall: %v", err)
	}
	is, _ := svc.ListInstalls(ctx, u.ID)
	if len(is) != 0 {
		t.Errorf("expected 0, got %d", len(is))
	}
}

// ── Workers ──────────────────────────────────────────────────

func TestWorker_Affinity(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	if err := worker.RunAffinityComputation(ctx, testPG); err != nil {
		t.Fatalf("RunAffinityComputation: %v", err)
	}
}

func TestWorker_AlgorithmicList(t *testing.T) {
	cleanTables(testPG)
	cleanFeatureTables()
	ctx := context.Background()
	if err := worker.RunAlgorithmicListRefresh(ctx, testPG); err != nil {
		t.Fatalf("RunAlgorithmicListRefresh: %v", err)
	}
}

// ── Helpers ──────────────────────────────────────────────────

func strPtr(s string) *string { return &s }
func int16Ptr(v int16) *int16 { return &v }
