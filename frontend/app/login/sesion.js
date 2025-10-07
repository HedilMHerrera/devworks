import Cookies from "js-cookie";
const NAME_COOKIE = 'fulldata';
export const saveSesion = (token, user)=>{
    Cookies.set(NAME_COOKIE, JSON.stringify({ token, user }),{expires:60});
}

export const getSesion = () => {
    const data = Cookies.get(NAME_COOKIE);
    if(data){
        return JSON.parse(data);
    } else {
        return { user:null, token:null };
    }
}

export const logout = () => {
    Cookies.remove(NAME_COOKIE);
}