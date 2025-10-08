import React,{useState, useContext} from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SessionContext } from '../context/SessionContext';
import { MenuItem, Menu, IconButton, Drawer, Box, Typography } from '@mui/material';
import SnakeIcon from '../snakeicon/SnakeIcon';
import { useRouter } from 'next/navigation';
import { ArrowBack, VerifiedUserOutlined } from '@mui/icons-material';
import Person4Icon from '@mui/icons-material/Person4';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import HttpsIcon from '@mui/icons-material/Https';
const UserStudentMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { logoutSession } = useContext(SessionContext);
  const router = useRouter();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
    const handleLogOut = () => {
    handleClose();
    logoutSession();
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
            <Drawer
              anchor='left'
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root':{
                  width:'70%',
                  alignItems:"center",
                  fontSize:50
                },
                '& .MuiButtonBase-root':{
                  fontSize:30,
                },
                display:{
                  xs:'block',
                  sm:'none',
                  width:'60vh',
                }
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={3}
              ><MenuItem
                onClick={ handleClose }
              >
                  <ArrowBack sx={{height:55, width:55}}/>
                </MenuItem>
                <MenuItem sx={{gap:1}} onClick={() => { handleClose(); router.push('/') }}>
                          <SnakeIcon width={50} height={50}/>
                          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                              PyCraft
                          </Typography>
                          
                </MenuItem>
                
              </Box>
              <Box
                width="70%"
                height='100%'
                display="flex"
                flexDirection="column"
                mt={10}
                gap={3}
              >
                
                <MenuItem  onClick={handleClose}><Person4Icon/>Perfil</MenuItem>
                <hr />
                <MenuItem onClick={handleClose}><SettingsApplicationsIcon/>Configuración</MenuItem>
                 <hr />
                <MenuItem 
                  sx={{
                    color:'red',
                    borderRadius:2,
                  }}
                
                onClick={handleLogOut}><HttpsIcon/>Cerrar sesión</MenuItem>
              </Box>  
            </Drawer>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  left:-40,
                  display:{
                    xs:'none',
                    sm:'block',
                  },
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
                <MenuItem onClick={handleClose}><SettingsApplicationsIcon/>Configuración</MenuItem>
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
