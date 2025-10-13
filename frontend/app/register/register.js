'use client'
import axios from "axios";
const API_URL = 'http://localhost:30001';

export const checkEmail = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/check-email`, { params: { email } });
        return { success: true, message: response.data?.message || 'Email disponible' };
    } catch (e) {
        if (e.response) {
            if (e.response.status === 409) {
                return { success: false, message: 'El email ya esta registrado', code: 409 };
            } else if (e.response.status === 400) {
                return { success: false, message: 'Email inválido o faltante', code: 400 };
            } else {
                return { success: false, message: 'Error del servidor: ' + e.response.status, code: e.response.status };
            }
        }
        return { success: false, message: 'Error de Servidor : ' + e };
    }
};

export const checkUsername = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/check-username`, { params: { username } });
        return { success: true, message: response.data?.message || 'Usuario disponible' };
    } catch (e) {
        if (e.response) {
            if (e.response.status === 409) {
                return { success: false, message: 'El nombre de usuario ya existe', code: 409 };
            } else if (e.response.status === 400) {
                return { success: false, message: 'Nombre de usuario inválido o faltante', code: 400 };
            } else {
                return { success: false, message: 'Error del servidor: ' + e.response.status, code: e.response.status };
            }
        }
        return { success: false, message: 'Error de Servidor : ' + e };
    }
};

export const register = async (username, email, password) => {
    const payload = {
        username,
        email,
        password,
    };
    try {
        const response = await axios.post(API_URL + '/register', payload);
        return { success: true, data: response.data, message: "Registro Exitoso" };
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
