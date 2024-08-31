import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    makeRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete makeRequest.defaults.headers.common["Authorization"];
  }
};
