import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { SearchIcon, Trash2 } from "lucide-react";
import { Button } from "@nextui-org/react";

const SongList = ({
  playlist,
  onSelect,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  isPlaylist = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlaylist = playlist.filter((track) =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          onChange={handleSearchChange}
          value={searchTerm}
          type="text"
          placeholder="Buscar"
          className="bg-gray-100 text-black rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <List component="nav">
        {filteredPlaylist.map((track, index) => (
          <ListItem button key={index} onClick={() => onSelect(index)}>
            <ListItemText primary={track.title} />
            <ListItemSecondaryAction className="space-x-2">
              <Button
                edge="end"
                aria-label="add"
                color="primary"
                isIconOnly
                onClick={() => onAddToPlaylist(track)}
              >
                <AddIcon />
              </Button>
              {isPlaylist && (
                <Button
                  edge="end"
                  aria-label="delete"
                  variant="bordered"
                  color="danger"
                  isIconOnly
                  onClick={() => {
                    if (filteredPlaylist.length > 1)
                      onRemoveFromPlaylist(index);
                  }}
                >
                  <Trash2 />
                </Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SongList;
