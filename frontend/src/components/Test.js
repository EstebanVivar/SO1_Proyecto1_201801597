import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const ws = new WebSocket("ws://127.0.0.1:8080/ws");
export default class Test extends Component {

    state = {
        labels: [],
        datos: [],
        valor:""
    };
    componentDidMount = async e => {

        ws.onopen = () => {
            console.log('WebSocket Client Connected');
            
        };
        ws.onmessage = (message) => {
            console.log(message.data);
            var valor = JSON.parse(message.data);

            if (this.state.datos.length > 20){
                this.state.datos.shift()
                this.state.labels.shift()
            } 

            this.state.datos.push(valor.cpu.porcentaje)
            var tiempoTranscurrido = Date.now();
            var hoy = new Date(tiempoTranscurrido);    
     
            this.state.labels.push(hoy.toUTCString())
            this.setState({
            })
        };
        ws.onclose = () =>{
            console.log("Enlace Cerrado")
            
        }
    }

 

    render() {
        
        
        return (
            <div className="center-align"  >
              
                <h1 class="thin">Consumo de Memoria Ram</h1>
                
                <div class='container'>
                    <Line data={data} options={options} />
                </div>
            </div>
        );
    }
}
