'use client';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import SnakeIcon from '../snakeicon/SnakeIcon';
import { useRouter } from 'next/navigation';
import style from './menu.module.css';
import UserStudentMenu from './UserStudentMenu';
import { useSessionZ } from '../context/SessionContext';
export const MenuCustom = () => {
  const router = useRouter();
  const user = useSessionZ((state) => state.user );
  
  return (
    <Box>
      <AppBar position="fixed" color="background">
        <Toolbar sx={{

            justifyContent: "space-between",
            alignItems:"center",
            gap:0
        }}>
        <MenuItem sx={{
          gap:1,
          display:{
            xs:'none',
            sm:'flex'
          }
        }} onClick={() => { router.push('/') }}>
            <SnakeIcon width={30} height={30}/>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                PyCraft
            </Typography>
        </MenuItem>
          <Box
          display="flex"
          justifyContent="space-between"
          flexDirection="row"
          alignItems='center'
          alignSelf='center'
          width={{
            sm:'fit-content',
            xs:"100%"
          }}
          gap={3}
        >
            <Button 
              className={`${style['shrink-border']}`} 
              color="secondary.contrastText"
              onClick={() => { router.push('/') }}
            >Inicio</Button>
            <Button className={`${style['shrink-border']}`} color="secondary.contrastText">Información</Button>
            {(!user) && 
        (<Button 
              className={`${style['shrink-border']}`} 
              onClick={() => {router.push('/login')}}
              sx={{
                bgcolor:"primary.main",
                color:"primary.contrastText",
                '&:hover':{
                  color:"primary.main",
                  bgcolor:"transparent",
                }
              }}
              >Login</Button>
            )}
          {(user) && (<UserStudentMenu />)}

        </Box>
        
        </Toolbar>
      </AppBar>
    </Box>
  );
}
