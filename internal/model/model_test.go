package model

import (
	"encoding/json"
	"errors"
	"testing"
	"time"
)

func sptr(s string) *string     { return &s }
func bptr(b bool) *bool         { return &b }
func i64ptr(i int64) *int64     { return &i }
func tp(t time.Time) *time.Time { return &t }

func TestErrorSentinels(t *testing.T) {
	if !errors.Is(ErrNotFound, ErrNotFound) {
		t.Fatal("ErrNotFound should match itself")
	}
	if !errors.Is(ErrForbidden, ErrForbidden) {
		t.Fatal("ErrForbidden should match itself")
	}
	if !errors.Is(ErrUnauthorized, ErrUnauthorized) {
		t.Fatal("ErrUnauthorized should match itself")
	}
	if !errors.Is(ErrConflict, ErrConflict) {
		t.Fatal("ErrConflict should match itself")
	}
	if !errors.Is(ErrValidation, ErrValidation) {
		t.Fatal("ErrValidation should match itself")
	}
	if errors.Is(ErrNotFound, ErrForbidden) {
		t.Fatal("different errors should not match")
	}
	if ErrNotFound.Error() != "resource not found" {
		t.Fatalf("unexpected msg: %s", ErrNotFound.Error())
	}
	if ErrForbidden.Error() != "forbidden" {
		t.Fatalf("unexpected msg: %s", ErrForbidden.Error())
	}
	if ErrUnauthorized.Error() != "unauthorized" {
		t.Fatalf("unexpected msg: %s", ErrUnauthorized.Error())
	}
	if ErrConflict.Error() != "resource conflict" {
		t.Fatalf("unexpected msg: %s", ErrConflict.Error())
	}
	if ErrValidation.Error() != "validation error" {
		t.Fatalf("unexpected msg: %s", ErrValidation.Error())
	}
}

func TestUserJSON(t *testing.T) {
	now := time.Now()
	u := User{
		ID: 1, Username: "testuser", DisplayName: sptr("Test"), Bio: sptr("bio"),
		Email: "test@example.com", TrustLevel: 2, TrustScore: 5.0,
		Reputation: 100, Credits: 50, IsActive: true, OnboardingStage: 4,
		AvatarURL: sptr("https://example.com/av.jpg"), Theme: sptr("dark"),
		HideReadPosts: true, CreatedAt: now,
	}
	b, err := json.Marshal(u)
	if err != nil {
		t.Fatal(err)
	}
	var u2 User
	if err := json.Unmarshal(b, &u2); err != nil {
		t.Fatal(err)
	}
	if u2.ID != 1 || u2.Username != "testuser" || *u2.DisplayName != "Test" {
		t.Fatal("roundtrip failed")
	}
	if *u2.AvatarURL != "https://example.com/av.jpg" || *u2.Theme != "dark" {
		t.Fatal("roundtrip failed")
	}
}

func TestPostJSON(t *testing.T) {
	now := time.Now()
	p := Post{
		ID: 1, AuthorID: 1, Title: "Test Post", Body: "Body text",
		ContentType: 1, Mood: 2, IsEducational: true, IsEntertaining: false,
		IsNsfw: false, ContentWarning: sptr("nsfw"),
		InteractionCount: 10, CumulativeInteractions: 50, Status: 0,
		IsDeleted: false, CreatedAt: &now, UpdatedAt: &now,
	}
	b, err := json.Marshal(p)
	if err != nil {
		t.Fatal(err)
	}
	var p2 Post
	if err := json.Unmarshal(b, &p2); err != nil {
		t.Fatal(err)
	}
	if p2.ID != 1 || p2.Title != "Test Post" || *p2.ContentWarning != "nsfw" {
		t.Fatal("roundtrip failed")
	}
	if p2.InteractionCount != 10 || p2.CumulativeInteractions != 50 {
		t.Fatal("roundtrip failed")
	}
}

func TestTagJSON(t *testing.T) {
	now := time.Now()
	tg := Tag{
		ID: 1, Name: "golang", Description: "Go programming", Category: "programming",
		IsWiki: true, CreatedBy: 1, CreatedAt: now,
	}
	b, err := json.Marshal(tg)
	if err != nil {
		t.Fatal(err)
	}
	var tg2 Tag
	if err := json.Unmarshal(b, &tg2); err != nil {
		t.Fatal(err)
	}
	if tg2.ID != 1 || tg2.Name != "golang" || !tg2.IsWiki {
		t.Fatal("roundtrip failed")
	}
}

func TestCommunityJSON(t *testing.T) {
	now := time.Now()
	c := Community{
		ID: 1, Name: "Test Comm", Description: "A test", Slug: "test-comm",
		CuratorLock: false, SlowBootDays: 3, InviteOnly: true, MinTrustScore: 0.5,
		MemberCount: 10, CreatedBy: 1, CreatedAt: &now, UpdatedAt: &now,
	}
	b, err := json.Marshal(c)
	if err != nil {
		t.Fatal(err)
	}
	var c2 Community
	if err := json.Unmarshal(b, &c2); err != nil {
		t.Fatal(err)
	}
	if c2.ID != 1 || c2.Name != "Test Comm" || c2.Slug != "test-comm" {
		t.Fatal("roundtrip failed")
	}
	if c2.SlowBootDays != 3 || !c2.InviteOnly {
		t.Fatal("roundtrip failed")
	}
}

func TestAchievementJSON(t *testing.T) {
	a := Achievement{
		ID: 1, Code: "first_post", Name: "First Post", Description: "Made your first post",
		Icon: "star", Category: 1, SortOrder: 1,
	}
	b, err := json.Marshal(a)
	if err != nil {
		t.Fatal(err)
	}
	var a2 Achievement
	if err := json.Unmarshal(b, &a2); err != nil {
		t.Fatal(err)
	}
	if a2.ID != 1 || a2.Code != "first_post" || a2.Name != "First Post" {
		t.Fatal("roundtrip failed")
	}
}

func TestUserAchievementJSON(t *testing.T) {
	now := time.Now()
	ua := UserAchievement{
		ID: 1, UserID: 1, AchievementID: 1, UnlockedAt: now, Progress: 1.0, Visible: true,
	}
	b, err := json.Marshal(ua)
	if err != nil {
		t.Fatal(err)
	}
	var ua2 UserAchievement
	if err := json.Unmarshal(b, &ua2); err != nil {
		t.Fatal(err)
	}
	if ua2.ID != 1 || ua2.UserID != 1 || ua2.Progress != 1.0 {
		t.Fatal("roundtrip failed")
	}
}

func TestNotificationJSON(t *testing.T) {
	now := time.Now()
	n := Notification{
		ID: 1, UserID: 1, NotificationType: 1, ActorID: i64ptr(2), PostID: i64ptr(3),
		Body: "new reply", IsRead: false, CreatedAt: now,
	}
	b, err := json.Marshal(n)
	if err != nil {
		t.Fatal(err)
	}
	var n2 Notification
	if err := json.Unmarshal(b, &n2); err != nil {
		t.Fatal(err)
	}
	if n2.ID != 1 || n2.Body != "new reply" {
		t.Fatal("roundtrip failed")
	}
}

func TestInteractionJSON(t *testing.T) {
	now := time.Now()
	meta := map[string]interface{}{"key": "value"}
	i := Interaction{
		ID: 1, UserID: 1, PostID: 1, InteractionType: 1, Metadata: meta, CreatedAt: now,
	}
	b, err := json.Marshal(i)
	if err != nil {
		t.Fatal(err)
	}
	var i2 Interaction
	if err := json.Unmarshal(b, &i2); err != nil {
		t.Fatal(err)
	}
	if i2.ID != 1 || i2.InteractionType != 1 {
		t.Fatal("roundtrip failed")
	}
}

func TestSiteConfigJSON(t *testing.T) {
	now := time.Now()
	sc := SiteConfig{
		ID: 1, RegistrationMode: "open", InstanceName: "Polaris",
		Version: "0.1.0", PruneAgeDays: 180, PruneMinInteractions: 3,
		UpdatedAt: now,
	}
	b, err := json.Marshal(sc)
	if err != nil {
		t.Fatal(err)
	}
	var sc2 SiteConfig
	if err := json.Unmarshal(b, &sc2); err != nil {
		t.Fatal(err)
	}
	if sc2.ID != 1 || sc2.RegistrationMode != "open" || sc2.InstanceName != "Polaris" {
		t.Fatal("roundtrip failed")
	}
}

func TestContentFilterJSON(t *testing.T) {
	now := time.Now()
	f := ContentFilter{
		ID: 1, UserID: 1, FilterType: 1, FilterValue: "badword", FilterAction: 1, IsActive: true, CreatedAt: now,
	}
	b, err := json.Marshal(f)
	if err != nil {
		t.Fatal(err)
	}
	var f2 ContentFilter
	if err := json.Unmarshal(b, &f2); err != nil {
		t.Fatal(err)
	}
	if f2.ID != 1 || f2.FilterValue != "badword" || !f2.IsActive {
		t.Fatal("roundtrip failed")
	}
}

func TestBlockedUserJSON(t *testing.T) {
	now := time.Now()
	b := BlockedUser{ID: 1, BlockerID: 1, BlockedID: 2, CreatedAt: now}
	b2, err := json.Marshal(b)
	if err != nil {
		t.Fatal(err)
	}
	var b3 BlockedUser
	if err := json.Unmarshal(b2, &b3); err != nil {
		t.Fatal(err)
	}
	if b3.ID != 1 || b3.BlockerID != 1 || b3.BlockedID != 2 {
		t.Fatal("roundtrip failed")
	}
}

func TestCreditTransactionJSON(t *testing.T) {
	now := time.Now()
	ct := CreditTransaction{
		ID: 1, FromUser: i64ptr(1), ToUser: i64ptr(2), Amount: 100,
		TransactionType: 1, ReferenceID: i64ptr(10), Hash: "abc123", CreatedAt: now,
	}
	b, err := json.Marshal(ct)
	if err != nil {
		t.Fatal(err)
	}
	var ct2 CreditTransaction
	if err := json.Unmarshal(b, &ct2); err != nil {
		t.Fatal(err)
	}
	if ct2.ID != 1 || ct2.Amount != 100 || ct2.Hash != "abc123" {
		t.Fatal("roundtrip failed")
	}
}

func TestCircleJSON(t *testing.T) {
	now := time.Now()
	c := Circle{
		ID: 1, Name: "devs", Description: "dev circle", TagID: i64ptr(1),
		GridCell: "A1", MemberCount: 5, IsActive: true, LastActivity: &now, CreatedAt: now,
	}
	b, err := json.Marshal(c)
	if err != nil {
		t.Fatal(err)
	}
	var c2 Circle
	if err := json.Unmarshal(b, &c2); err != nil {
		t.Fatal(err)
	}
	if c2.ID != 1 || c2.Name != "devs" || c2.MemberCount != 5 {
		t.Fatal("roundtrip failed")
	}
}

func TestCollectionJSON(t *testing.T) {
	now := time.Now()
	updated := time.Now().Add(time.Hour)
	c := Collection{
		ID: 1, OwnerID: 1, Name: "favorites", Description: "my favs",
		Visibility: 1, IsDefault: false, CreatedAt: now, UpdatedAt: &updated,
	}
	b, err := json.Marshal(c)
	if err != nil {
		t.Fatal(err)
	}
	var c2 Collection
	if err := json.Unmarshal(b, &c2); err != nil {
		t.Fatal(err)
	}
	if c2.ID != 1 || c2.Name != "favorites" || c2.OwnerID != 1 {
		t.Fatal("roundtrip failed")
	}
}

func TestTrustConnectionJSON(t *testing.T) {
	now := time.Now()
	tc := TrustConnection{
		ID: 1, TrusterID: 1, TrusteeID: 2, Weight: 1.0, Signature: "sig",
		CreatedAt: now, ExpiresAt: &now,
	}
	b, err := json.Marshal(tc)
	if err != nil {
		t.Fatal(err)
	}
	var tc2 TrustConnection
	if err := json.Unmarshal(b, &tc2); err != nil {
		t.Fatal(err)
	}
	if tc2.ID != 1 || tc2.Weight != 1.0 {
		t.Fatal("roundtrip failed")
	}
}

func TestBountyJSON(t *testing.T) {
	now := time.Now()
	exp := now.Add(7 * 24 * time.Hour)
	b := Bounty{
		ID: 1, PostID: 1, CreatorID: 1, TotalAmount: 500, Status: 0,
		BestAnswerID: nil, ExpiresAt: &exp, CreatedAt: now,
	}
	b2, err := json.Marshal(b)
	if err != nil {
		t.Fatal(err)
	}
	var b3 Bounty
	if err := json.Unmarshal(b2, &b3); err != nil {
		t.Fatal(err)
	}
	if b3.ID != 1 || b3.TotalAmount != 500 || b3.Status != 0 {
		t.Fatal("roundtrip failed")
	}
}

func TestDailyRewardJSON(t *testing.T) {
	now := time.Now()
	dr := DailyReward{
		ID: 1, UserID: 1, Date: now, Amount: 10, Claimed: true, CreatedAt: now,
	}
	b, err := json.Marshal(dr)
	if err != nil {
		t.Fatal(err)
	}
	var dr2 DailyReward
	if err := json.Unmarshal(b, &dr2); err != nil {
		t.Fatal(err)
	}
	if dr2.ID != 1 || dr2.Amount != 10 {
		t.Fatal("roundtrip failed")
	}
}

func TestCommunityNoteJSON(t *testing.T) {
	now := time.Now()
	cn := CommunityNote{
		ID: 1, PostID: 1, AuthorID: 1, Body: "note body", Status: 0,
		HelpfulYes: 5, HelpfulNo: 1, ConsensusScore: 0.8, CreatedAt: now, UpdatedAt: now,
	}
	b, err := json.Marshal(cn)
	if err != nil {
		t.Fatal(err)
	}
	var cn2 CommunityNote
	if err := json.Unmarshal(b, &cn2); err != nil {
		t.Fatal(err)
	}
	if cn2.ID != 1 || cn2.Body != "note body" || cn2.ConsensusScore != 0.8 {
		t.Fatal("roundtrip failed")
	}
}

func TestBlocklistEntryJSON(t *testing.T) {
	now := time.Now()
	be := BlocklistEntry{
		ID: 1, EntryType: 1, EntryValue: "spammer", Reason: "known spammer",
		Severity: 3, AddedBy: i64ptr(1), JuryApproved: true, Shared: false, CreatedAt: now,
	}
	b, err := json.Marshal(be)
	if err != nil {
		t.Fatal(err)
	}
	var be2 BlocklistEntry
	if err := json.Unmarshal(b, &be2); err != nil {
		t.Fatal(err)
	}
	if be2.EntryValue != "spammer" || be2.Severity != 3 {
		t.Fatal("roundtrip failed")
	}
}

func TestFeedSourceJSON(t *testing.T) {
	fs := FeedSource{
		ID: 1, FeedID: 1, SourceType: 1, SourceID: i64ptr(1),
		SourceValue: "test", IncludeMode: true, SortPriority: 1,
	}
	b, err := json.Marshal(fs)
	if err != nil {
		t.Fatal(err)
	}
	var fs2 FeedSource
	if err := json.Unmarshal(b, &fs2); err != nil {
		t.Fatal(err)
	}
	if fs2.ID != 1 || fs2.FeedID != 1 || fs2.SourceValue != "test" {
		t.Fatal("roundtrip failed")
	}
}

func TestPostTagJSON(t *testing.T) {
	now := time.Now()
	pt := PostTag{PostID: 1, TagID: 1, TaggedBy: 1, CreatedAt: now}
	b, err := json.Marshal(pt)
	if err != nil {
		t.Fatal(err)
	}
	var pt2 PostTag
	if err := json.Unmarshal(b, &pt2); err != nil {
		t.Fatal(err)
	}
	if pt2.PostID != 1 || pt2.TagID != 1 {
		t.Fatal("roundtrip failed")
	}
}

func TestTagVoteJSON(t *testing.T) {
	now := time.Now()
	tv := TagVote{ID: 1, TagID: 1, UserID: 1, Vote: 1, CreatedAt: now}
	b, err := json.Marshal(tv)
	if err != nil {
		t.Fatal(err)
	}
	var tv2 TagVote
	if err := json.Unmarshal(b, &tv2); err != nil {
		t.Fatal(err)
	}
	if tv2.ID != 1 || tv2.Vote != 1 {
		t.Fatal("roundtrip failed")
	}
}

func TestModerationActionJSON(t *testing.T) {
	now := time.Now()
	ma := ModerationAction{
		ID: 1, ModeratorID: 1, TargetUserID: i64ptr(2), ActionType: 2,
		Duration: nil, Reason: "spam", IsJuryDecision: false,
		JuryYes: 0, JuryNo: 0, JuryTotal: 0, CreatedAt: now,
	}
	b, err := json.Marshal(ma)
	if err != nil {
		t.Fatal(err)
	}
	var ma2 ModerationAction
	if err := json.Unmarshal(b, &ma2); err != nil {
		t.Fatal(err)
	}
	if ma2.ActionType != 2 || ma2.Reason != "spam" {
		t.Fatal("roundtrip failed")
	}
}

func TestJuryPanelJSON(t *testing.T) {
	now := time.Now()
	v := true
	jp := JuryPanel{
		ID: 1, TargetActionID: 1, JurorID: 1, Vote: &v,
		Reason: "guilty", CreatedAt: now,
	}
	b, err := json.Marshal(jp)
	if err != nil {
		t.Fatal(err)
	}
	var jp2 JuryPanel
	if err := json.Unmarshal(b, &jp2); err != nil {
		t.Fatal(err)
	}
	if jp2.ID != 1 || jp2.Reason != "guilty" {
		t.Fatal("roundtrip failed")
	}
}

func TestCommunityForkJSON(t *testing.T) {
	now := time.Now()
	cf := CommunityFork{
		ID: 1, SourceID: 1, ForkID: 2, InitiatedBy: 1, Reason: "disagreement",
		MemberCount: 5, CreatedAt: now,
	}
	b, err := json.Marshal(cf)
	if err != nil {
		t.Fatal(err)
	}
	var cf2 CommunityFork
	if err := json.Unmarshal(b, &cf2); err != nil {
		t.Fatal(err)
	}
	if cf2.Reason != "disagreement" || cf2.MemberCount != 5 {
		t.Fatal("roundtrip failed")
	}
}

func TestCommunityMemberJSON(t *testing.T) {
	now := time.Now()
	cm := CommunityMember{
		CommunityID: 1, UserID: 1, Role: 1, Status: 1, JoinedAt: now,
	}
	b, err := json.Marshal(cm)
	if err != nil {
		t.Fatal(err)
	}
	var cm2 CommunityMember
	if err := json.Unmarshal(b, &cm2); err != nil {
		t.Fatal(err)
	}
	if cm2.CommunityID != 1 || cm2.Role != 1 {
		t.Fatal("roundtrip failed")
	}
}

func TestCuratorJSON(t *testing.T) {
	now := time.Now()
	cu := Curator{ID: 1, CommunityID: 1, UserID: 1, Permission: 2, CreatedAt: now}
	b, err := json.Marshal(cu)
	if err != nil {
		t.Fatal(err)
	}
	var cu2 Curator
	if err := json.Unmarshal(b, &cu2); err != nil {
		t.Fatal(err)
	}
	if cu2.ID != 1 || cu2.Permission != 2 {
		t.Fatal("roundtrip failed")
	}
}

func TestAuthResponseJSON(t *testing.T) {
	now := time.Now()
	ar := AuthResponse{
		Token: "jwt-token",
		User:  User{ID: 1, Username: "testuser", CreatedAt: now},
	}
	b, err := json.Marshal(ar)
	if err != nil {
		t.Fatal(err)
	}
	var ar2 AuthResponse
	if err := json.Unmarshal(b, &ar2); err != nil {
		t.Fatal(err)
	}
	if ar2.Token != "jwt-token" || ar2.User.ID != 1 {
		t.Fatal("roundtrip failed")
	}
}

func TestRegisterRequestJSON(t *testing.T) {
	rr := RegisterRequest{Username: "newuser", Email: "new@test.com", Password: "secret123", InviteCode: "CODE123"}
	b, err := json.Marshal(rr)
	if err != nil {
		t.Fatal(err)
	}
	var rr2 RegisterRequest
	if err := json.Unmarshal(b, &rr2); err != nil {
		t.Fatal(err)
	}
	if rr2.Username != "newuser" || rr2.Email != "new@test.com" || rr2.InviteCode != "CODE123" {
		t.Fatal("roundtrip failed")
	}
}

func TestLoginRequestJSON(t *testing.T) {
	lr := LoginRequest{UsernameOrEmail: "user@test.com", Password: "pass"}
	b, err := json.Marshal(lr)
	if err != nil {
		t.Fatal(err)
	}
	var lr2 LoginRequest
	if err := json.Unmarshal(b, &lr2); err != nil {
		t.Fatal(err)
	}
	if lr2.UsernameOrEmail != "user@test.com" || lr2.Password != "pass" {
		t.Fatal("roundtrip failed")
	}
}

func TestCustomFeedJSON(t *testing.T) {
	now := time.Now()
	cf := CustomFeed{
		ID: 1, OwnerID: 1, Name: "My Feed", Description: "desc",
		Slug: "my-feed", IsPublic: true, SortOrder: 1, CreatedAt: now, UpdatedAt: now,
	}
	b, err := json.Marshal(cf)
	if err != nil {
		t.Fatal(err)
	}
	var cf2 CustomFeed
	if err := json.Unmarshal(b, &cf2); err != nil {
		t.Fatal(err)
	}
	if cf2.Name != "My Feed" || cf2.Slug != "my-feed" {
		t.Fatal("roundtrip failed")
	}
}

func TestTrendingTopicJSON(t *testing.T) {
	now := time.Now()
	tt := TrendingTopic{
		ID: 1, Topic: "golang", Frequency: 100, Velocity: 0.5, TagID: i64ptr(1), CreatedAt: now,
	}
	b, err := json.Marshal(tt)
	if err != nil {
		t.Fatal(err)
	}
	var tt2 TrendingTopic
	if err := json.Unmarshal(b, &tt2); err != nil {
		t.Fatal(err)
	}
	if tt2.Topic != "golang" || tt2.Frequency != 100 {
		t.Fatal("roundtrip failed")
	}
}

func TestPostResponseJSON(t *testing.T) {
	now := time.Now()
	pr := PostResponse{
		Post:    Post{ID: 1, AuthorID: 1, Title: "Test", CreatedAt: &now},
		Message: "post created",
	}
	b, err := json.Marshal(pr)
	if err != nil {
		t.Fatal(err)
	}
	var pr2 PostResponse
	if err := json.Unmarshal(b, &pr2); err != nil {
		t.Fatal(err)
	}
	if pr2.Post.ID != 1 || pr2.Message != "post created" {
		t.Fatal("roundtrip failed")
	}
}

func TestUpdateConfigRequestJSON(t *testing.T) {
	pruneAge := 180
	ucr := UpdateConfigRequest{
		RegistrationMode: "approval", InstanceName: "My Instance",
		PruneAgeDays: &pruneAge,
	}
	b, err := json.Marshal(ucr)
	if err != nil {
		t.Fatal(err)
	}
	var ucr2 UpdateConfigRequest
	if err := json.Unmarshal(b, &ucr2); err != nil {
		t.Fatal(err)
	}
	if ucr2.RegistrationMode != "approval" || ucr2.InstanceName != "My Instance" {
		t.Fatal("roundtrip failed")
	}
}

func TestAboutResponseJSON(t *testing.T) {
	ar := AboutResponse{
		InstanceName: "Polaris", Version: "0.1",
	}
	b, err := json.Marshal(ar)
	if err != nil {
		t.Fatal(err)
	}
	var ar2 AboutResponse
	if err := json.Unmarshal(b, &ar2); err != nil {
		t.Fatal(err)
	}
	if ar2.InstanceName != "Polaris" || ar2.Version != "0.1" {
		t.Fatal("roundtrip failed")
	}
}

func TestOAuthStateJSON(t *testing.T) {
	now := time.Now()
	os := OAuthState{
		ID: 1, UserID: i64ptr(1), Provider: "github", State: "random-state",
		ExpiresAt: now.Add(time.Hour), CreatedAt: now,
	}
	b, err := json.Marshal(os)
	if err != nil {
		t.Fatal(err)
	}
	var os2 OAuthState
	if err := json.Unmarshal(b, &os2); err != nil {
		t.Fatal(err)
	}
	if os2.Provider != "github" || os2.State != "random-state" {
		t.Fatal("roundtrip failed")
	}
}

func TestCustomPageJSON(t *testing.T) {
	now := time.Now()
	cp := CustomPage{
		ID: 1, Slug: "about", Title: "About Us", Body: "content", IsPublished: true, UpdatedAt: now,
	}
	b, err := json.Marshal(cp)
	if err != nil {
		t.Fatal(err)
	}
	var cp2 CustomPage
	if err := json.Unmarshal(b, &cp2); err != nil {
		t.Fatal(err)
	}
	if cp2.Slug != "about" || cp2.Title != "About Us" {
		t.Fatal("roundtrip failed")
	}
}

func TestCustomEmojiJSON(t *testing.T) {
	now := time.Now()
	ce := CustomEmoji{
		ID: 1, Shortcode: "party", ImageURL: "https://example.com/party.png", AltText: "party emoji", CreatedAt: now,
	}
	b, err := json.Marshal(ce)
	if err != nil {
		t.Fatal(err)
	}
	var ce2 CustomEmoji
	if err := json.Unmarshal(b, &ce2); err != nil {
		t.Fatal(err)
	}
	if ce2.Shortcode != "party" {
		t.Fatal("roundtrip failed")
	}
}

func TestHiddenPostJSON(t *testing.T) {
	now := time.Now()
	hp := HiddenPost{ID: 1, UserID: 1, PostID: 1, CreatedAt: now}
	b, err := json.Marshal(hp)
	if err != nil {
		t.Fatal(err)
	}
	var hp2 HiddenPost
	if err := json.Unmarshal(b, &hp2); err != nil {
		t.Fatal(err)
	}
	if hp2.ID != 1 || hp2.UserID != 1 || hp2.PostID != 1 {
		t.Fatal("roundtrip failed")
	}
}

func TestRegistrationQueueJSON(t *testing.T) {
	now := time.Now()
	rq := RegistrationQueue{
		ID: 1, Username: "newuser", Email: "new@test.com", Status: 0, CreatedAt: now,
	}
	b, err := json.Marshal(rq)
	if err != nil {
		t.Fatal(err)
	}
	var rq2 RegistrationQueue
	if err := json.Unmarshal(b, &rq2); err != nil {
		t.Fatal(err)
	}
	if rq2.ID != 1 || rq2.Username != "newuser" {
		t.Fatal("roundtrip failed")
	}
}

func TestModNoteJSON(t *testing.T) {
	now := time.Now()
	mn := ModNote{
		ID: 1, UserID: 1, NotedBy: 1, Note: "admin note", CreatedAt: now,
	}
	b, err := json.Marshal(mn)
	if err != nil {
		t.Fatal(err)
	}
	var mn2 ModNote
	if err := json.Unmarshal(b, &mn2); err != nil {
		t.Fatal(err)
	}
	if mn2.Note != "admin note" {
		t.Fatal("roundtrip failed")
	}
}

func TestNilPtrFields(t *testing.T) {
	now := time.Now()
	u := User{ID: 1, Username: "test", CreatedAt: now}
	b, err := json.Marshal(u)
	if err != nil {
		t.Fatal(err)
	}
	var u2 User
	if err := json.Unmarshal(b, &u2); err != nil {
		t.Fatal(err)
	}
	if u2.ID != 1 {
		t.Fatal("basic user marshal failed")
	}
	if u2.DisplayName != nil {
		t.Fatal("unset DisplayName should be nil")
	}
	if u2.Bio != nil {
		t.Fatal("unset Bio should be nil")
	}
	if u2.AvatarURL != nil {
		t.Fatal("unset AvatarURL should be nil")
	}
}
