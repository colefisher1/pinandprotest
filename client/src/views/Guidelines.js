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
            What defines a peaceful and non-peaceful protest? 
            <br></br>
            <br></br>
            A peaceful protest is a protest in which no violence has been witnessed.
            <br></br>
            A non-peaceful protest is a protest in which participants are being physically or verbally harassed, injured, or abused in any type of way. A non-peaceful protest is also a protest in which participants are using violence to make a statement or be heard. It can also be a protest where police officers or any other person, not necessarily the participant, is resorting to violence.
            <br></br>
            <br></br>
            As a User of Pin &amp; Protest, you shall not: 
            <br></br>
            <br></br>
            Add protests that are not factually correct to the map;
            <br></br>
            Leave rude, harassing, insulting, provocative, discriminating, non-tolerant, religious, racist, political, homophobic, or offensive information when adding a protest, when posting a thread, when replying to a thread, and when creating your username.
            <br></br>
            Advertise any product or service;
            <br></br>
            <br></br>
            At our sole discretion, we reserve the right to:
            <br></br>
            <br></br>
            Delete any inappropriate protest, comments, or materials;
            <br></br>
            Restrict or ban your access to Pin &amp; Protest at any moment and without notification if we determine that the content posted violates these guidelines;
            <br></br>
            Use, copy, modify, reshuffle, move, change, publicly display, publicly conduct and distribute protests, comments, and materials;
            <br></br>
            Block your comments for any reasons or moderate them as we deem appropriate;
            <br></br>
            Disable Forum page at any time without any previous notice.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose} >Understood</Button>
          </Modal.Footer>
        </Modal>
    );

}

export default Guidelines; 
