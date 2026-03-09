import "../../css/mainArea/SongList.css";
import { formatTime } from "../utils/helper.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateFavorites } from "../../redux/slices/authSlice";

const SongList = ({ songs, onSelectSong, currentIndex }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleToggleFavourite = async (e, song) => {
    e.stopPropagation(); // prevent row click (play)

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
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  if (!songs || songs.length === 0) {
    return (
      <div className="songlist-root">
        <div className="songlist-empty">
          <p className="songlist-empty-text">🎵 No songs found</p>
          <span className="songlist-empty-subtext">
            Try searching with a different keyword
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="songlist-root">
      <div className="songlist-scroll">
        <table className="songlist-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Artist</th>
              <th>Year</th>
              <th>Duration</th>
              <th>Fav</th> {/* 🔥 New column */}
            </tr>
          </thead>

          <tbody>
            {songs.map((song, index) => {
              const isFavourite = auth.user?.favourites?.some(
                (fav) => String(fav.id) === String(song.id),
              );

              return (
                <tr
                  key={song.id}
                  onClick={() => onSelectSong(index)}
                  className={`songlist-row ${
                    currentIndex === index ? "songlist-row-active" : ""
                  }`}
                >
                  <td>{index + 1}</td>
                  <td>{song.name}</td>
                  <td>{song.artist_name}</td>
                  <td>{song.releasedate}</td>
                  <td>{formatTime(song.duration)}</td>

                  {/* 💚 HEART BUTTON */}
                  <td>
                    <button
                      onClick={(e) => handleToggleFavourite(e, song)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                    >
                      {isFavourite ? "💚" : "🤍"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongList;
