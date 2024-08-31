import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../redux/app/store";
import { logout, refreshToken } from "../redux/features/auth/authActions";
import { makeRequest, setAuthToken } from "../api/apiRequest";

export const useAxiosMakeRequest = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = makeRequest.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    const responseInterceptor = makeRequest.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response.status === 403 &&
          !originalRequest._retry &&
          error.response.data?.message === "TokenExpired"
        ) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await store
              .dispatch(refreshToken())
              .unwrap();
            setAuthToken(newAccessToken);
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return makeRequest(originalRequest);
          } catch (refreshError) {
            store.dispatch(logout());
            navigate("/login");
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      makeRequest.interceptors.request.eject(requestInterceptor);
      makeRequest.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);
};
