import axios from "axios";
import { API_URL } from "enviroment";

export const axiosInstance = axios.create({
  baseURL: API_URL,
});
