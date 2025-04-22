// FileUploadModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import IconButton from "../IconButton";
import DropzoneComponent from "./Dropzone";

const FileUploadModal = ({
  showModal,
  handleClose,
  modalStep,
  setModalStep,
  uploadedFile,
  setUploadedFile,
}) => {
  const handleNext = () => {
    if (modalStep < 3) setModalStep(modalStep + 1);
  };

  const handleBack = () => {
    if (modalStep > 1) setModalStep(modalStep - 1);
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Process</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center mb-3">
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={`mx-1 rounded-circle ${
                modalStep === step ? "bg-primary" : "bg-secondary"
              }`}
              style={{ width: 15, height: 15 }}
            ></span>
          ))}
        </div>

        {modalStep === 1 && (
          <DropzoneComponent setUploadedFile={setUploadedFile} />
        )}
        {modalStep === 2 && (
          <div className="text-center">
            <p>Step Two: Girl's Girls Inc ft. Diversity hires</p>
            <img src="/assets/logo.png" alt="Logo" className="mask-x-to-10%" />
          </div>
        )}
        {modalStep === 3 && (
          <div className="text-center">
            <p>
              Ready to upload:{" "}
              <strong>{uploadedFile?.name || "No file selected"}</strong>
            </p>
            <div className="d-flex justify-content-center">
              <IconButton
                icon="check"
                label="Confirm"
                onClick={handleNext}
                className="me-2"
              />
              <IconButton icon="close" label="Cancel" onClick={handleClose} />
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {modalStep > 1 && (
          <IconButton icon="arrow_back" label="Back" onClick={handleBack} />
        )}
        {modalStep < 3 && (
          <IconButton icon="arrow_forward" label="Next" onClick={handleNext} />
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default FileUploadModal;
