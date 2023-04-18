import axios from "axios";
import { API_URl } from "../constants";

const instance = axios.create({
  baseURL: API_URl,
  withCredentials: true,
});

export default instance;
