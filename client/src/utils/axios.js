import axios from "axios";
import { API_URl } from "../constants";

const instance = axios.create({
  baseURL: API_URl,
  withCredentials: true,
});

instance.interceptors.response.use((res) => res, (err) => {
  console.log("intrerceptor err", err);
  if (err.response.status === 401 && !window.location.href.includes("login")) {
    window?.location?.assign("/auth/login");
    return;
  }
  return err;
});

export default instance;
