import React, { useEffect, useRef, useState } from 'react';

import { Accordion, Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';

const Home = () => {
	const ws = useRef(null);
	const [Total, setTotal] = useState(0)
	const [Ejecucion, setEjecucion] = useState(0)
	const [Suspendidos, setSuspendidos] = useState(0)
	const [Detenidos, setDetenidos] = useState(0)
	const [Zombies, setZombies] = useState(0)
	const [Procesos, setProcesos] = useState([])

	const killProc = async (e, x) => {
		e.preventDefault();
		const data = {
			pid: x
		}

		console.log(data)
		await axios
			.post("http://localhost:8080/Kill", data)
			.then(response => {
				if (response) {
					console.log(response.data)
				}
			})
	}
	useEffect(() => {

		ws.current = new WebSocket("ws://127.0.0.1:8080/Home");
		ws.current.onopen = () => { console.log('Enlace Conectado') };
		ws.current.onclose = () => { console.log("Enlace Cerrado") }
		const wsCurrent = ws.current;
		return () => { wsCurrent.close(); }

	}, [])

	useEffect(() => {
		if (!ws.current) return;

		ws.current.onmessage = (message) => {
			var valor = JSON.parse(message.data);
			setTotal(valor.total)
			setEjecucion(valor.ejecucion)
			setDetenidos(valor.detenidos)
			setSuspendidos(valor.suspendidos)
			setZombies(valor.zombies)
			setProcesos(valor.procesos.root)
		};
		


	}, [Total, Ejecucion, Suspendidos, Detenidos, Zombies, Procesos])

	

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
				<div className="col-md-6  mt-2" >
					{Procesos.map((element) => {
							
							return (
								<Accordion flush key={element.pid} defaultActiveKey="0">
								<Accordion.Item key={element.pid} eventKey="1">
									<Accordion.Header key={element.pid}>PID: {element.pid} - Proceso: {element.nombre}</Accordion.Header>
									{element.hijos.length > 0 ?
										element.hijos.map((child, id) => {
											return (
												<Accordion.Body key={id}>
													----- PID: {child.pid} - Proceso: {child.nombre}
												</Accordion.Body>
											)
										}) : null}
								</Accordion.Item>
								</Accordion> 
							)
						})}
					

				</div>
				<div className="col-md-6 mt-2" >
					<Table bordered hover variant="light">
						<thead>
							<tr>
								<th>PID</th>
								<th>Nombre</th>
								<th>Usuario</th>
								<th>Estado</th>
								<th>%RAM</th>
								<th>Accion</th>
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

										<td>
											{<Form onSubmit={event => killProc(event, element.pid)}>
												<Button type='submit'>
													KILL
												</Button>
											</Form>}
										</td>
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