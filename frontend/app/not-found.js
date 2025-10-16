import { Typography, Box } from "@mui/material";
import React from "react";
import Image from "next/image";
import style from "./global.module.css";
const notFound = () => {
  return (
    <Box className={ style.centerPageColumn } mt={10}>
      <Typography variant='h4' color='background.contrastText'>
      PAGINA NO ENCONTRADA
      </Typography>
      <Image src="/notfound2.png" alt='' width={280} height={ 280 } />
    </Box>

  );
};

export default notFound;
