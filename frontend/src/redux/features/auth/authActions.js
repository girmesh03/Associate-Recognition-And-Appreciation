import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicRequest } from "../../../api/apiRequest";
import { setAccessToken } from "./authSlice";

export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await publicRequest.post("/auth/signup", credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      dispatch(setAccessToken(response.data.accessToken));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await publicRequest.post("/auth/login", credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      dispatch(setAccessToken(response.data.accessToken));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await publicRequest.delete("/auth/logout", {
        withCredentials: true,
      });
      return;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await publicRequest.get("/auth/refresh", {
        withCredentials: true,
      });
      dispatch(setAccessToken(response.data.accessToken));
      return response.data.accessToken;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
