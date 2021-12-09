package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

type Memory struct {
	Total   string `json:"total"`
	Used    string `json:"used"`
	Percent string `json:"percent"`
}

type Hijo struct {
	PID    string `json:"pid"`
	Nombre string `json:"nombre"`
	Estado string `json:"estado"`
	RAM    string `json:"ram"`
}
type Padre struct {
	PID    string `json:"pid"`
	Nombre string `json:"nombre"`
	RAM    string `json:"ram"`
	Hijos  []Hijo `json:"hijos"`
}

type Raiz struct {
	Padres  []Padre `json:"root"`
}



func Test() {
	output, err := ioutil.ReadFile("/proc/cpu_201801597")
	if err != nil {
		log.Fatal(err)
	}
	
	var dataCPU Raiz
	json.Unmarshal(output, &dataCPU)
	fmt.Printf("%+v\n", dataCPU)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  128,
	WriteBufferSize: 128,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func echo(conn *websocket.Conn) {
	for {
		out, e := ioutil.ReadFile("/proc/memo_201801597")
		if e != nil {
			log.Fatal(e)
		}
		var data Memory
		json.Unmarshal(out, &data)
		time.Sleep(time.Second)
		conn.WriteJSON(data)
		output, err := ioutil.ReadFile("/proc/cpu_201801597")
		if err != nil {
			log.Fatal(err)
		}
		var dataCPU Raiz
		json.Unmarshal([]byte(output), &dataCPU)
		time.Sleep(time.Second)
		conn.WriteJSON(dataCPU)
	}
}
func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Home Page")
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	go echo(ws)
}

func setupRoutes() {
	http.HandleFunc("/", homePage)
	http.HandleFunc("/ws", wsEndpoint)
}

func main() {
	setupRoutes()
	panic(http.ListenAndServe(":8080", nil))
}
