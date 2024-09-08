import axios from "axios";
import { store, persistor } from "../redux/app/store";
import { logout, refreshAccessToken } from "../redux/features/auth/authActions";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

export const publicRequest = axios.create({
  baseURL: `${BASE_URL}/api`,
});

const makeRequest = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

export const privateRequest = async (url, options = {}) => {
  const { method = "GET", data = null, headers = {} } = options;

  if (!headers["Authorization"]) {
    const accessToken = store.getState().auth?.accessToken;
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    return await makeRequest({
      url,
      method,
      data,
      headers,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await store
          .dispatch(refreshAccessToken())
          .unwrap();

        headers["Authorization"] = `Bearer ${newAccessToken}`;
        return await makeRequest({ url, method, data, headers });
      } catch {
        store.dispatch(logout());
        persistor.purge();
      }
    } else {
      console.error("API request error:", error);
    }
    throw error; // Re-throw other errors
  }
};
