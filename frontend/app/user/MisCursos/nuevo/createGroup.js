"use client";
import axios from "axios";
const API_URL = "http://localhost:30001";

axios.defaults.withCredentials = true;

export const sendGroup =  async(payload) => {
  try {
    console.log(payload);
    const response  = await axios.post(API_URL+"/api/groups/create", payload,{ withCredentials: true });
    return response.data;
  } catch (e){
    return { success: false, message:"Error de Servidor : "+e };
  }
};

