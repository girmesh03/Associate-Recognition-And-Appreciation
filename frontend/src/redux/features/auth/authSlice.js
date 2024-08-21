import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: true,
  mode: localStorage.getItem("mode") || "light",
  currentUser: {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    role: "admin",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("mode", state.mode);
    },
  },
});

export const { toggleMode } = authSlice.actions;
export default authSlice.reducer;
