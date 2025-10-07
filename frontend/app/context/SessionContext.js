'use client';
import React, { createContext, useState } from 'react'
import { getSesion, logout, saveSesion } from '../login/sesion';
export const SessionContext = createContext();
export const useSession = () => {
  const { token, user} = getSesion();
  const [tokenUser, setToken] = useState(token);
  const [dataUser, setUser] = useState(user);
  const logoutSession = () => {
    logout();
    setToken(null);
    setUser(null);
  }
  const setSession = (token, user) => {
    setToken(token);
    setUser(user);
    saveSesion(token, user);
  }
 
  return {tokenUser, dataUser, setSession, logoutSession};
}

export const SessionProvider = ({ children }) => {
  const { tokenUser, dataUser, setSession, logoutSession } = useSession();
    return (
      <SessionContext.Provider value={{tokenUser, dataUser, setSession, logoutSession}}>
          {children}
      </SessionContext.Provider>
  )
}


