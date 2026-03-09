import React, { useState } from "react";
import Input from "../common/Input.jsx";
import { useSelector } from "react-redux";
import validator from "validator";
import {
  clearError,
  setError,
  setLoading,
} from "../../redux/slices/authslice.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authslice.js";
import { closeAuthModal,switchAuthMode } from "../../redux/slices/uislice.js";
import "../../css/auth/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { authMode } = useSelector((state) => state.ui);
  const isForgot = authMode === "forgot";
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validator.isEmail(email)) {
      dispatch(setError("Please enter a valid email address"));
      return;
    }
    if (!password) {
      dispatch(setError("Password is required"));
      return;
    }
    dispatch(setLoading(true));
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        },
      );

      const data = res.data || {};
      dispatch(setUser({ user: res.data.user, token: res.data.token }));
      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
      console.log("Login successful");
    } catch (err) {
      const serverMessage =
        err.response?.data?.message || err?.response?.data?.err;
      dispatch(setError(serverMessage || "Something went wrong"));
    }finally{
      dispatch(setLoading(false));
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotMsg("Please enter your email");
      return;
    }

    try {
      setForgotMsg("sending reset link..");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
        {
          email: forgotEmail,
        },
      );
      setForgotMsg("reset link sent! Check your email");
    } catch (error) {
      setForgotMsg(
        error?.response?.data?.message || "Failed to send the reset email",
      );
    }
  };

  return (
    <div className="login-wrapper">
      <h3 className="login-title">welcome Back</h3>
      <p className="login-subtitle">please enter user details to login</p>

      <form className="login-form" onSubmit={handleLogin}>
        
          {!isForgot && (
            <>
              <Input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                label={"Email Address"}
                placeholder={"Enter your email"}
                type="email"
              />
              <Input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                label="Password"
                placeholder={"Min 8 characters"}
                type="password"
              />
            </>
          )}
        
          <div className="forgot-wrapper">
            {!isForgot?(
            <>
              <span
                className="forgot-link"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(switchAuthMode("forgot"));
                }}
              >
                Forgot Password?
              </span>
              <span
                className="forgot-link"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(switchAuthMode("Signup"));
                }}
              >
                Don't have an account ? Sign up
              </span>
            </>
            ):(
            <div className="forgot-box">
              <Input
                label={"Email"}
                type={"email"}
                placeholder={"Enter your registered email"}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              {forgotMsg && <p className="forgot-msg">{forgotMsg}</p>}
              <button
                type="button"
                className="forgot-btn"
                onClick={handleForgotPassword}
              >
                Send the reset link
              </button>
            </div>
            )}
          </div>
          {error && <div className="login-error">{error}</div>}
          {!isForgot && (
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading}
            >
              <span>{isLoading ? "Logging in...." : "Login"}</span>
            </button>
          )}
        
      </form>
    </div>
  );
};

export default Login;
