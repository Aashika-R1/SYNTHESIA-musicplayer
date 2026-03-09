import React from "react";
import { GiPauseButton } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { ImSpinner2 } from "react-icons/im";
import "../../css/footer/ControlArea.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { formatTime } from "../utils/helper.js";
import { updateFavorites } from "../../redux/slices/authslice.js";

const ControlArea = ({ playerState, playerControls }) => {
  const dispatch = useDispatch();

  const { user, token, isauthenticated } = useSelector((state) => state.auth);

  const {
    isPlaying,
    currentTime = 0,
    duration = 0,
    currentSong,
    isLoading,
  } = playerState;

  const { handleTogglePlay, handleNext, handlePrev, handleSeek } =
    playerControls;

  const currentSongId = currentSong?.id || currentSong?._id;

  const isLiked = Boolean(
    currentSongId &&
    user?.favourites?.some(
      (fav) => String(fav.id || fav._id) === String(currentSongId),
    ),
  );

  const handleLike = async () => {
    if (!isauthenticated || !currentSong) return;

    try {
      const songData = {
        id: currentSong.id || currentSong._id,
        name: currentSong.name,
        artist_name: currentSong.artist_name,
        image: currentSong.image,
        duration: currentSong.duration,
        audio: currentSong.audio,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
        { song: songData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(updateFavorites(res.data));
    } catch (error) {
      console.error("Favourite error:", error.response?.data || error.message);
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="control-root">
      {/* Control Buttons */}
      <div className="control-buttons">
        <button
          type="button"
          aria-label="previous"
          className="control-icon-btn"
          onClick={handlePrev}
        >
          <TbPlayerTrackPrevFilled color="#1DB954" size={24} />
        </button>

        <button
          type="button"
          aria-label={isPlaying ? "pause" : "play"}
          className="control-play-btn"
          onClick={handleTogglePlay}
        >
          {isLoading ? (
            <ImSpinner2 className="animate-spin" size={36} color="#1DB954" />
          ) : isPlaying ? (
            <GiPauseButton color="#1DB954" size={42} />
          ) : (
            <FaCirclePlay color="#1DB954" size={42} />
          )}
        </button>

        <button
          type="button"
          aria-label="next"
          className="control-icon-btn"
          onClick={handleNext}
        >
          <TbPlayerTrackNextFilled color="#1DB954" size={24} />
        </button>

        {isauthenticated && (
          <button
            type="button"
            aria-label={isLiked ? "unlike" : "like"}
            className="control-icon-btn"
            onClick={handleLike}
          >
            {isLiked ? (
              <FaHeart color="#1DB954" size={22} />
            ) : (
              <FaRegHeart color="#1DB954" size={22} />
            )}
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="control-progress-wrapper">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          className="control-progress"
          onChange={(e) => duration && handleSeek(Number(e.target.value))}
          style={{
            background: `linear-gradient(
              to right,
              #1DB954 ${progress}%,
              #333 ${progress}%
            )`,
          }}
        />

        <div className="control-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;
