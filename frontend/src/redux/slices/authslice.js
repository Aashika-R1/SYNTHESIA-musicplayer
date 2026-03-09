import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isauthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isauthenticated = true;
      state.isLoading = false;
      state.error = null;

      if (action.payload.token)
        localStorage.setItem("token", action.payload.token);
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isauthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    updateFavorites: (state, action) => {
      if (state.user) {
        state.user.favourites = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUser,
  setError,
  logout,
  setLoading,
  updateFavorites,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
