import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({ show, onConfirm, onCancel, message }) => {
  return (
    <Modal show={show} onHide={onCancel} centered
    style={{ borderRadius: "20px", overflow: "hidden" }}>
      <Modal.Header className="justify-content-center">
        <Modal.Title className="text-center">Confirm Subscription</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>{message}</p>
        <p>Do you want to proceed?</p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onCancel} 
        style={{background:'#fff', color:'#9860DA', border:'#9860DA' }}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} 
        style={{background:'#9860DA', color:'#fff'}}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
