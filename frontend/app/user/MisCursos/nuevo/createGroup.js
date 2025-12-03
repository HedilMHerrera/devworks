"use client";
import axios from "axios";
import { URL_API_ROOT } from "@/app/redirections";

axios.defaults.withCredentials = true;

export const sendGroup =  async(payload) => {
  try {
    console.log(payload);
    const response  = await axios.post(URL_API_ROOT+"/api/groups/create", payload,{ withCredentials: true });
    return response.data;
  } catch (e){
    return { success: false, message:"Error de Servidor : "+e };
  }
};

