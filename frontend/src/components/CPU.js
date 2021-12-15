import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,

);
const ws = new WebSocket("ws://127.0.0.1:8080/CPU");

const CPU = () => {

	const [Total, setTotal] = useState(0)
	const [Consumo, setConsumo] = useState(0)
	const [Porcentaje, setPorcentaje] = useState([])
	const [Labels, setLabels] = useState([])

	useEffect(() => {
		async function fetchWS() {
			ws.onopen = () => {
				console.log('WebSocket Client Connected');

			};
			ws.onmessage = (message) => {
				console.log(message.data)
				var valor = JSON.parse(message.data);
				var tiempoTranscurrido = Date.now();
				var hoy = new Date(tiempoTranscurrido);
				setTotal(valor.total)
				setConsumo(valor.consumo)
				if (Porcentaje.length < 10) {
					setPorcentaje(Porcentaje => [...Porcentaje, valor.porcentaje])
					setLabels(Labels => [...Labels, hoy.toLocaleTimeString()])
				} else {
					Porcentaje.shift()
					setPorcentaje(Porcentaje => [...Porcentaje, valor.porcentaje])
					Labels.shift()
					setLabels(Labels => [...Labels, hoy.toLocaleTimeString()])
				}
			};
			ws.onclose = () => {
				console.log("Enlace Cerrado")
			}
		}

		fetchWS()
	}, [Labels, Porcentaje])
	var data = {
		labels: Labels,
		datasets: [
			{
				label: "% Memoria",
				data: Porcentaje,
				fill: true,
				backgroundColor: '#000000',
				borderColor: '#000000 ',
				pointBorderColor: '#000000',
				pointBackgroundColor: '#000000',
				pointBorderWidth: 1,
			},
		],
	};

	var options = {
		maintainAspectRatio: false,
		scales: {
			y: {
				min: 0,
				max: 100,
			}
		}
	};
	return (
		<div className="container mb-5">
			<div className="row" style={{
				Height: 500,
				display: "flex"
			}}>
				<div className='container row ' style={{ alignContent: "center", background: "white", padding: "30px 20px 10px 20px", borderRadius: 10 }}>
					<div className="col-md-6  mt-2 d-flex justify-content-evenly" >
						<h4 style={{ alignContent: "center", fontFamily: 'Roboto Condensed' }}>
							Total: {Total} MB
						</h4>
					</div>
					<div className="col-md-6  mt-2 d-flex justify-content-evenly" >
						<h4 style={{ alignContent: "center", fontFamily: 'Roboto Condensed' }}>
							Consumida: {Consumo} MB
						</h4>
					</div>
					<div className=" d-flex justify-content-evenly mb-1">
						<h2 style={{ alignContent: "center", fontFamily: 'Roboto Condensed' }}>
							Consumo de memoria RAM
						</h2>
					</div>
					<div className="row" style={{
				Height: 500,
				display: "flex"
			}}>
					<Line data={data} options={options} 
  height={125}/>
					</div>
				</div>
			</div>
		</div>

	);
}

export default CPU;