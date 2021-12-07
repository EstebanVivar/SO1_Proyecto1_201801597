package monitor

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Monitor struct{
modules map[string] *Module
data chan *Data
}
var upgrader = websocket.Upgrader{
	ReadBufferSize: 512,
	WriteBufferSize: 512,
	CheckOrigin: func(r *http.Request) bool {
		log.Printf("%s %s%s %v\n",r.Method,r.Host,r.RequestURI,r.Proto)
		return true
	},

}

func (data *Monitor) Run(){
	for{
		fmt.Println("Chat Running")
	}
}
func Start(port string){
	log.Printf("Chat listening on http://localhost%s\n", port)
	c:=&Monitor{
		modules: make(map[string]*Module),
		data: make(chan *Data),
	}
		
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to Go WebChat!"))
	})

	go c.Run()

	log.Fatal(http.ListenAndServe(port, nil))
}
