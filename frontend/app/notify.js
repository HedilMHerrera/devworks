'use client';
import React from 'react'
import { SnackbarProvider } from 'notistack';
const Notify = ({children}) => {
  return (
    <SnackbarProvider autoHideDuration={4000}>
      {children}
    </SnackbarProvider>
  )
}

export default Notify
