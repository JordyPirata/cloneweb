import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

function AcceptModal({ isOpen, onClose, onSave, tittleModal, message }) {
  const handleSave = () => {
    onSave();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{tittleModal}</ModalHeader>
        <ModalBody>
          <p className="text-slate-600 text-sm ">{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" variant="dark" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-red-400 text-white hover:bg-red-600"
            onClick={handleSave}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AcceptModal;
