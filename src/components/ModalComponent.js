import React from "react";

import "./Home.css";
import Button from "react-bootstrap/esm/Button";

const ModalComponent = ({ setShow, handleTitle, title, handleSaveButton }) => {
  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className="ModalContainer">
      <div className="ModalBox">
        <form className="modalForm">
          <p style={{ fontWeight: "bold", fontSize: "20px" }}>Node Title</p>
          <div>
            <textarea
              type="text"
              name="title"
              value={title}
              placeholder="Enter Node Title"
              autoComplete="off"
              onChange={handleTitle}
            />
          </div>
          <div className="d-flex align-items-center justify-content-end gap-4">
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveButton} variant="dark">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalComponent;
