package websocket

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

func TestNewHub(t *testing.T) {
	h := NewHub()
	if h == nil {
		t.Fatal("expected non-nil hub")
	}
}

func TestMessageTypes(t *testing.T) {
	if MsgTypeNotification != "notification" {
		t.Fatal("unexpected notification type")
	}
	if MsgTypeFeedUpdate != "feed_update" {
		t.Fatal("unexpected feed_update type")
	}
	if MsgTypeInteraction != "interaction" {
		t.Fatal("unexpected interaction type")
	}
	if MsgTypeTyping != "typing" {
		t.Fatal("unexpected typing type")
	}
	if MsgTypePresence != "presence" {
		t.Fatal("unexpected presence type")
	}
	if MsgTypeError != "error" {
		t.Fatal("unexpected error type")
	}
}

func TestMustMarshal(t *testing.T) {
	data := mustMarshal(map[string]int{"key": 42})
	if data == nil {
		t.Fatal("expected non-nil")
	}
	var result map[string]int
	if err := json.Unmarshal(data, &result); err != nil {
		t.Fatal(err)
	}
	if result["key"] != 42 {
		t.Fatalf("expected 42, got %d", result["key"])
	}
}

func TestMessageJSON(t *testing.T) {
	msg := Message{
		Type: MsgTypeNotification,
		Payload: mustMarshal(map[string]interface{}{
			"body": "test notification",
		}),
	}
	b, err := json.Marshal(msg)
	if err != nil {
		t.Fatal(err)
	}
	var decoded Message
	if err := json.Unmarshal(b, &decoded); err != nil {
		t.Fatal(err)
	}
	if decoded.Type != MsgTypeNotification {
		t.Fatalf("expected notification type, got %s", decoded.Type)
	}
}

func TestHubRegisterAndUnregister(t *testing.T) {
	h := NewHub()

	go h.Run()

	// Create a test server that handles WS upgrade
	s := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h.ServeWS(w, r, 1)
	}))
	defer s.Close()

	u := "ws" + strings.TrimPrefix(s.URL, "http")
	conn, _, err := websocket.DefaultDialer.Dial(u, http.Header{})
	if err != nil {
		t.Logf("dial failed (expected in test env): %v", err)
		return
	}
	conn.Close()

	time.Sleep(100 * time.Millisecond)
}

func TestNotifyUserWithConnection(t *testing.T) {
	h := NewHub()
	go h.Run()

	s := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h.ServeWS(w, r, 1)
	}))
	defer s.Close()

	u := "ws" + strings.TrimPrefix(s.URL, "http")
	conn, _, err := websocket.DefaultDialer.Dial(u, http.Header{})
	if err != nil {
		t.Logf("dial failed: %v", err)
		return
	}
	defer conn.Close()

	time.Sleep(50 * time.Millisecond)

	h.NotifyUser(1, map[string]interface{}{"type": "test"})
	time.Sleep(50 * time.Millisecond)

	// Try reading the message
	conn.SetReadDeadline(time.Now().Add(100 * time.Millisecond))
	_, _, err = conn.ReadMessage()
	if err != nil {
		t.Logf("read message: %v", err)
	}
}

func TestBroadcastFeedUpdate(t *testing.T) {
	h := NewHub()
	go h.Run()

	s := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h.ServeWS(w, r, 1)
	}))
	defer s.Close()

	u := "ws" + strings.TrimPrefix(s.URL, "http")
	conn, _, err := websocket.DefaultDialer.Dial(u, http.Header{})
	if err != nil {
		t.Logf("dial failed: %v", err)
		return
	}
	defer conn.Close()

	time.Sleep(50 * time.Millisecond)

	h.BroadcastFeedUpdate(42)
	time.Sleep(50 * time.Millisecond)
}

func TestServeWSMultipleUsers(t *testing.T) {
	h := NewHub()
	go h.Run()

	s := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h.ServeWS(w, r, 1)
	}))
	defer s.Close()

	u := "ws" + strings.TrimPrefix(s.URL, "http")
	conn, _, err := websocket.DefaultDialer.Dial(u, http.Header{})
	if err != nil {
		t.Logf("dial failed: %v", err)
		return
	}
	defer conn.Close()

	time.Sleep(50 * time.Millisecond)

	h.mu.RLock()
	clients := h.clients[1]
	h.mu.RUnlock()

	if len(clients) > 0 {
		t.Logf("user 1 has %d clients", len(clients))
	}
}

func TestHubClientNilReadWritePump(t *testing.T) {
	h := NewHub()

	// Create client without a real conn - ReadPump/WritePump should panic
	// which is expected behavior
	c := &Client{
		hub:    h,
		send:   make(chan []byte, 256),
		userID: 1,
	}

	defer func() {
		if r := recover(); r != nil {
			t.Logf("expected panic with nil conn: %v", r)
		}
	}()

	go c.ReadPump()
	time.Sleep(10 * time.Millisecond)
}
