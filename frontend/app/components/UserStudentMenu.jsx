'use client';
import React,{useState, useContext} from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SessionContext } from '../context/SessionContext';
import { MenuItem, Menu, IconButton, Drawer, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Person4Icon from '@mui/icons-material/Person4';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import HttpsIcon from '@mui/icons-material/Https';
import { useSessionZ } from '../context/SessionContext';
const UserStudentMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const logoutSession = useSessionZ((state) => state.logout)
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    handleClose();
    logoutSession();
    router.push('/login');
  }
  return (
    <React.StrictMode>
           <IconButton
                size="large"
                edge="start"
                color="primary"
                sx={{ 
                  mr: 2, 
                  height:40,

                }}
                onClick={handleMenu}
                
            >
                <AccountCircleIcon sx={{
                  width:50,
                  height:50
                }}/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  left:-40,
                  '& .MuiList-root':{
                    bgcolor:'secondary.main',
                    color:'secondary.contrastText',
                    display:"flex",
                    flexDirection:"column",
                    gap:0.8,
                  },
                  '& .MuiButtonBase-root':{
                    gap:1,
                  }
                }}
            >
                <MenuItem  onClick={handleClose}><Person4Icon/>Perfil</MenuItem>
                <hr />
                <MenuItem  onClick={ () => { handleClose(); router.push("/user") } }><BusinessCenterIcon/>Cuenta</MenuItem>
                <hr />
                <MenuItem 
                  sx={{
                    color:'red',
                    borderRadius:2,
                  }}
                
                onClick={handleLogOut}><HttpsIcon/>Cerrar sesión</MenuItem>
            </Menu>
    </React.StrictMode>
  )
}

export default UserStudentMenu
