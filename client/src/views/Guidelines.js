import React, {useState} from "react";
import { Button, Modal } from "react-bootstrap";

const Guidelines = (props) => {

    const handleClose = () => props.setShow(false);
  
    return (
      <>
        <Modal
          show={props.show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
          <Modal.Title>Pin and Protest Guidelines</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            All Guidelines Here
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose} >Understood</Button>
          </Modal.Footer>
        </Modal>
      </>
    );

}

export default Guidelines; 
