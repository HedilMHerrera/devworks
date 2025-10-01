'use client'
import Image from "next/image";
import SvgIcon from "@mui/material";
import { Paper, Container, Typography, Box } from "@mui/material";
import SnakeIcon from "./snakeicon/SnakeIcon";
export default function Home() {
  return (
    <div>
      <Container
        component="main"
      >
        <Typography
          variant="h1"
          display="flex"
          justifyContent="start"
          alignItems="center"
          gap="5px"
        >
          <SnakeIcon width={100} height={100} color="primary.main"/>
          Titulo de la app
        </Typography>
        <Paper
          sx={{
            p:{
              xs:2, sm:3, md:5
            },
            fontSize:{
              xs:35, sm:30, md:25,
            },
            display:"flex"
          }}
        >
        <Box
          sx={{
            width:"80%"
          }}
        >
          <Typography
            variant="h2"
          >
            Paper de prueba
          </Typography>
          prueba de texto
        </Box>
        <Box
          sx={{
            width:"20%",
            display:"flex",
            flexDirection:"column",
            justifyContent:"end",
            gap:1,
          }}
        >
          <Box
            sx={{
              backgroundColor:"primary.main",
              color:"primary.contrastText",
              p:2,
              borderRadius:2,
              width:'fit-content',
              height: 'fit-content'
            }}
          >
            Etiqueta
          </Box>
          <Box
            sx={{
              backgroundColor:"primary.main",
              color:"primary.contrastText",
              p:2,
              borderRadius:2,
              width:'fit-content',
              height: 'fit-content'
            }}
          >
            Botón
          </Box>
        </Box>
        </Paper>
      </Container>
    </div>
  );
}
