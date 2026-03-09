import axios from "axios";
import User from "../models/userModel.js";

const getSongs = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.jamendo.com/v3.0/tracks/?client_id=0ba060ad&format=jsonpretty&limit=15`,
    );
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};
const getPlaylistByTag = async (req, res) => {
  try {
    const tag = (req.params.tag || req.query.tag || "").toString().trim();
    if (!tag)
      return res.status(400).json({ message: "Missing Tag Parameters" });

    const limit = parseInt(req.query.limit ?? "10", 10) || 10;
    const client_id = "0ba060ad";
    const params = {
      client_id: client_id,
      format: "jsonpretty",
      tags: tag,
      limit,
    };
    const response = await axios.get("https://api.jamendo.com/v3.0/tracks/", {
      params,
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "getPlaylistTag error",
      error?.response?.data ?? error.message ?? error,
    );
    return res.status(500).json({ message: "Failed to fetch" });
  }
};
const toggleFavourite = async (req, res) => {
  try {
    console.log("TOGGLE FAV CALLED");

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const song = req.body.song;

    if (!song || !song.id) {
      return res.status(400).json({ message: "Invalid song data" });
    }

    const existing = user.favourites.find(
      (fav) => String(fav.id) === String(song.id),
    );

    if (existing) {
      user.favourites = user.favourites.filter((fav) => fav.id !== song.id);
    } else {
      user.favourites.push(song);
    }

    await user.save();

    console.log("UPDATED FAVS:", user.favourites);

    return res.status(200).json(user.favourites);
  } catch (error) {
    console.error("Toggle Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export { getSongs, getPlaylistByTag, toggleFavourite };
