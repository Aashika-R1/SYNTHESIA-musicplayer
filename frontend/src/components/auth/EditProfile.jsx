import React,{useState,useEffect} from "react";
import { useDispatch ,useSelector} from "react-redux";
import { clearError, setError, setLoading,setUser } from "../../redux/slices/authslice.js";
import axios from "axios";
import Input from "../common/Input.jsx"
import "../../css/auth/EditProfile.css";
import { CiUser } from "react-icons/ci";
const EditProfile = ( { onClose }) => {
    const dispatch = useDispatch();
    const { user, token, isLoading, error } = useSelector((state) => state.auth);

     const [name, setName ] = useState(user?.name || "");
     const [email, setEmail ] = useState(user?.email || "");

     const [currentPassword ,setCurrentPassword ] = useState("");
     const [newPassword, setNewPassword ] = useState("");
     const [showPasswordFields, setShowPasswordFields ] = useState(false);

     const [previewImage, setPreviewImage ] = useState(user?.avatar || "");
     const [base64Image, setBase64Image ] = useState("");

     useEffect(() =>{
        if(user){
            setName(user.name || "");
            setEmail(user.email || "");
            setPreviewImage(user.avatar || "");
        }
},[user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend =() => {
            setPreviewImage(reader.result);
            setBase64Image(reader.result);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        const payload = {};

        if (name && name !== user.name) payload.name = name;
        if (email && email !== user.email) payload.email = email;
        if (base64Image) payload.avatar = base64Image;

        if (showPasswordFields) {
            if (!currentPassword || !newPassword) {
                dispatch(setError("To change password , both fields are required"));
                return;
            }
            payload.currentPassword = currentPassword;
            payload.newPassword = newPassword;
        }
        if (Object.keys(payload).length === 0) {
            dispatch(setError("please update atleast one field"));
            return;
        }

        dispatch(setLoading(true));
        const storedToken = token || localStorage.getItem("token");

        try {
            const response = await axios.patch (
                `${import.meta.env.VITE_BASE_URL}/api/auth/profile`,
                payload, {
                    headers : {
                        Authorization: `Bearer ${storedToken}`,
                    },
                },
            );

        const data = response.data || {};
        dispatch(
            setUser({
                user: data.user,
                token: token || localStorage.getItem("token"),
            }),
        );

        if (onClose) {
            dispatch(clearError());
            onClose();
        }
        console.log("Profile Updated");
        } catch (error) {
            let serverMessage = 
            error?.response?.data?.message || error?.response?.data?.error;
            dispatch(
                setError(serverMessage || "profile update failed please try again"),
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="editprofile-wrapper">
            <h3 className="editprofile-title">Edit Profile</h3>
            <p>Update your account Details</p>

            <form className="editprofile-form" onSubmit ={handleSubmit}>
                {!showPasswordFields && (
                    <>
                    <div className="profile-image-container">
                        {previewImage ? (
                            <img 
                            src={previewImage}
                            alt="profile"
                            className="profile-image"
                            />
                        ) : (
                            <div className="profile-placeholder">
                                <CiUser size={40}/>
                                </div>
                        )}
                        <label className="image-upload-icon" >
                            📸
                            <input 
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}></input>
                        </label>
                    </div>
                    <Input
                    label ={"Name"}
                    type ={"text"}
                    placeholder = {"update your name"}
                    value = {name}
                    onChange={(e) => setName(e.target.value)}
                    />
                     <Input
                    label ={"Email"}
                    type ={"email"}
                    placeholder = {"update your Email"}
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    </>
                )}
                {
                    showPasswordFields && (
                        <>
                        <Input 
                        label={"Current Password"}
                        type={"password"}
                        placeholder={"Enter Current Password"}
                        value ={currentPassword}
                        onChange={(e)=> setCurrentPassword(e.target.value)}
                        />
                        <Input 
                        label={"new Password"}
                        type={"password"}
                        placeholder={"Enter New Password"}
                        value ={newPassword}
                        onChange={(e)=> setNewPassword(e.target.value)}
                        />
                        </>
                    )}
                     {error && <div className="editprofile-error">{error}</div>}
                     <button
                     type="button"
                     className="editprofile-password-toggle"
                     onClick={ () => setShowPasswordFields(!showPasswordFields)}
                     >
                        {showPasswordFields ? "cancel password change" : "change password"}
                     </button>
                     <div className="editprofile-actions">
                        <button 
                        type="button"
                        className="editprofile-btn-cancel"
                        onClick={onClose}
                        disabled={isLoading}
                        >
                            cancel
                        </button>
                        <button type="submit" className="editprofile-btn-submit">
                            <span>{isLoading ? "saving...": "save changes"}</span>
                        </button>

                     </div>

            </form>
        </div>
    );
};

export default EditProfile;