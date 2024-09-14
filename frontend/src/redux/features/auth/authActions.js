import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from "../../../api/apiRequest";

export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await makeRequest.post("/auth/signup", credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await makeRequest.post("/auth/login", credentials, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await makeRequest.delete("/auth/logout", {
        withCredentials: true,
      });
      return;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
