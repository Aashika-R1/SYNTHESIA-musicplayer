import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";
import Modal from "../components/common/Modal.jsx";
import EditProfile from "../components/auth/EditProfile.jsx";

import useAudioPlayer from "../hooks/useAudioPlayer.js";
import "../css/pages/HomePage.css";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [pendingFavouriteIndex, setPendingFavouriteIndex] = useState(null);

  const auth = useSelector((state) => state.auth);

  // Decide which playlist the player should use
  useEffect(() => {
    setPlaylist(view === "search" ? searchSongs : songs);
  }, [view, searchSongs, songs]);

  const {
    audioRef,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleSeek,
    handleChangeVolume,
  } = useAudioPlayer(playlist);

  // Play favourite AFTER playlist updates
  useEffect(() => {
    if (pendingFavouriteIndex !== null) {
      playSongAtIndex(pendingFavouriteIndex);
      setPendingFavouriteIndex(null);
    }
  }, [playlist]);

  const playerState = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
  };

  const playerControls = {
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
  };

  const playerFeatures = {
    onToggleMute: handleToggleMute,
    onToggleLoop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeSpeed,
    onChangeVolume: handleChangeVolume,
  };

  // Fetch initial songs
  useEffect(() => {
    const fetchInitialSongs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs`,
        );
        setSongs(res.data.results || []);
      } catch (error) {
        console.error("Error while fetching songs", error);
        setSongs([]);
      }
    };

    fetchInitialSongs();
  }, []);

  // Load playlist by tag
  const loadPlaylist = async (tag) => {
    if (!tag) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`,
      );
      setSongs(res.data.results || []);
      setView("home");
    } catch (error) {
      console.error("Error while fetching songs", error);
      setSongs([]);
    }
  };

  const handleSelectSong = (index) => {
    playSongAtIndex(index);
  };

  const handlePlayFavourite = (song) => {
    const favourites = auth.user?.favourites || [];
    if (!favourites.length) return;

    const index = favourites.findIndex((fav) => fav.id === song.id);
    if (index === -1) return;

    setSongs(favourites);
    setView("home");
    setPendingFavouriteIndex(index);
  };

  return (
    <div className="homepage-root">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      >
        {currentSong?.audio && (
          <source src={currentSong.audio} type="audio/mpeg" />
        )}
      </audio>

      <div className="homepage-main-wrapper">
        {/* Sidebar */}
        <div className="homepage-sidebar">
          <SideMenu
            view={view}
            setView={setView}
            onOpenEditProfile={() => setOpenEditProfile(true)}
          />
        </div>

        {/* Main Content */}
        <div className="homepage-content">
          <MainArea
            view={view}
            currentIndex={currentIndex}
            songsToDisplay={playlist}
            setSearchSongs={setSearchSongs}
            onSelectSong={handleSelectSong}
            onSelectFavourite={handlePlayFavourite}
            onSelectTag={loadPlaylist}
          />
        </div>
      </div>

      {/* Footer Player */}
      <Footer
        playerState={playerState}
        playerControls={playerControls}
        playerFeatures={playerFeatures}
      />

      {/* Edit Profile Modal */}
      {openEditProfile && auth.user && (
        <Modal onClose={() => setOpenEditProfile(false)}>
          <EditProfile onClose={() => setOpenEditProfile(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Homepage;
