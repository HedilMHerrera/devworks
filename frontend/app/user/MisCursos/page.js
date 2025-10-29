"use client";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import ButtonCustom from "@/app/components/Button";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
const set = [
  {
    id:1,
    title:"nuevo titulo",
    description:"descripción",
  },{
    id:2,
    title:"nuevo titulo",
    description:"descripción",
  },{
    id:3,
    title:"nuevo titulo",
    description:"descripción",
  },{
    id:4,
    title:"nuevo titulo",
    description:"descripción",
  },{
    id:5,
    title:"nuevo titulo",
    description:"descripción",
  },
];

const Page = () => {
  const router = useRouter();
  return (
    <Box
      width="90%"
      p={1}
      height="200px"
      mt={5}
    >
      <Box
        sx={{
          display:"flex",
          justifyContent:"space-between",
        }}
      >
        <Typography
          variant="h4"
        >
          Mis Cursos
        </Typography>
        <ButtonCustom  type="primary" sx={{
          "&.MuiButton-root":{
            height:"40px",
            fontWeight:900,
          },
        }}
        onClick={ () => router.push("/user/MisCursos/nuevo") }
        >
          <AddIcon/> Crear Curso
        </ButtonCustom>
      </Box>
      <Paper>
        Aca vienen los datos
      </Paper>
    </Box>
  );
};
export default Page;
