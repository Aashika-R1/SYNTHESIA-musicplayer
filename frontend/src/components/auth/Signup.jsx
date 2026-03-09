import React from "react";
import Input from "../common/Input";
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uislice.js";
import {
  setUser,
  setLoading,
  setError,
  clearError,
} from "../../redux/slices/authslice.js";
import axios from "axios";
import "../../css/auth/Signup.css";

const Signup = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [previewImage, setPreviewImage] = React.useState("");
  const [base64Image, setBase64Image] = React.useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreviewImage(reader.result);
      setBase64Image(reader.result);
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (!fullName || !email || !password) {
      dispatch(setError("Please fill in all required fields."));
      return;
    }
    dispatch(setLoading(true));
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        {
          name: fullName,
          email,
          password,
          avatar: base64Image ? base64Image : undefined,
        },
      );
      const data = res.data || {};
      dispatch(
        setUser({
          user: data.user,
          token: data.token,
        }),
      );
      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
      console.log("Signup successful");
    } catch (error) {
      const serverMessage =
        error.response?.data?.message || error?.response?.data?.error;
      dispatch(setError(serverMessage || "Signup failed. Please try again."));
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="signup-wrapper">
      <h3 className="signup-title">Create an account</h3>
      <p className="signup-subtitle">Sign up to get started!</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div>
          <div className="profile-image-container">
            {previewImage ? (
              <img src={previewImage} alt="avatar" className="profile-image" />
            ) : (
              <div className="profile-placeholder">
                <CiUser size={40} />
              </div>
            )}
            <label className="image-upload-icon">
              📸
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>
          <Input
            label={"Name"}
            type={"text"}
            placeholder={"Enter Full Name"}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
          <Input
            label={"Email"}
            type={"email"}
            placeholder={"Enter Email"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            label={"Password"}
            type={"password"}
            placeholder={"Enter Password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <span
          className="forgot-link"
          onClick={() => {
            dispatch(clearError());
            dispatch(switchAuthMode("Login"));
          }}
        >
          Do you already have an account ?
        </span>

        {error && <div className="signup-error">{error}</div>}

        <div className="signup-actions">
          <button
            className="signup-btn-submit"
            type="submit"
            disabled={loading}
          >
            <span> {loading ? "Signing up..." : "Sign Up"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default Signup;
