package websocket

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	applog "github.com/opencode-ai/polaris/internal/log"
)

type MessageType string

const (
	MsgTypeNotification MessageType = "notification"
	MsgTypeFeedUpdate   MessageType = "feed_update"
	MsgTypeInteraction  MessageType = "interaction"
	MsgTypeTyping       MessageType = "typing"
	MsgTypePresence     MessageType = "presence"
	MsgTypeError        MessageType = "error"
)

type Message struct {
	Type      MessageType     `json:"type"`
	Payload   json.RawMessage `json:"payload,omitempty"`
	UserID    int64           `json:"-"`
	Recipient *int64          `json:"recipient,omitempty"`
	Room      string          `json:"room,omitempty"`
}

type Hub struct {
	mu         sync.RWMutex
	clients    map[int64][]*Client
	rooms      map[string]map[*Client]bool
	upgrader   websocket.Upgrader
	register   chan *Client
	unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		clients: make(map[int64][]*Client),
		rooms:   make(map[string]map[*Client]bool),
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client.userID] = append(h.clients[client.userID], client)
			h.mu.Unlock()
			h.broadcastPresence(client.userID, true)

		case client := <-h.unregister:
			h.mu.Lock()
			clients := h.clients[client.userID]
			for i, c := range clients {
				if c == client {
					h.clients[client.userID] = append(clients[:i], clients[i+1:]...)
					break
				}
			}
			if len(h.clients[client.userID]) == 0 {
				delete(h.clients, client.userID)
			}
			for room, members := range h.rooms {
				delete(members, client)
				if len(members) == 0 {
					delete(h.rooms, room)
				}
			}
			h.mu.Unlock()
			close(client.send)
			h.broadcastPresence(client.userID, false)
		}
	}
}

func (h *Hub) ServeWS(w http.ResponseWriter, r *http.Request, userID int64) {
	conn, err := h.upgrader.Upgrade(w, r, nil)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("websocket upgrade")
		return
	}

	client := NewClient(h, conn, userID)
	h.register <- client

	go client.WritePump()
	go client.ReadPump()
}

func (h *Hub) handleMessage(sender *Client, msg Message) {
	switch msg.Type {
	case MsgTypeTyping:
		if msg.Recipient != nil {
			h.sendToUser(*msg.Recipient, msg)
		}
	case MsgTypePresence:
		h.broadcastPresence(sender.userID, true)
	default:
		if msg.Room != "" {
			h.sendToRoom(msg.Room, msg, sender)
		} else if msg.Recipient != nil {
			h.sendToUser(*msg.Recipient, msg)
		}
	}
}

func (h *Hub) sendToUser(userID int64, msg Message) {
	data, err := json.Marshal(msg)
	if err != nil {
		return
	}

	h.mu.RLock()
	clients := h.clients[userID]
	h.mu.RUnlock()

	for _, client := range clients {
		select {
		case client.send <- data:
		default:
			h.unregister <- client
		}
	}
}

func (h *Hub) sendToRoom(room string, msg Message, sender *Client) {
	data, err := json.Marshal(msg)
	if err != nil {
		return
	}

	h.mu.RLock()
	members := h.rooms[room]
	h.mu.RUnlock()

	for client := range members {
		if client == sender {
			continue
		}
		select {
		case client.send <- data:
		default:
			h.unregister <- client
		}
	}
}

func (h *Hub) broadcastPresence(userID int64, online bool) {
	msg := Message{
		Type:    MsgTypePresence,
		Payload: mustMarshal(map[string]interface{}{"user_id": userID, "online": online}),
	}

	h.mu.RLock()
	defer h.mu.RUnlock()

	for uid, clients := range h.clients {
		if uid == userID {
			continue
		}
		data, _ := json.Marshal(msg)
		for _, client := range clients {
			select {
			case client.send <- data:
			default:
			}
		}
	}
}

func (h *Hub) NotifyUser(userID int64, notification interface{}) {
	payload, err := json.Marshal(notification)
	if err != nil {
		return
	}
	msg := Message{
		Type:    MsgTypeNotification,
		Payload: payload,
	}
	h.sendToUser(userID, msg)
}

func (h *Hub) BroadcastFeedUpdate(postID int64) {
	msg := Message{
		Type:    MsgTypeFeedUpdate,
		Payload: mustMarshal(map[string]interface{}{"post_id": postID, "timestamp": time.Now()}),
	}

	h.mu.RLock()
	defer h.mu.RUnlock()

	data, _ := json.Marshal(msg)
	for _, clients := range h.clients {
		for _, client := range clients {
			select {
			case client.send <- data:
			default:
			}
		}
	}
}

func mustMarshal(v interface{}) json.RawMessage {
	data, _ := json.Marshal(v)
	return data
}
