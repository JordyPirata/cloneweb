"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AudioPlayer from "../components/AudioPlayer";
import SongList from "../components/SongList";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { useAuth } from "../lib/context/authContext";
import {
  addPlaylist,
  addSongToPlaylist,
  db,
  deletePlaylist,
  getPlaylists,
  getSongs,
  removeSongFromPlaylist,
  uploadMP3File,
} from "../lib/firebase/firebase";
import PlaylistAddModal from "../components/PlaylistAddModal";
import { Snackbar } from "@material-ui/core";
import SelectPlaylist from "../components/SelectPlaylist";
import { Save } from "@material-ui/icons";
import { Trash2 } from "lucide-react";

export default function MercadoMusic() {
  const {
    isOpen: isAddPlaylistModalOpen,
    onOpen: onAddPlaylistModalOpen,
    onClose: onAddPlaylistModalClose,
  } = useDisclosure();
  const {
    isOpen: isSelectPlaylistModalOpen,
    onOpen: onSelectPlaylistModalOpen,
    onClose: onSelectPlaylistModalClose,
  } = useDisclosure();
  const [currentTrack, setCurrentTrack] = useState(0);
  const { user, userDB, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState([
    {
      title: "",
      url: "",
    },
  ]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState("");
  const [playlist, setPlaylist] = useState([
    {
      title: "",
      url: "",
    },
  ]);
  const fileInputRef = useRef(null);
  const [playlistName, setPlaylistName] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadMP3File(file);
        alert("Archivo MP3 subido correctamente");
      } catch (error) {
        alert("Error al subir el archivo MP3" + error);
        console.error(error);
      }
    }
  };

  const handleSelectTrack = (index) => {
    setCurrentTrack(index);
  };

  const handleSetPlaylist = (songs) => {
    console.log(songs);
    setPlaylist(songs);
    setCurrentPlaylist(songs);
  };

  useEffect(() => {
    if (user) {
      getPlaylists(user.uid).then((playlists) => {
        setPlaylists(playlists);
      });
      getSongs().then((songs) => {
        handleSetPlaylist(songs);
      });
    }
  }, [user]);

  const handleSaveAddPlaylist = async (name) => {
    const add = addPlaylist(name, user.uid);
    if (add) {
      setPlaylists([...playlists, { name, songs: [] }]);
    }
  };

  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (message, delay) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage("");
    }, delay); // El mensaje desaparecerá después de 3 segundos
  };

  const [songAddPlaylist, setSongAddPlaylist] = useState({});

  const handleAddToPlaylist = async (track) => {
    // Aquí puedes implementar la lógica para añadir la canción a la playlist
    setSongAddPlaylist(track);
    onSelectPlaylistModalOpen();
  };

  const handleSaveSongOnPlaylist = async (playlistId) => {
    console.log(playlistId.target.value, songAddPlaylist);
    try {
      await addSongToPlaylist(playlistId.target.value, songAddPlaylist);
      showAlert("Canción añadida a la playlist", 3000);
      setCurrentPlaylist((prevPlaylist) => [...prevPlaylist, songAddPlaylist]);
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.id === playlistId.target.value
            ? { ...playlist, songs: [...playlist.songs, songAddPlaylist] }
            : playlist
        )
      );
      onSelectPlaylistModalClose();
    } catch (error) {
      console.error("Error al añadir la canción a la playlist:", error);
    }
  };

  const handleRemoveFromPlaylist = async (index) => {
    // Aquí puedes implementar la lógica para eliminar una canción de la playlist
    try {
      const song = currentPlaylist[index];
      const newPlaylist = currentPlaylist.filter((_, i) => i !== index);
      setCurrentPlaylist(newPlaylist);
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.id === currentPlaylistId
            ? {
                ...playlist,
                songs:
                  playlist.songs.length > 1
                    ? playlist.songs.filter((item) => item !== song)
                    : playlist.songs,
              }
            : playlist
        )
      );
      await removeSongFromPlaylist(currentPlaylistId, index);
      showAlert("Canción eliminada de la playlist", 3000);
    } catch (error) {}
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#ffe600] via-slate-50 to-slate-50 text-white">
      <header className="bg-[#ffe600] py-4 px-6 flex items-center justify-between">
        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className="font-bold text-black text-lg"
            prefetch={false}
          >
            MercadoMusic
          </Link>
        </nav>
        <div>
          {user ? (
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <p className="text-black">{userDB.name}</p>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem color="primary" variant="bordered">
                    <Link href="/profile" className="text-black">
                      Mi perfil
                    </Link>
                  </DropdownItem>
                  {userDB.userType === "admin" && (
                    <DropdownItem color="primary" variant="solid">
                      <Link href="/admin" className="text-black">
                        Administración
                      </Link>
                    </DropdownItem>
                  )}
                  <DropdownItem color="danger" onClick={() => logout()}>
                    <a>Cerrar Sesion</a>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ) : (
            <div>
              <Link href="/register" className="text-black">
                Crea tu cuenta
              </Link>
              <Link href="/login" className="text-black">
                Ingresa
              </Link>
            </div>
          )}
        </div>
      </header>
      <div className="flex-1 grid grid-cols-[1fr_3fr] gap-6 p-6">
        <div className="bg-white text-black  border-x-large border-y-large border-y-gray-300 border-x-gray-300 rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-bold">Tus Listas de Reproducción</h2>
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                href="#"
                className="block hover:bg-gray-200 rounded-md p-2"
                prefetch={false}
                onClick={() => {
                  playlist.songs.length > 0
                    ? (setCurrentPlaylist(playlist.songs),
                      setCurrentPlaylistId(playlist.id))
                    : showAlert("La playlist no contiene canciones", 3000);
                }}
              >
                <div className="grid grid-cols-2 ">
                  <div>
                    <h3 className="font-medium">{playlist.name}</h3>
                    <p className="text-gray-400 text-sm">{`${
                      playlist.songs.length || 0
                    } canciones`}</p>
                  </div>
                  <Button
                    variant="bordered"
                    color="danger"
                    isIconOnly
                    className="justify-self-end"
                    aria-label="deletePlaylist"
                    onClick={() => {
                      deletePlaylist(playlist.id);
                      setPlaylists(
                        playlists.filter((item) => item.id !== playlist.id)
                      );
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={onAddPlaylistModalOpen}
            className="block hover:bg-gray-200 rounded-md p-2"
            variant="contained"
            color="primary"
          >
            Crear Nueva Lista
          </Button>
          <PlaylistAddModal
            isOpen={isAddPlaylistModalOpen}
            onClose={onAddPlaylistModalClose}
            onSave={handleSaveAddPlaylist}
            message="Coloque su nombre favorito para la playlist"
            initialValue={playlistName ? playlistName.name : ""}
          />
        </div>
        <div className="bg-white text-black  border-x-large border-y-large border-y-gray-300 border-x-gray-300 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Escuchando ahora</h2>
          </div>
          <AudioPlayer
            playlist={currentPlaylist}
            initialTrack={currentTrack}
            handleSelect={handleSelectTrack}
          />
        </div>
        {/*Muestra de las canciones dentro de la playlist */}
        <div className="bg-white text-black  border-x-large border-y-large border-y-gray-300 border-x-gray-300 rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-bold">Playlist En Reproduccion</h2>
          <SongList
            playlist={currentPlaylist || playlist}
            onSelect={handleSelectTrack}
            onAddToPlaylist={handleAddToPlaylist}
            isPlaylist
            onRemoveFromPlaylist={handleRemoveFromPlaylist}
          />
          {alertMessage && (
            <div className="opacity-75 fixed text-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-xl p-8 shadow-lg z-50">
              {alertMessage}
            </div>
          )}
        </div>
        <div className="flex flex-col bg-white text-black justify-center items-center  border-x-large border-y-large border-y-gray-300 border-x-gray-300 rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-bold">Subir Canciones</h2>
          <input
            type="file"
            accept=".mp3"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <Button
            startContent={<Save />}
            onClick={() => fileInputRef.current.click()}
          >
            Subir MP3
          </Button>
        </div>
      </div>

      <div className="bg-white text-black  border-x-large border-y-large border-y-gray-300 border-x-gray-300 rounded-lg p-4 space-y-4">
        <h2 className="text-xl font-bold">Canciones</h2>
        <SongList
          playlist={playlist}
          onSelect={handleSelectTrack}
          onAddToPlaylist={handleAddToPlaylist}
        />
        <SelectPlaylist
          isOpen={isSelectPlaylistModalOpen}
          onClose={onSelectPlaylistModalClose}
          onSave={handleSaveSongOnPlaylist}
          message="Seleccione la playlist en donde quiere agregar la cancion"
          playlists={playlists}
        />
        {alertMessage && (
          <div className="opacity-75 fixed text-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-xl p-8 shadow-lg z-50">
            {alertMessage}
          </div>
        )}
      </div>
    </div>
  );
}

function PauseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function RepeatIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ShuffleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
      <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
      <path d="m18 14 4 4-4 4" />
    </svg>
  );
}

function SkipBackIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" x2="5" y1="19" y2="5" />
    </svg>
  );
}

function SkipForwardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" x2="19" y1="5" y2="19" />
    </svg>
  );
}

function Volume2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
