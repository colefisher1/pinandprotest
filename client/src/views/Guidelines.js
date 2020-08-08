import React, {useState} from "react";
import { Button, Modal } from "react-bootstrap";

const Guidelines = (props) => {

    const handleClose = () => props.setShow(false);
  
    return (
        <Modal
          show={props.show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
          <Modal.Title>Pin &amp; Protest Guidelines</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
            As a User of Pin &amp; Protest, you shall not: 
            <br></br>
            <br></br>
            Leave rude, harassing, insulting, provocative, discriminating, non-tolerant, religious, racist, political, homophobic, or offensive comments and statements;
            <br></br>
            Advertise any product or service;
            <br></br>
            <br></br>
            At our sole discretion, we reserve our right to:
            <br></br>
            <br></br>
            Delete any inappropriate or irrelevant comments or materials;
            <br></br>
            Restrict or ban your access to Pin &amp; Protest at any time and without notice if we determine that the content posted is in violation of this Agreement;
            <br></br>
            Use, copy, modify, reshuffle, move, change, publicly display, publicly conduct and distribute discussions, comments, and materials;
            <br></br>
            Block your comments for any reasons or moderate them as we deem appropriate;
            <br></br>
            Disable Discussion feature at any time without prior notification.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose} >Understood</Button>
          </Modal.Footer>
        </Modal>
    );

}

export default Guidelines; 
