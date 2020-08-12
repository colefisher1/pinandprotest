import React from 'react';
import { Nav, Navbar} from 'react-bootstrap';

//The website's navigation bar
export const NavigationBar = () => (
    <Navbar style={{height: "10vh"}}className="color-nav" variant="light">
    <Navbar.Brand className="brand-nav" href="/map">
        <img
            alt=""
            src="logo.png"
            width="100"
            className="d-inline-block align-top"

        />{''}
        </Navbar.Brand>
    <Nav className="ml-auto navbar-nav">
        <Nav.Link href="/map" exact component={Map} >Map</Nav.Link>
        <Nav.Link href="/news">News</Nav.Link> 
        <Nav.Link href="/reports">Forum</Nav.Link>
        <Nav.Link href="/account">Account</Nav.Link>
        <Nav.Link href="/logout">Logout</Nav.Link>
    </Nav>
    </Navbar>
)