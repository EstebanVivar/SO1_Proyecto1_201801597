package main

import (
	"backend/monitor"
	"flag"
)

var (
	port = flag.String("p", ":8080", "set port")
)

func init() {
	flag.Parse()
}

func main(){
	monitor.Start(*port)
}