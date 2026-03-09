import React from "react";

import SongDetail from "../player/SongDetail.jsx";
import ControlArea from "../player/ControlArea.jsx";
import Features from "../player/Features.jsx";

import "../../css/footer/Footer.css";

const Footer = ({ playerState, playerControls, playerFeatures }) => {
  return (
    <footer className="footer-root footer-glow">
      <SongDetail currentSong={playerState.currentSong} />
      <ControlArea
        playerState={playerState}
        playerControls={playerControls}
      />
      <Features
        playerState={playerState}
        playerFeatures={playerFeatures}
      />
    </footer>
  );
};

export default Footer;
