'use client';
import { Box } from '@mui/material'
import React, { useEffect, useState, Suspense } from 'react'
import { useSessionZ } from '../context/SessionContext'
import Loading from '../loading';
const Charging = ({children}) => {
  const hasHydrated = useSessionZ.persist?.hasHydrated();
  const [hydrated, setHydrated] = useState(null);
  useEffect(() => {
    setHydrated(hasHydrated)
  },[hasHydrated])
  return (hydrated===undefined || !hydrated ? 
    (<Box sx={{
      width:"100vh",
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
    }}>
        <Loading />
    </Box>):children)
}

export default Charging
