"use client";
import { Box, Container, Paper, Typography, Link } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SnakeIcon from "../snakeicon/SnakeIcon";
import Input from "../components/Input";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import ButtonCustom from "../components/Button";
//import GoogleIcon from "@mui/icons-material/Google";
import { ArrowForward } from "@mui/icons-material";
import { login, loginGoogle } from "./login";
import { useSnackbar } from "notistack";
import { useSessionZ } from "../context/SessionContext";
import { GoogleLogin } from "@react-oauth/google";

const Page = () => {
  const [emailText, setEmailText] = useState("");
  const [passText, setPassText] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useSessionZ((state) => state.setSession );
  const router = useRouter();

  const handleResetMessageError = () => {
    setEmailError("");
    setPassError("");
  };

  const googleLogin = async(token) => {
    const { message, success, ...more } = await loginGoogle(token);
    if (success){
      const { data:{ token, user } } = more;
      enqueueSnackbar(`Bienvenido "${user.username}"`,{ variant:"success" });
      setSession(token, user);
      router.push("/user");
    } else {
      enqueueSnackbar(message, { variant:"error" });
    }
  };

  const handleLoginPayload = async() => {
    setIsLoading(true);
    const user = emailText.trim();
    const password = passText.trim();
    let isValidFields = true;
    handleResetMessageError();
    if (user.length === 0){
      setEmailError("Debe ingresar el nombre de usuario o email");
      isValidFields = false;
    }
    if (password.length === 0){
      setPassError("debe ingresar la contraseña");
      isValidFields = false;
    }
    if (isValidFields){
      const { message, success, ...more } = await login(user, password);
      if (success){
        const { data:{ token, user } } = more;
        enqueueSnackbar(`Bienvenido "${user.username}"`,{ variant:"success" });
        setSession(token, user);
        router.push("/user");
      } else {
        enqueueSnackbar(message, { variant:"error" });
      }
    }
    setIsLoading(false);
  };
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
            xs:2, sm:3, md:5,
          },
          fontSize:{
            xs:32, sm:30, md:27,
          },
          gap:3,
          display:"flex",
          flexDirection:"column",
          position:"relative",
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
        <Input
          error={ emailError }
          label="Email"
          Icon={EmailIcon}
          value={emailText}
          setValue={setEmailText}
          setError= { setEmailError }/>
        <Input
          error={ passError }
          setError={ setPassError }
          label="Contrasenia"
          Icon={KeyIcon}
          value={passText}
          setValue={setPassText}
          type="pass"
        />

        <ButtonCustom
          onClick={ handleLoginPayload }
          type="primary"
          sx={{
            width:"100%",
          }}
          disabled = { isLoading }
        >
                Iniciar Sesión
        </ButtonCustom>

        <Box
          sx={{
            display:"flex",
            alignItems:"center",
          }}
        >
          <Box component="hr" sx={{ flexGrow:1, borderColor:"secondary.main" }}/>
          <Typography
            sx={{
              fontSize:13,
              color:"background.contrastText",
            }}
          >
                También
          </Typography>
          <Box component="hr" sx={{ flexGrow:1, borderColor:"secondary.main" }}/>
        </Box>
        <GoogleLogin onSuccess={ credentialResponse => {
          const token = credentialResponse.credential;
          googleLogin(token);
        } } />
        {/*<ButtonCustom
        >
            <GoogleIcon />
            <Box>Iniciar con Google</Box>
        </ButtonCustom>*/}
        <Typography sx={{ display:"flex", gap:1 }}>
            ¿Aún no tienes Cuenta?   <Link sx={{ display:"flex", alignItems:"center" }} href=""  >Registrate Ahora <ArrowForward /></Link>
        </Typography>
        <Typography>
          <Link href="" >¿Olvidaste Tu Cuenta?</Link>
        </Typography>
      </Paper>
    </Container>

  );
};

export default Page;
