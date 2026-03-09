import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {openAuthModal ,closeAuthModal}from "../../redux/slices/uislice.js";
import "../../css/auth/Auth.css";
import Modal from "../common/Modal.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import { logout, clearError } from "../../redux/slices/authslice.js";



const Auth = () => {
  const dispatch = useDispatch();
  const {isauthenticated} = useSelector((state) => state.auth);

  const {authModalOpen, authMode} = useSelector((state) => state.ui);

  return (
    <>
      <div className="auth-container">
        {!isauthenticated ? (
          <>
            <button className="auth-btn signup" onClick={() => {
              dispatch(clearError());
              dispatch(openAuthModal("Signup"))
            }}>
              Signup
            </button>
            <button className="auth-btn login"
            onClick={ () => {
              dispatch(clearError());
              dispatch(openAuthModal("Login"))
            }}
            >Login</button>
          </>
        ) : (
          <button className="auth-btn logout" onClick={() => {
            dispatch(logout());
          }}>
            Logout
          </button>
        )}
      </div>
      {authModalOpen && (
        <Modal onClose={() => {
          dispatch(closeAuthModal());
          dispatch(clearError());
        }}>
          {authMode === "Signup" && <Signup />}
          {(authMode === "Login" || authMode === "forgot") && <Login />}
        </Modal>
      )}
    </>
  );
};

export default Auth;
