'use client'
import axios from "axios";
const API_URL = 'http://localhost:30001';
export const login = async (name, password)=>{
    const payload = {
        "username" : name,
        "password" : password,
    };
    try{
        const response  = await axios.post(API_URL+'/login', payload);
        return {success: true, data: response.data, message:"Ingreso Exitoso"};
    }catch(e){
        if(e.response){
            if(e.response.status === 401){
                return {success: false, message: "Usuario o contraseña incorrectos"};
            } else {
                return {success: false, message:"error del servidor: "+e.response.status};
            }
        }
        return {message:"Error de Servidor : "+e};
    }
}