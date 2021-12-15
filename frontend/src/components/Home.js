import React, { useEffect, useState } from 'react';

import { Accordion, Table } from 'react-bootstrap';
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


	let font_color = "black"
	return (
		<div className="d-flex justify-content-center container-fluid p-5 mb-5">
			<div className="row" style={{
				minHeight: " 100%",
				display: "flex"
			}}>
				<div className=" d-flex justify-content-evenly " style={{ background: "white", padding: "28px 20px 20px 20px", borderRadius: 10 }}>
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
				<div className="col-md-6  mt-4 " >
					{Procesos.map((element) => {
						return (

							<Accordion key={element.pid} defaultActiveKey="0">
								<Accordion.Item key={element.pid} eventKey="1">
									<Accordion.Header key={element.pid}>PID: {element.pid} - Proceso:{element.nombre}</Accordion.Header>
									{element.hijos.length > 0 ?
										element.hijos.map((child, id) => {
											return (
												<Accordion.Body className='bg-dark text-white ' key={id}>
													PID: {child.pid} - Proceso:{child.nombre}
												</Accordion.Body>
											)
										}) : null}
								</Accordion.Item>

							</Accordion>
						)
					})}


				</div>
				<div className="col-md-6 mt-4" >
					<Table bordered hover variant="light">
						<thead>
							<tr>
								<th>PID</th>
								<th>Nombre</th>
								<th>Usuario</th>
								<th>Estado</th>
								<th>%RAM</th>
							</tr>
						</thead>
						<tbody>
							{Procesos.map(element => {
								return (<>
									<tr key={element.pid}>
										<td>{element.pid}</td>
										<td>{element.nombre}</td>
										<td>{element.usuario}</td>
										<td>{element.estado}</td>
										<td>{Number.parseFloat(element.ram / 7846 * 100).toFixed(2)}%</td>
									</tr>
								</>)
							})}
						</tbody>
					</Table>
				</div>
			</div>
		</div>
	);
}

export default Home;