import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

function PlaylistAddModal({ isOpen, onClose, onSave, initialValue, message }) {
  const [editValue, setEditValue] = useState(initialValue);

  const handleSave = () => {
    onSave(editValue);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Añadir Playlist</ModalHeader>
        <ModalBody>
          <p className="text-slate-600 text-sm ">{message}</p>
          <Input
            placeholder="Nuevo Nombre"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
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

export default PlaylistAddModal;
