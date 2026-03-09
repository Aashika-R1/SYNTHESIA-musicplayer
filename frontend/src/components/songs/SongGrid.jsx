import React from "react";
import "../../css/songs/SongGrid.css";
import SongCard from "./SongCard";

const SongGrid = ({ songs, onSelectFavourite }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="song-grid-empty">
        <p className="empty-text"> No songs available yet </p>
        <p className="empty-subtext">
          Add songs to your favourites to see them here.
        </p>
      </div>
    );
  }
  return (
    <div className="song-grid-wrapper">
      <h2 className="song-grid-heading"></h2>
      <div className="song-grid">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onSelectFavourite={() => onSelectSong(song)}
          />
        ))}
      </div>
    </div>
  );
};

export default SongGrid;
