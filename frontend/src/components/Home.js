import React, { useEffect, useState } from 'react';

import { Table } from 'react-bootstrap';
const ws = new WebSocket("ws://127.0.0.1:8080/Home");

const Home = () => {

	const [Total, setTotal] = useState(0)
	const [Ejecucion, setEjecucion] = useState(0)
	const [Suspendidos, setSuspendidos] = useState(0)
	const [Detenidos, setDetenidos] = useState(0)
	const [Zombies, setZombies] = useState(0)
	const [Procesos, setProcesos] = useState([])

	useEffect(() => {
		async function fetchWS() {
			ws.onopen = () => {
				console.log('WebSocket Client Connected');

			};
			ws.onmessage = (message) => {
				var valor = JSON.parse(message.data);
				setTotal(valor.total)
				setEjecucion(valor.ejecucion)
				setDetenidos(valor.detenidos)
				setSuspendidos(valor.suspendidos)
				setZombies(valor.zombies)
				setProcesos(valor.procesos.root)
			};
			ws.onclose = () => {
				console.log("Enlace Cerrado")
			}
		}

		fetchWS()
	}, [])


	let font_color = "white"
	return (
		<div className="container-fluid mb-5">
			<div className="row" style={{
				minHeight: " 100%",
				display: "flex"
			}}>
				<div className="col-md-4  mt-4 " >
					<h4 style={{ alignContent: "center", fontFamily: 'Roboto Condensed', color: `${font_color}` }}>
						Procesos en ejecucion: {Ejecucion}
					</h4>
					<h4 style={{ alignContent: "center", fontFamily: 'Roboto Condensed', color: `${font_color}` }}>
						Procesos suspendidos:{Suspendidos}
					</h4>
					<h4 style={{ alignContent: "center", fontFamily: 'Roboto Condensed', color: `${font_color}` }}>
						Procesos detenidos:{Detenidos}
					</h4>
					<h4 style={{ alignContent: "center", fontFamily: 'Roboto Condensed', color: `${font_color}` }}>
						Procesos Zombies:{Zombies}
					</h4>
					<h4 style={{ alignContent: "center", fontFamily: 'Roboto Condensed', color: `${font_color}` }}>
						Total: {Total}
					</h4>
				</div>
				<div className="col-md-8 mt-4" >
					<Table bordered hover variant="dark">
						<thead>
							<tr>
								<th>PID</th>
								<th>Nombre</th>
								<th>Usuario</th>
								<th>Estado</th>
							</tr>
						</thead>
						<tbody>
							{Procesos.map(element => {
								return(
								<tr key={element.pid}>
									<td>{element.pid}</td>
									<td>{element.nombre}</td>
									<td>{element.usuario}</td>
									<td>{element.estado}</td>
								</tr>)
							})}
						</tbody>
					</Table>
				</div>
			</div>
		</div>
	);
}

export default Home;