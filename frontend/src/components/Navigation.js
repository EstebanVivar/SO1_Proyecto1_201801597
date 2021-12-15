import React from 'react';



import { Navbar, Nav } from 'react-bootstrap';

const Navigation = () => {
  
	let theme="dark";
    return (
        <Navbar className="mb-2" collapseOnSelect  expand="sm" sticky="top" bg={theme} variant={theme} >

            <Navbar.Brand style={{ fontSize: "28px", fontWeight: "bolder" }} href="/Home">
                &nbsp;&nbsp;&nbsp;SO1

            </Navbar.Brand>
            <Navbar.Toggle/>
            <Navbar.Collapse  >
                <Nav >                
                    <Nav.Link  href="/RAM"> &nbsp; RAM &nbsp;</Nav.Link>
                    <Nav.Link  href="/Editor"> &nbsp; CPU &nbsp;</Nav.Link>                   
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;