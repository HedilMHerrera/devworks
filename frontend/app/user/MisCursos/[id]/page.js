"use client";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import TopicIcon from "@mui/icons-material/Topic";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, Button, Chip, IconButton, Paper, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { URL_API_ROOT } from "@/app/redirections";
import axios from "axios";
import { ArrowBackSharp } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import styles from "@/app/global.module.css";
import stylesNew from "../nuevo/new.module.css";

const Page = () => {
  const { id } = useParams();
  const [valueTab, setValueTab] = useState(0);
  const [classData, setClassData] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [code, setCode] = useState({ copied:false, code:"" });
  const [homeWorksData, setHomeWorksData] = useState([]);
  const router = useRouter();
  useEffect(() => {
    fetchClass();
  },[]);

  const fetchClass = async() => {
    const url = `${ URL_API_ROOT }/api/group/${ id }`;
    const response = await axios.get(url, { withCredentials:true });
    if (response.data.success){
      setCode({ code: response.data.code, copied:false });
      setClassData(response.data);
    }
  };
  const handleCopied = async() => {
    await navigator.clipboard.writeText(code.code);
    setCode({ ...code, copied: !code.copied });
  };

  if (!classData){
    return null;
  }

  return (
    <Box width="90%" mt={2}>
      <Button onClick={ () => router.back() }>
        <ArrowBackSharp />
        Volver
      </Button>
      <Box display="flex" justifyContent="center">
        <Paper
          sx={{
            width:"fit-content",
            display:"flex",
            flexDirection:"column",
            gap:"20px",
            padding:"20px",
            mt:3,
          }}
        >
          <Typography variant="h4">
            { classData.title }
          </Typography>
          <Box
            sx={{
              display:"grid",
              gap:"10px",
              gridTemplateColumns:{ xs:"1fr", md:"1fr 1fr", sm:"1fr" },
            }}
          >
            <Box display="flex" flexDirection="column" gap="20px">
              <Box>
                <Box gap="10px" display="flex">
                  { !classData.stillValid && <Chip
                    label="Vencido"
                    color="secondary"
                    size="small" />}
                  { classData.stillValid && <Chip
                    label="Vigente"
                    color="success"
                    size="small" />}
                  { classData.running && <Chip
                    label="Activo"
                    color="primary"
                    size="small"/>}
                  { classData.dropped && <Chip label="Archivado"
                    color="warning"
                    size="small"/>}
                </Box>
              </Box>
              <Typography variant="body1">
                { classData.description }
              </Typography>
              <Box display="flex" flexDirection="column" gap="10px">
                <Box display="flex" alignItems="center">
                  Fecha de Creación :
                  <Typography>
                    { new Date(classData.createdAt).toLocaleString() }
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  Fecha de Inicio :
                  <Typography variant="body1">
                    { new Date(classData.startDate).toLocaleString() }
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  Fecha de fin :
                  <Typography variant="body1">
                    { new Date(classData.endDate).toLocaleString() }
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className={ `${styles.centerPageColumn} ${ stylesNew.paperNew }` }
              sx={{
                minWidth:{  md:"300px", sm:"200px", xs:"" },
              }}>
              <Typography variant="h6">
                Código de inscripción
              </Typography>
              <Box className={ styles.centerPageRow }
                gap={ 3 }
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  border:"2px dashed",
                  padding:"10px",
                }}
              >
                <Typography color="background.contrastText" variant="h3">{ code.code }</Typography>
                <Tooltip title={ code.copied ? "Copiado":"Copiar" }>
                  <IconButton size="medium" onClick={ handleCopied }>
                    { code.copied ? <CheckIcon color="success"/>: <ContentCopyIcon color="primary" /> }
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box display="flex" width="80%" justifyContent="start">
        <Tabs
          value={valueTab}
          onChange={(event, newOption) => setValueTab(newOption)}
          aria-label="basic tabs example"
          sx={{
            "& :not(.Mui-selected)":{
              color:"background.contrastText",
            },
          }}
        >
          <Tab label="Topicos" icon={ <TopicIcon />} iconPosition="start"/>
          <Tab label="Tareas" icon={ <BorderColorIcon />} iconPosition="start"/>
          <Tab label="Estudiantes" icon={ <SchoolIcon />} iconPosition="start"/>
        </Tabs>
      </Box>
      <Box mt={3} display={ valueTab!==0 && "none" }><Typography>Topicos</Typography></Box>
      <Box mt={3} display={ valueTab!==1 && "none" }><Typography>Tareas</Typography></Box>
      <Box mt={3} display={ valueTab!==2 && "none" }><Typography>Estudiantes</Typography></Box>
    </Box>
  );
};

export default Page;
