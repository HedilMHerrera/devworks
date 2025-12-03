"use client";
import axios from "axios";
import { URL_API_ROOT } from "@/app/redirections";

axios.defaults.withCredentials = true;

export const checkEmail = async(email) => {
  try {
    const response = await axios.get(`${ URL_API_ROOT }/check-email`, { params: { email } });
    return { success: true, message: response.data?.message || "Email disponible" };
  } catch (e) {
    if (e.response) {
      if (e.response.status === 409) {
        return { success: false, message: "El email ya esta registrado", code: 409 };
      } else if (e.response.status === 400) {
        return { success: false, message: "Email inválido o faltante", code: 400 };
      } else {
        return { success: false, message: "Error del servidor: " + e.response.status, code: e.response.status };
      }
    }
    return { success: false, message: "Error de Servidor : " + e };
  }
};

export const register = async(email) => {
  const payload = {
    email,
  };
  try {
    const response = await axios.post(URL_API_ROOT + "/register", payload, { withCredentials: true });
    return { success: true, data: response.data, message: response.data.message };
  } catch (e) {
    if (e.response) {
      if (e.response.status === 409) {
        return { success: false, message: e.response.data?.message || "El usuario o email ya existe", code: 409 };
      } else if (e.response.status === 400) {
        return { success: false, message: "Campos requeridos faltantes", code: 400 };
      } else {
        return { success: false, message: "error del servidor: " + e.response.status, code: e.response.status };
      }
    }
    return { success: false, message: "Error de Servidor : " + e };
  }
};

export const verifyEmail = async(name, lastName, email, password, code, originalCode) => {
  try {
    const payload = {
      name,
      lastName,
      email,
      password,
      code,
      originalCode,
    };
    const response = await axios.post(`${ URL_API_ROOT }/verify-email`, payload, { withCredentials: true });
    return { success: true, message: response.data?.message, data: response.data };
  } catch (e) {
    if (e.response) {
      return { success: false, message: e.response.data?.message || "Error al verificar el email", code: e.response.status };
    }
    return { success: false, message: "Error de conexión con el servidor." };
  }
};

export const checkVerificationStatus = async(email) => {
  try {
    const response = await axios.get(`${ URL_API_ROOT }/check-verification-status`, { params: { email } });
    return { success: true, isVerified: response.data.isVerified };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Polling error:", e.message);
    return { success: false, isVerified: false };
  }
};
