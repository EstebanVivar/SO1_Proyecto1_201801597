package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

type Memory struct {
	Total  int `json:"total"`
	Free   int `json:"free"`
	Buffer int `json:"buffer"`
	Shared int `json:"shared"`
}

type Hijo struct {
	PID    int    `json:"pid"`
	Nombre string `json:"nombre"`
	Estado string `json:"estado"`
	RAM    int    `json:"ram"`
}
type Padre struct {
	PID     int    `json:"pid"`
	Nombre  string `json:"nombre"`
	RAM     int    `json:"ram"`
	Usuario string `json:"usuario"`
	Estado  string `json:"estado"`
	Hijos   []Hijo `json:"hijos"`
}

type Raiz struct {
	Padres []Padre `json:"root"`
}



// func CPUX() CPUJSON {
// 	cmd := "top -bn 1 -i -c | head -n 3 | tail -1 | awk {'print 100-$8'}	"
// 	porcentaje, _ := exec.Command("bash", "-c", cmd).Output()
// 	aux := strings.TrimSpace(string(porcentaje))
// 	consumo, _ := strconv.ParseFloat(aux, 64)

// 	output, err := ioutil.ReadFile("/proc/cpu_201801597")
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	var dataCPU Raiz
// 	json.Unmarshal(output, &dataCPU)

// 	var cpu CPUJSON

// 	cpu.Procesos = dataCPU
// 	cpu.Usado = usoCPU

// 	return cpu
// }

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func echo(conn *websocket.Conn) {
	for {
		time.Sleep(2 * time.Second)
	}
}

func Home(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	HomeEcho(ws)
}

func HomeEcho(conn *websocket.Conn) {
	for {
		Home := HomeHandler()
		conn.WriteJSON(Home)
		time.Sleep(8 * time.Second)
	}
}

type HomeJSON struct {
	Ejecucion   int  `json:"ejecucion"`
	Suspendidos int  `json:"suspendidos"`
	Detenidos   int  `json:"detenidos"`
	Zombies     int  `json:"zombies"`
	Total       int  `json:"total"`
	Procesos    Raiz `json:"procesos"`
}

func HomeHandler() HomeJSON {

	output, err := ioutil.ReadFile("/proc/cpu_201801597")
	if err != nil {
		log.Fatal(err)
	}
	var dataCPU Raiz
	json.Unmarshal(output, &dataCPU)
	var home HomeJSON
	home.Total = len(dataCPU.Padres)
	for i, v := range dataCPU.Padres {
		switch v.Usuario {
		case "-1":
			dataCPU.Padres[i].Usuario = "root"
		case "3":
			dataCPU.Padres[i].Usuario = "carlos"
		}

		switch v.Estado {
		case "1":
			dataCPU.Padres[i].Estado = "Ejecutando"
			home.Ejecucion++
		case "1026":
			dataCPU.Padres[i].Estado = "Suspendido"
			home.Suspendidos++
		case "260":
			dataCPU.Padres[i].Estado = "Detenido"
			home.Detenidos++
		case "128":
			dataCPU.Padres[i].Estado = "Zombie"
			home.Zombies++
		}

	}
	home.Procesos = dataCPU
	return home
}

func RAM(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	RAMEcho(ws)
}

func RAMEcho(conn *websocket.Conn) {
	for {
		RAM := RAMHandler()
		conn.WriteJSON(RAM)
		time.Sleep(2 * time.Second)
	}
}

type RAMJSON struct {
	Total      int     `json:"total"`
	Consumo    int     `json:"consumo"`
	Porcentaje float64 `json:"porcentaje"`
}

func RAMHandler() RAMJSON {
	comandoCache := "free -m | head -2 | tail -1 | awk '{print $6}'"
	dataCache, _ := exec.Command("bash", "-c", comandoCache).Output()
	aux := strings.TrimSpace(string(dataCache))
	cache, _ := strconv.Atoi(aux)

	out, e := ioutil.ReadFile("/proc/memo_201801597")
	if e != nil {
		log.Fatal(e)
	}
	var data Memory
	json.Unmarshal(out, &data)
	total := data.Total

	consumo := total - data.Free - cache + data.Shared + data.Buffer
	porcentaje := (float64(consumo) / float64(total)) * 100
	var ram RAMJSON
	ram.Total = total
	ram.Consumo = consumo
	ram.Porcentaje = porcentaje
	return ram
}


func CPU(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	CPUEcho(ws)
}

func CPUEcho(conn *websocket.Conn) {
	for {
		CPU := CPUHandler()
		conn.WriteJSON(CPU)
		time.Sleep(1 * time.Second)
	}
}

type CPUJSON struct {
	Porcentaje    float64 `json:"porcentaje"`
}

func CPUHandler() CPUJSON {
	cmd := "awk '{u=$2+$4; t=$2+$4+$5; if (NR==1){u1=u; t1=t;} else print ($2+$4-u1) * 100 / (t-t1) ; }' <(grep 'cpu ' /proc/stat) <(sleep 0.1;grep 'cpu ' /proc/stat)"
	consumo, _ := exec.Command("bash", "-c", cmd).Output()
	aux := strings.TrimSpace(string(consumo))
	porcentaje, _ := strconv.ParseFloat(aux, 64)

	var cpu CPUJSON
	cpu.Porcentaje=porcentaje
	return cpu
}
type  KillJSON struct {
	PID    int `json:"pid"`
}
func kill(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var kill KillJSON
	_ = json.NewDecoder(r.Body).Decode(&kill)
    
    

	process, err := os.FindProcess(kill.PID)

	if err != nil {
		fmt.Println("error1: " + err.Error());
	} else {
		err = process.Kill()
		if err != nil {
			fmt.Println("error3: " + err.Error())
		} else {
			fmt.Println("Proceso matado correctamente")
		}
	}

	
	fmt.Println("Command Successfully Executed")
	json.NewEncoder(w).Encode("OKOK")
}

func main() {

	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/Home", Home)

	router.HandleFunc("/RAM", RAM)

	router.HandleFunc("/CPU", CPU)

	router.HandleFunc("/Kill", kill)
	
	c := cors.New(cors.Options{
        AllowedOrigins: []string{"*"},
        AllowCredentials: true,
    })

	handler := c.Handler(router)
	log.Fatal(http.ListenAndServe(":8080", handler))

	// RAMHandler()
}
