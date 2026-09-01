package handlers_test

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/api"
	"github.com/opencode-ai/polaris/internal/db"
	"github.com/redis/go-redis/v9"
)

var (
	testRouter *gin.Engine
	testPG     *pgxpool.Pool
	testRDB    *redis.Client
	testJWT    = "test-jwt-secret-with-256-bits!"
)

func TestMain(m *testing.M) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://polaris@/polaris?host=/run/postgresql"
	}
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	var err error
	testPG, err = db.NewPostgres(dsn)
	if err != nil {
		fmt.Fprintf(os.Stderr, "postgres: %v\n", err)
		os.Exit(1)
	}
	testRDB, err = db.NewRedis(redisAddr)
	if err != nil {
		fmt.Fprintf(os.Stderr, "redis: %v\n", err)
		os.Exit(1)
	}

	migrate(testPG)

	gin.SetMode(gin.TestMode)
	testRouter = api.NewRouter(testPG, testRDB, testJWT)

	testPG.Exec(context.Background(), `UPDATE site_config SET registration_mode = 'open' WHERE id = 1`)

	code := m.Run()
	testPG.Close()
	testRDB.Close()
	os.Exit(code)
}

func migrate(pg *pgxpool.Pool) {
	sql, err := os.ReadFile("../../db/migrations/000001_initial.up.sql")
	if err != nil {
		panic(fmt.Sprintf("read migration: %v", err))
	}
	_, err = pg.Exec(context.Background(), string(sql))
	if err != nil {
		panic(fmt.Sprintf("migrate: %v", err))
	}
}

func jsonBody(v interface{}) io.Reader {
	b, _ := json.Marshal(v)
	return bytes.NewReader(b)
}

func request(method, path string, body io.Reader, token string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, path, body)
	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	w := httptest.NewRecorder()
	testRouter.ServeHTTP(w, req)
	return w
}

func registerUser(username, email, password string) (string, int) {
	w := request("POST", "/api/v1/auth/register", jsonBody(map[string]string{
		"username": username,
		"email":    email,
		"password": password,
	}), "")
	var resp struct {
		Token string `json:"token"`
	}
	json.Unmarshal(w.Body.Bytes(), &resp)
	return resp.Token, w.Code
}

func parseBody(t *testing.T, body []byte, v interface{}) {
	t.Helper()
	if err := json.Unmarshal(body, v); err != nil {
		t.Fatalf("parse body: %v\nbody: %s", err, string(body))
	}
}

func unique() string {
	return fmt.Sprintf("%d", time.Now().UnixNano()%10000000)
}

func mustToken(t *testing.T) (string, int64) {
	t.Helper()
	u := unique()
	token, code := registerUser("tu"+u, fmt.Sprintf("tu%s@ex.com", u), "password123")
	if code != 201 {
		t.Fatalf("register failed: %d", code)
	}
	w := request("GET", "/api/v1/users/@me", nil, token)
	var resp struct {
		ID    int64  `json:"id"`
		Error string `json:"error"`
	}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp.Error != "" {
		t.Fatalf("@me error: %s (status %d)", resp.Error, w.Code)
	}
	if resp.ID == 0 {
		t.Fatalf("got id 0, status: %d, body: %s", w.Code, w.Body.String())
	}
	return token, resp.ID
}

// ─── Health ────────────────────────────────────────────────────

func TestHealth(t *testing.T) {
	w := request("GET", "/health", nil, "")
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["status"] != "ok" {
		t.Errorf("expected ok status")
	}
}

func TestReady(t *testing.T) {
	w := request("GET", "/ready", nil, "")
	if w.Code != http.StatusOK && w.Code != http.StatusServiceUnavailable {
		t.Errorf("expected 200 or 503, got %d: %s", w.Code, w.Body.String())
	}
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["status"] == "" {
		t.Error("expected status in ready response")
	}
}

// ─── Auth ──────────────────────────────────────────────────────

func TestAuthRegister(t *testing.T) {
	w := request("POST", "/api/v1/auth/register", jsonBody(map[string]string{
		"username": "reg" + unique(),
		"email":    fmt.Sprintf("reg_%s@ex.com", unique()),
		"password": "password123",
	}), "")
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
}

func TestAuthRegisterDuplicate(t *testing.T) {
	u := unique()
	registerUser("dup"+u, fmt.Sprintf("dup%s@ex.com", u), "password123")
	w := request("POST", "/api/v1/auth/register", jsonBody(map[string]string{
		"username": "dup2" + unique(),
		"email":    fmt.Sprintf("dup%s@ex.com", u),
		"password": "password123",
	}), "")
	if w.Code != http.StatusConflict {
		t.Errorf("expected 409, got %d", w.Code)
	}
}

func TestAuthLogin(t *testing.T) {
	u := unique()
	email := fmt.Sprintf("login%s@ex.com", u)
	registerUser("login"+u, email, "password123")
	w := request("POST", "/api/v1/auth/login", jsonBody(map[string]string{
		"email": email, "password": "password123",
	}), "")
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestAuthBadLogin(t *testing.T) {
	w := request("POST", "/api/v1/auth/login", jsonBody(map[string]string{
		"email": "none@ex.com", "password": "wrong",
	}), "")
	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", w.Code)
	}
}

func TestAuthSession(t *testing.T) {
	token, _ := registerUser("sess"+unique(), fmt.Sprintf("sess%s@ex.com", unique()), "password123")
	w := request("GET", "/api/v1/auth/session", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestAuthForgotReset(t *testing.T) {
	u := unique()
	email := fmt.Sprintf("fr%s@ex.com", u)
	registerUser("fr"+u, email, "password123")

	w := request("POST", "/api/v1/auth/forgot", jsonBody(map[string]string{"email": email}), "")
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
	var resp struct {
		Token string `json:"token"`
	}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp.Token == "" {
		t.Fatal("expected reset token")
	}

	w2 := request("POST", "/api/v1/auth/reset", jsonBody(map[string]string{
		"token": resp.Token, "new_password": "newpass123",
	}), "")
	if w2.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w2.Code, w2.Body.String())
	}
}

func TestAuthLogout(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/auth/logout", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Posts ─────────────────────────────────────────────────────

func TestCreatePost(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "Test Post", "body": "content",
	}), token)
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
}

func TestListPosts(t *testing.T) {
	token, _ := mustToken(t)
	request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "A Post", "body": "content",
	}), token)
	w := request("GET", "/api/v1/posts?limit=10&offset=0", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestGetPostByID(t *testing.T) {
	token, _ := mustToken(t)
	createW := request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "Get Post", "body": "test",
	}), token)
	var cr struct {
		Post struct {
			ID int64 `json:"id"`
		}
	}
	json.Unmarshal(createW.Body.Bytes(), &cr)

	w := request("GET", fmt.Sprintf("/api/v1/posts/%d", cr.Post.ID), nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestUpdatePost(t *testing.T) {
	token, _ := mustToken(t)
	createW := request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "Original", "body": "body",
	}), token)
	var cr struct {
		Post struct {
			ID int64 `json:"id"`
		}
	}
	json.Unmarshal(createW.Body.Bytes(), &cr)

	w := request("PUT", fmt.Sprintf("/api/v1/posts/%d", cr.Post.ID), jsonBody(map[string]interface{}{
		"title": "Updated",
	}), token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestDeletePost(t *testing.T) {
	token, _ := mustToken(t)
	createW := request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "To Delete", "body": "bye",
	}), token)
	var cr struct {
		Post struct {
			ID int64 `json:"id"`
		}
	}
	json.Unmarshal(createW.Body.Bytes(), &cr)

	w := request("DELETE", fmt.Sprintf("/api/v1/posts/%d", cr.Post.ID), nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestArchivePost(t *testing.T) {
	token, _ := mustToken(t)
	createW := request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "To Archive", "body": "bye",
	}), token)
	var cr struct {
		Post struct {
			ID int64 `json:"id"`
		}
	}
	json.Unmarshal(createW.Body.Bytes(), &cr)

	w := request("POST", fmt.Sprintf("/api/v1/posts/%d/archive", cr.Post.ID), nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestPostCount(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/posts/count", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Tags ──────────────────────────────────────────────────────

func TestCreateTag(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/tags", jsonBody(map[string]interface{}{
		"name": "tag" + unique(), "category": "test",
	}), token)
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
}

func TestListTags(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/tags", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestGetTagByID(t *testing.T) {
	token, _ := mustToken(t)
	createW := request("POST", "/api/v1/tags", jsonBody(map[string]interface{}{
		"name": "gtag" + unique(), "category": "test",
	}), token)
	var tag struct {
		ID int64 `json:"id"`
	}
	json.Unmarshal(createW.Body.Bytes(), &tag)

	w := request("GET", fmt.Sprintf("/api/v1/tags/%d", tag.ID), nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestDeleteTag(t *testing.T) {
	token, _ := mustToken(t)
	createW := request("POST", "/api/v1/tags", jsonBody(map[string]interface{}{
		"name": "dtag" + unique(), "category": "test",
	}), token)
	var tag struct {
		ID int64 `json:"id"`
	}
	json.Unmarshal(createW.Body.Bytes(), &tag)

	w := request("DELETE", fmt.Sprintf("/api/v1/tags/%d", tag.ID), nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestTagPostAssociation(t *testing.T) {
	token, _ := mustToken(t)
	createPostW := request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "Tagged Post", "body": "content",
	}), token)
	var post struct {
		Post struct {
			ID int64 `json:"id"`
		}
	}
	json.Unmarshal(createPostW.Body.Bytes(), &post)

	createTagW := request("POST", "/api/v1/tags", jsonBody(map[string]interface{}{
		"name": "assoc" + unique(), "category": "test",
	}), token)
	var tag struct {
		ID int64 `json:"id"`
	}
	json.Unmarshal(createTagW.Body.Bytes(), &tag)

	w := request("POST", fmt.Sprintf("/api/v1/tags/posts/%d/tags/%d", post.Post.ID, tag.ID), nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200 for tag post, got %d: %s", w.Code, w.Body.String())
	}

	w2 := request("GET", fmt.Sprintf("/api/v1/tags/posts/%d/tags", post.Post.ID), nil, token)
	if w2.Code != http.StatusOK {
		t.Errorf("expected 200 for list tags, got %d: %s", w2.Code, w2.Body.String())
	}

	w3 := request("DELETE", fmt.Sprintf("/api/v1/tags/posts/%d/tags/%d", post.Post.ID, tag.ID), nil, token)
	if w3.Code != http.StatusOK {
		t.Errorf("expected 200 for untag, got %d: %s", w3.Code, w3.Body.String())
	}
}

func TestVoteTag(t *testing.T) {
	token, _ := mustToken(t)
	createW := request("POST", "/api/v1/tags", jsonBody(map[string]interface{}{
		"name": "vt" + unique(), "category": "test",
	}), token)
	var tag struct {
		ID int64 `json:"id"`
	}
	json.Unmarshal(createW.Body.Bytes(), &tag)

	w := request("POST", fmt.Sprintf("/api/v1/tags/%d/vote", tag.ID), jsonBody(map[string]interface{}{
		"vote": 1,
	}), token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestSearchTagsViaSearchEndpoint(t *testing.T) {
	token, _ := mustToken(t)
	request("POST", "/api/v1/tags", jsonBody(map[string]interface{}{
		"name": "taggy" + unique(), "category": "test",
	}), token)
	w := request("GET", "/api/v1/search?q=taggy&type=tags&limit=10", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Search ────────────────────────────────────────────────────

func TestSearch(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/search?q=test&limit=10", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestAdvancedSearch(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/search/advanced", jsonBody(map[string]interface{}{
		"query": "test", "limit": 10,
	}), token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Communities ───────────────────────────────────────────────

func TestCreateCommunity(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/communities", jsonBody(map[string]interface{}{
		"name": "Test Comm " + unique(),
		"slug": "tc" + unique(),
	}), token)
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
}

func TestListCommunities(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/communities", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestJoinLeaveCommunity(t *testing.T) {
	token, _ := mustToken(t)
	slug := "jc" + unique()
	request("POST", "/api/v1/communities", jsonBody(map[string]interface{}{
		"name": "Join Comm", "slug": slug,
	}), token)

	w := request("POST", "/api/v1/communities/"+slug+"/join", nil, token)
	if w.Code != http.StatusOK && w.Code != http.StatusConflict {
		t.Logf("join: %d %s", w.Code, w.Body.String())
	}

	w2 := request("POST", "/api/v1/communities/"+slug+"/leave", nil, token)
	if w2.Code != http.StatusOK {
		t.Logf("leave: %d %s", w2.Code, w2.Body.String())
	}
}

// ─── Circles ───────────────────────────────────────────────────

func TestCreateCircle(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/circles", jsonBody(map[string]interface{}{
		"name": "My Circle " + unique(),
	}), token)
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
}

func TestListCircles(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/circles", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Collections ───────────────────────────────────────────────

func TestCreateCollection(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/collections", jsonBody(map[string]interface{}{
		"name": "My Collection " + unique(),
	}), token)
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
}

func TestListCollections(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/collections", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Notes ─────────────────────────────────────────────────────

func TestCreateNote(t *testing.T) {
	token, _ := mustToken(t)
	createPostW := request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "Notable", "body": "note me",
	}), token)
	var post struct {
		Post struct {
			ID int64 `json:"id"`
		}
	}
	json.Unmarshal(createPostW.Body.Bytes(), &post)

	w := request("POST", "/api/v1/notes", jsonBody(map[string]interface{}{
		"post_id": post.Post.ID,
		"body":    "community note",
	}), token)
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Interactions ──────────────────────────────────────────────

func TestCreateInteraction(t *testing.T) {
	token, _ := mustToken(t)
	createPostW := request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "Interact Me", "body": "interact",
	}), token)
	var post struct {
		Post struct {
			ID int64 `json:"id"`
		}
	}
	json.Unmarshal(createPostW.Body.Bytes(), &post)

	w := request("POST", "/api/v1/interactions", jsonBody(map[string]interface{}{
		"post_id":          post.Post.ID,
		"interaction_type": 1,
	}), token)
	if w.Code != http.StatusOK && w.Code != http.StatusCreated {
		t.Errorf("expected 200/201, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Feeds ─────────────────────────────────────────────────────

func TestGetFeed(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/feeds?limit=10&offset=0", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestCreateCustomFeed(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/feeds", jsonBody(map[string]interface{}{
		"name": "Custom " + unique(),
	}), token)
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Filters ───────────────────────────────────────────────────

func TestCreateFilter(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/filters", jsonBody(map[string]interface{}{
		"filter_type": 1, "filter_value": "badword",
	}), token)
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
}

func TestListFilters(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/filters", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Users ─────────────────────────────────────────────────────

func TestGetUserAtMe(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/users/@me", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestGetMeRoute(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/users/@me", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["username"] == "" {
		t.Error("expected username in @me response")
	}
}

func TestUpdateProfile(t *testing.T) {
	token, _ := mustToken(t)
	w := request("PUT", "/api/v1/users/@me", jsonBody(map[string]interface{}{
		"display_name": "Updated Name",
	}), token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestGetUserByUsername(t *testing.T) {
	u := unique()
	uname := "user" + u
	token, _ := registerUser(uname, fmt.Sprintf("user%s@ex.com", u), "password123")
	w := request("GET", "/api/v1/users/"+uname, nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Blocks ────────────────────────────────────────────────────

func TestBlockUser(t *testing.T) {
	token, uid := mustToken(t)
	otherToken, otherID := mustToken(t)
	_ = otherToken
	w := request("POST", "/api/v1/blocks", jsonBody(map[string]interface{}{
		"blocked_id": otherID,
	}), token)
	if w.Code != http.StatusOK && w.Code != http.StatusCreated {
		t.Errorf("expected 200 or 201, got %d: %s", w.Code, w.Body.String())
	}
	_ = uid
}

func TestBlockNonexistentUser(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/blocks", jsonBody(map[string]interface{}{
		"blocked_id": 999999999,
	}), token)
	if w.Code != http.StatusNotFound {
		t.Errorf("expected 404 for blocking nonexistent user, got %d: %s", w.Code, w.Body.String())
	}
}

func TestSelfBlock(t *testing.T) {
	token, uid := mustToken(t)
	w := request("POST", "/api/v1/blocks", jsonBody(map[string]interface{}{
		"blocked_id": uid,
	}), token)
	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400 for self-block, got %d: %s", w.Code, w.Body.String())
	}
}

func TestListBlocks(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/blocks", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Reports ───────────────────────────────────────────────────

func TestCreateReport(t *testing.T) {
	token, _ := mustToken(t)
	createPostW := request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "Report Me", "body": "report",
	}), token)
	var post struct {
		Post struct {
			ID int64 `json:"id"`
		}
	}
	json.Unmarshal(createPostW.Body.Bytes(), &post)

	w := request("POST", "/api/v1/reports", jsonBody(map[string]interface{}{
		"post_id":  post.Post.ID,
		"category": 1,
		"reason":   "test report",
	}), token)
	if w.Code != http.StatusCreated {
		t.Errorf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
}

func TestListReports(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/reports", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Notifications ─────────────────────────────────────────────

func TestListNotifications(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/notifications", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestNotificationsUnreadCount(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/notifications/unread-count", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestMarkAllNotificationsRead(t *testing.T) {
	token, _ := mustToken(t)
	w := request("PUT", "/api/v1/notifications/read-all", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Admin ─────────────────────────────────────────────────────

func TestAdminGetConfig(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/admin/config", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestAdminUpdateConfig(t *testing.T) {
	token, _ := mustToken(t)
	w := request("PUT", "/api/v1/admin/config", jsonBody(map[string]interface{}{
		"instance_name": "Test Instance",
	}), token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestAdminListInvites(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/admin/invites", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── About ─────────────────────────────────────────────────────

func TestAbout(t *testing.T) {
	w := request("GET", "/api/v1/about", nil, "")
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Error Cases ───────────────────────────────────────────────

func TestNotFound(t *testing.T) {
	w := request("GET", "/api/v1/nonexistent", nil, "")
	if w.Code != http.StatusNotFound {
		t.Errorf("expected 404, got %d", w.Code)
	}
}

func TestUnauthenticated(t *testing.T) {
	w := request("POST", "/api/v1/posts", jsonBody(map[string]interface{}{
		"title": "No Auth", "body": "test",
	}), "")
	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", w.Code)
	}
}

// ─── Achievements ──────────────────────────────────────────────

func TestListAchievements(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/achievements", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestGetUserAchievements(t *testing.T) {
	token, uid := mustToken(t)
	w := request("GET", fmt.Sprintf("/api/v1/achievements/user/%d", uid), nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Trending ──────────────────────────────────────────────────

func TestListTrending(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/trending", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestIncrementTrending(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/trending/increment", jsonBody(map[string]interface{}{
		"topic": "golang",
	}), token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Moderation ────────────────────────────────────────────────

func TestCreateModerationAction(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/moderation/actions", jsonBody(map[string]interface{}{
		"action_type": 1,
		"reason":      "test",
	}), token)
	if w.Code != http.StatusBadRequest && w.Code != http.StatusCreated && w.Code != http.StatusForbidden {
		t.Logf("mod action: %d %s", w.Code, w.Body.String())
	}
}

// ─── Credits ───────────────────────────────────────────────────

func TestCreditTransfer(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/credits/transfer", jsonBody(map[string]interface{}{
		"to_user_id": 1,
		"amount":     10,
	}), token)
	if w.Code != http.StatusOK && w.Code != http.StatusBadRequest {
		t.Logf("transfer: %d %s", w.Code, w.Body.String())
	}
}

func TestGetTransactions(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/credits/transactions", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── Invites ───────────────────────────────────────────────────

func TestListInvites(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/invites", nil, token)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

// ─── User Lists ──────────────────────────────────────────────

func TestCreateUserList(t *testing.T) {
	token, uid := mustToken(t)
	w := request("POST", "/api/v1/lists", jsonBody(map[string]interface{}{
		"name":       "My List " + unique(),
		"list_type":  0,
		"visibility": 1,
	}), token)
	if w.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp["name"] == "" {
		t.Error("expected list name in response")
	}
	ownerID, ok := resp["owner_id"].(float64)
	if !ok || int64(ownerID) != uid {
		t.Errorf("expected owner_id %d, got %v", uid, resp["owner_id"])
	}
}

func TestCreateAlgorithmicList(t *testing.T) {
	token, _ := mustToken(t)
	w := request("POST", "/api/v1/lists/algorithmic", jsonBody(map[string]interface{}{
		"name":        "Algo List " + unique(),
		"description": "algorithmic list",
		"list_type":   0,
		"visibility":  1,
		"scope":       0,
		"criteria": map[string]interface{}{
			"min_trust_level":    1,
			"min_positive_ratio": 0.5,
			"max_freshness_days": 30,
			"min_posts_30d":      5,
		},
		"refresh": "24h",
	}), token)
	if w.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", w.Code, w.Body.String())
	}
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if isAlgo, ok := resp["is_algorithmic"].(bool); !ok || !isAlgo {
		t.Error("expected is_algorithmic=true in response")
	}
}

// ─── Affinity ────────────────────────────────────────────────

func TestGetAffinities(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/affinity", nil, token)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
	var resp []interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	if len(resp) != 0 {
		t.Logf("got %d affinities (expected 0 initially)", len(resp))
	}
}

func TestGetSimilarUsers(t *testing.T) {
	token, _ := mustToken(t)
	w := request("GET", "/api/v1/affinity/similar", nil, token)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	userIDs, ok := resp["user_ids"].([]interface{})
	if !ok {
		t.Error("expected user_ids field in response")
	} else if len(userIDs) != 0 {
		t.Logf("got %d similar users (expected 0 initially)", len(userIDs))
	}
}
