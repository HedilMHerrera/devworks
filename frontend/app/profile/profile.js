import axios from "axios";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: "http://localhost:30001",
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
