import React from 'react';
import { Container } from 'react-bootstrap';

//Displays objects between <Layout> tags within a Bootstrap container
const Layout = (props) => {
    return (
        <Container style={{maxWidth: "100%", height: "90vh", padding: "0"}}>
            {props.children}
        </Container>
    )
}

export default Layout;