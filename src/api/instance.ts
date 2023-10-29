import axios from "axios";
import { API_URL } from "enviroment";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  // baseURL: "https://mini-app-b3d58c3edfe4.herokuapp.com/v1",
});
