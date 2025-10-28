"use client";
import React, { useState } from "react";
import { Box, List, ListItem, Paper, Typography } from "@mui/material";
import ButtonCustom from "@/app/components/Button";
import Input from "@/app/components/Input";
import CodeIcon from "@mui/icons-material/Code";
import styles from "@/app/global.module.css";

const Register = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  return (
    <Box className={ styles.centerPageRow }
      width="100%"
      height="80vh"
      flexDirection="column"
      justifyContent="start"
      mt="50px"
      sx={{
        gap:{ sm:"10px", xs:"25px", md:"50px" },
      }}
    >
      <Paper
        sx={{
          p:3,
        }}
      >
        <List component="ul">
          <ListItem component="li">
            - No estás registrado en un grupo.
          </ListItem>
          <ListItem>
            - Para registrarse ingresa el código de tu clase.
          </ListItem>
          <ListItem>
            - En caso de no tener un código, habla con tu profesor o tutor a cargo.
          </ListItem>
        </List>
      </Paper>
      <Box className={ styles.centerPageRow }
        sx={{
          alignItems:"end",
        }}>
        <Input
          label="Ingresa tu codigo"
          Icon={ CodeIcon }
          value={ value }
          setValue={ setValue }
          error={ error }
          setError={ setError }
          sx={
            {
              "& .MuiInputBase-input":{
                height:"30px !important",
              },
              "& .MuiInputBase-root":{
                borderRadius:"4px 0px 0px 4px",
              },
            }
          }/>
        <ButtonCustom type="primary"
          sx={{
            height:"53px",
            borderRadius:"0px 4px 4px 0px",
          }}
        >
          Registrarse
        </ButtonCustom>
      </Box>
    </Box>
  );
};

export default Register;
