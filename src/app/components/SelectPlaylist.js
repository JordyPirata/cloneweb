import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  Option,
  SelectItem,
} from "@nextui-org/react";

function SelectPlaylist({
  isOpen,
  onClose,
  onSave,
  playlists,
  initialValue,
  message,
  song,
}) {
  const [selectedPlaylist, setSelectedPlaylist] = useState(initialValue);

  const handleSave = () => {
    onSave(selectedPlaylist);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Seleccionar Playlist</ModalHeader>
        <ModalBody>
          <p className="text-slate-600 text-sm">{message}</p>
          <Select
            value={selectedPlaylist}
            onChange={(value) => setSelectedPlaylist(value)}
            placeholder="Seleccionar Playlist"
            aria-label="Seleccionar Playlist"
          >
            {playlists.map((playlist) => (
              <SelectItem key={playlist.id} value={playlist.id}>
                {playlist.name}
              </SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" variant="dark" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSave}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SelectPlaylist;
