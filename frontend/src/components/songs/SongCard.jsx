import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../css/songs/SongCard.css";
import { useDispatch } from "react-redux";
import { updateFavorites } from "../../redux/slices/authSlice";

const SongCard = ({ song, onSelectSong }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isFavourite = auth.user?.favourites?.some(
    (fav) => String(fav.id) === String(song.id),
  );

  const handleToggleFavourite = async (e) => {
    e.stopPropagation(); // prevent playing song

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
        { song },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(updateFavorites(res.data));

      console.log("Favourite toggled");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="song-card" onClick={onSelectSong}>
      <div className="song-card-image">
        <img src={song.image} alt={song.name} loading="lazy" />
      </div>

      <div className="song-card-info">
        <h4 className="song-title">{song.name}</h4>
        <p className="song-artist">{song.artist_name}</p>
      </div>

      <button className="heart-btn" onClick={handleToggleFavourite}>
        {isFavourite ? "💚" : "🤍"}
      </button>
    </div>
  );
};

export default SongCard;
