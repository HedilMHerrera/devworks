import axios from "axios";
import { URL_API_ROOT } from "@/app/redirections";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: URL_API_ROOT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getProfile() {
  try {
    const response = await api.get("/api/user/me");
    return response.data;
  } catch (error){
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("No autorizado");
    }

    throw error;
  }
}
