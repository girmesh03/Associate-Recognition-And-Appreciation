import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest, setAuthToken } from "../../../api/apiRequest";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await makeRequest.post("/auth/login", credentials);
      const { accessToken, ...userData } = response.data;
      setAuthToken(accessToken);
      return userData.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await makeRequest.post("/auth/signup", credentials);
      const { accessToken, ...userData } = response.data;
      setAuthToken(accessToken);
      return userData.user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await makeRequest.post("/auth/logout");
      setAuthToken(null);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await makeRequest.post("/auth/refresh");
      const { accessToken } = response.data;
      setAuthToken(accessToken);
      return accessToken;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
