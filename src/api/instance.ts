import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: "http://localhost:4000/v1",
});
