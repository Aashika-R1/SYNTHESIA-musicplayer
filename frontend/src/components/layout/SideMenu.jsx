import React from "react";

import { IoIosSettings } from "react-icons/io";
import logo from "../../assets/wsa-logo.jpg";
import "../../css/sidemenu/SideMenu.css";
import { CiUser } from "react-icons/ci";
import { AiOutlineHome, AiOutlineSearch, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../redux/slices/uislice";

const SideMenu = ({ setView, view, onOpenEditProfile }) => {
  const dispatch = useDispatch();
  const { user, isauthenticated } = useSelector((state) => state.auth);

  const displayuser = {
    name: user?.name || "Guest",
    avatar: user?.avatar || "",
  };
  const handleSearchClick = () => {
    if (!isauthenticated) {
      dispatch(openAuthModal("login"));
      return;
    }
    setView("search");
  };
  const handleFavouriteClick = () => {
    if (!isauthenticated) {
      dispatch(openAuthModal("login"));
      return;
    }
    setView("favourite");
  };

  const getNavBtnClass = (item) =>
    `sidemenu-nav-btn ${view === item ? "active" : ""}`;
  return (
    <>
      <aside className="sidemenu-root">
        {/* Logo */}
        <div className="sidemenu-header">
          <img src={logo} alt="wsa-logo" className="sidemenu-logo-img" />
          <h2 className="sidemenu-logo-title">Synthesia</h2>
        </div>
        {/* Navigation */}
        <nav className="sidemenu-nav" aria-label="Main navigation">
          <ul className="sidemenu-nav-list">
            <li>
              <button
                className={getNavBtnClass("home")}
                onClick={() => setView("home")}
              >
                <AiOutlineHome className="sidemenu-nav-icon" size={18} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleSearchClick}
                className={getNavBtnClass("search")}
              >
                <AiOutlineSearch className="sidemenu-nav-icon" size={18} />
                <span> Search</span>
              </button>
            </li>
            <li>
              <button
                className={getNavBtnClass("favourite")}
                onClick={handleFavouriteClick}
              >
                <AiOutlineHeart size={18} />
                <span>Favourite</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex-1"></div>
        <div className="sidemenu-profile-row">
          {displayuser.avatar ? (
            <>
              <div className="sidemenu-avatar-img">
                <img
                  src={displayuser.avatar}
                  alt="avatar"
                  width={48}
                  height={48}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0.75rem",
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="profile-placeholder">
                <CiUser size={30} />
              </div>
            </>
          )}

          <div className="sidemenu-username-wrapper">
            <div className="sidemenu-username">{displayuser.name}</div>
          </div>
          {isauthenticated && (
            <div className="settings-container">
              <button
                type="button"
                className="sidemenu-settings-btn"
                onClick={onOpenEditProfile}
              >
                <IoIosSettings size={20} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
