import axios from "axios";
import { store, persistor } from "../redux/app/store";
import { toast } from "react-toastify";
import { logout } from "../redux/features/auth/authActions";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

export const makeRequest = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

makeRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    // Handle network error
    if (error?.code === "ERR_NETWORK") {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    // Refresh token expired
    if (error?.response?.status === 401 && !originalRequest?._retry) {
      try {
        originalRequest._retry = true;
        await makeRequest.get("/auth/refresh", {
          withCredentials: true,
        });
        return makeRequest(originalRequest);
      } catch (error) {
        store.dispatch(logout());
        await persistor.purge();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
