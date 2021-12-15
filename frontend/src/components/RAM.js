import React, { useEffect, useRef, useState } from 'react';
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

const RAM = () => {

	const ws = useRef(null);
	const [Total, setTotal] = useState(0)
	const [Consumo, setConsumo] = useState(0)
	const [Porcentaje, setPorcentaje] = useState([])
	const [Labels, setLabels] = useState([])

	useEffect(() => {
		ws.current = new WebSocket("ws://127.0.0.1:8080/RAM");
		ws.current.onopen = () => { console.log('Enlace Abierto') };
		ws.current.onclose = () => { console.log("Enlace Cerrado") }
		const wsCurrent = ws.current;
		return () => { wsCurrent.close(); }
	}, [])

	useEffect(() => {
		if (!ws.current) return;

		ws.current.onmessage = (message) => {
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

		}

	}, [Total,Consumo,Labels, Porcentaje])
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
		<div className="container mb-1">
			<div className="row" style={{
				Height: 500,
				display: "flex"
			}}>
				<div className='container row ' style={{ alignContent: "center", background: "white", padding: "30px 20px 10px 20px", borderRadius: 10 }}>
					<div className=" d-flex justify-content-evenly mb-1">
						<h2 style={{ alignContent: "center", fontFamily: 'Roboto Condensed' }}>
							Consumo de memoria RAM
						</h2>
					</div>
					<div className="col-md-4  mt-2 d-flex justify-content-evenly" >
						<h4 style={{ alignContent: "center", fontFamily: 'Roboto Condensed' }}>
							Total: {Total} MB
						</h4>
					</div>
					<div className="col-md-4  mt-2 d-flex justify-content-evenly" >
						<h4 style={{ alignContent: "center", fontFamily: 'Roboto Condensed' }}>
							Utilizado: {Consumo} MB
						</h4>
					</div>
					<div className="col-md-4  mt-2 d-flex justify-content-evenly" >
						<h4 style={{ alignContent: "center", fontFamily: 'Roboto Condensed' }}>
							% Utilizado: {Number.parseFloat(Consumo / Total * 100).toFixed(2)} %

						</h4>
					</div>

					<div className="row" style={{
						Height: 500,
						display: "flex"
					}}>
						<Line data={data} options={options}
							height={110} />
					</div>
				</div>
			</div>
		</div>

	);
}

export default RAM;