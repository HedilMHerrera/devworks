import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:30001',
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function getPerfil(id) {
    try{
        const response = await api.get(`/api/user/${id}`);
        return response.data;
    } catch(error){
        console.log("Error al obtener asuario: ", error.message);
        
    }
}