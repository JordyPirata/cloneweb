import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const SongList = ({ playlist, onSelect, onAddToPlaylist }) => {
  return (
    <List component="nav">
      {playlist.map((track, index) => (
        <ListItem button key={index} onClick={() => onSelect(index)}>
          <ListItemText primary={track.title} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="add"
              onClick={() => onAddToPlaylist(track)}
            >
              <AddIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default SongList;
