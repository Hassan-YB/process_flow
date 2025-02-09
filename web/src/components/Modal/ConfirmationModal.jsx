import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({ show, onHide, onConfirm, title, body }) => {
  return (
    <Modal show={show} onHide={onHide} centered
      style={{ borderRadius: "20px", overflow: "hidden" }}>
      <Modal.Header closeButton className="justify-content-center">
        <Modal.Title className="text-center">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>{body}</p>
        <p>Do you want to proceed?</p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onHide}
          style={{ background: '#fff', color: '#9860DA', border: '2px solid #9860DA' }}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}
          style={{ background: '#9860DA', color: '#fff' }}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
