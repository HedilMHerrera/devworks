'use client';
import { Box, Container, Paper, Typography, Link } from '@mui/material'
import React, { useState } from 'react'
import SnakeIcon from '../snakeicon/SnakeIcon'
import Input from '../components/Input'
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import ButtonCustom from '../components/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { ArrowForward } from '@mui/icons-material';
const page = () => {
    const [emailText, setEmailText] = useState("");
    const [passText, setPassText] = useState("");
  return (
  <Container
    sx={{
        display:"flex",
        flexDirection:"column",
        gap:3,
        justifySelf:"center",
        alignSelf:"center",
    }}
    maxWidth="sm"
  >
    <Box
        sx={{
            display:"flex",
            gap:2,
            alignItems:"center",
        }}
    >
        <SnakeIcon width={40} height={40}/>
        <Typography
            variant='h4'
        >
            PyCraft
        </Typography>
    </Box>
    <Paper
        sx={{
            p:{
                xs:2, sm:3, md:5
            },
            fontSize:{
                xs:32, sm:30, md:27,
            },
            gap:3,
            display:"flex",
            flexDirection:"column",
        }}
      >
        <Typography
            variant='h5'
            sx={{
                fontWeight:400, 
            }}
        >
            Inicia Sesión en PyCraft
        </Typography>
        <Input label="Email" Icon={EmailIcon} value={emailText} setValue={setEmailText}  />
        <Input label="Contrasenia" Icon={KeyIcon} value={passText} setValue={setPassText}  type="pass"/>
        <ButtonCustom type="primary">
            Iniciar Sesión
        </ButtonCustom>
        <Box
            sx={{
                display:"flex",
                alignItems:"center",
            }}
        >
            <Box component="hr" sx={{flexGrow:1, borderColor:"secondary.main"}}/>
            <Typography
                sx={{
                    fontSize:13,
                    color:"background.contrastText",
                }}
            >
                También
            </Typography>
            <Box component="hr" sx={{flexGrow:1, borderColor:"secondary.main"}}/>
        </Box>
        <ButtonCustom
        >
            <GoogleIcon />
            <Box>Iniciar con Google</Box>
        </ButtonCustom>
        <Typography sx={{display:"flex", gap:1}}>
            ¿Aún no tienes Cuenta?   <Link sx={{display:"flex", alignItems:"center"}} href=""  >Registrate Ahora <ArrowForward /></Link>
        </Typography>
        <Typography>
            <Link href="" >¿Olvidaste Tu Cuenta?</Link>
        </Typography>
      </Paper>
  </Container>
      
  )
}

export default page
