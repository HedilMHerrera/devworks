"use client";
import axios from "axios";
const API_URL = "http://localhost:30001";

axios.defaults.withCredentials = true;

export const loginGoogle = async(token) => {
  const payload = { token };
  try {
    const response = await axios.post(`${API_URL}/logingoogle`, payload, { withCredentials: true });
    return { success: true, data: response.data, message: "Ingreso Exitoso" };
  } catch (e) {
    if (e.response) {
      if (e.response.status === 401) {
        return { success: false, message: e.response.data?.message || "Token de Google inválido" };
      }
    }
    return { success: false, message: "Error de Servidor: " + e.message };
  }
};

const loginStructure =  async(payload, url) => {
  try {
    const response  = await axios.post(API_URL+url, payload,{ withCredentials: true });
    return { success: true, data: response.data, message:"Ingreso Exitoso" };
  } catch (e){
    if (e.response){
      if (e.response.status === 401){
        return { success: false, message: "Usuario o contraseña incorrectos" };
      }
    }
    return { success: false, message:"Error de Servidor : "+e };
  }
};

export const login = async(email, password)=>{
  const payload = {
    "email" : email,
    "password" : password,
  };
  const url = "/login";
  return await loginStructure(payload, url);
};
