import React from "react";
import workoutImg from "../../assets/workout.jpg";
import rockImg from "../../assets/rock.jpg";
import chillImg from "../../assets/chill.jpg";
import HappyImg from "../../assets/Happy.jpg";
import relaxImg from "../../assets/relax.jpg";

import "../../css/mainArea/Playlist.css";

const Playlist = ({ onSelectTag }) => {
  const items = [
    {
      id: 1,
      label: "Workout",
      tag: "workout",
      img: workoutImg,
    },
    {
      id: 2,
      label: "Chill",
      tag: "chill",
      img: chillImg,
    },
    {
      id: 3,
      label: "Happy",
      tag: "happy",
      img: HappyImg,
    },
    {
      id: 4,
      label: "Relaxing",
      tag: "relaxing",
      img: relaxImg,
    },
    {
      id: 5,
      label: "Rock",
      tag: "rock",
      img: rockImg,
    },
  ];

  return (
    <div className="playlist-root">
      <h1 className="playlist-title">Playlists</h1>

      <div className="playlist-wrapper">
        <div className="playlist-grid">
          {items.map((item) => (
            <div
              className="playlist-card"
              key={item.id}
              onClick={() => onSelectTag(item.tag)}
            >
              <img src={item.img} alt={item.label} className="playlist-image" />
              <h4 className="playlist-label">{item.label}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
