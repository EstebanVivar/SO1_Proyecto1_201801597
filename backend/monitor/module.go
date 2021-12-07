package monitor

import "github.com/gorilla/websocket"

type Module struct{
	Module string
	Conn *websocket.Conn
	Global *Monitor
}