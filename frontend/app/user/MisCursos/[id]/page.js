"use client";
import SchoolIcon from "@mui/icons-material/School";
import TopicIcon from "@mui/icons-material/Topic";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box, Button, Chip, IconButton, Paper, Tab, Tabs, Tooltip, Typography, TextField } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { URL_API_ROOT } from "@/app/redirections";
import axios from "axios";
import { ArrowBackSharp } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import styles from "@/app/global.module.css";
import { enqueueSnackbar } from "notistack";
import AcordionData from "./components/AcordionData";
import TopicGroupModal from "./components/TopicConfig";
import SettingsIcon from "@mui/icons-material/Settings";
const Page = () => {
  const { id } = useParams();
  const [valueTab, setValueTab] = useState(0);
  const [classData, setClassData] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [topics, setTopics] = useState([]);
  const [code, setCode] = useState({ copied:false, code:"" });
  const [homeWorksData, setHomeWorksData] = useState([]);
  const [switchEditor, setSwitchEditor] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchClass();
    fetchTopics();
  },[]);

  const fetchTopics = async() => {
    const url = `${ URL_API_ROOT }/api/grouptopics/${ id }/topics`;
    try {
      const response = await axios.get(url, { withCredentials:true });
      setTopics(response.data);
    } catch {
      enqueueSnackbar("error interno del servidor", { variant:"error" });
    }
  };

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
      <Box display="flex" justifyContent="start">
        <Box
          sx={{
            width:"fit-content",
            display:"flex",
            flexDirection:"column",
            gap:"20px",
            padding:"20px",
            mt:3,
            maxWidth:"900px",
            color:"secondary.contrastText",
          }}
        >
          <Box>
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
              <Box display="flex"
                sx={{
                  display:"grid",
                  gap:"10px",
                  gridTemplateColumns:{ xs:"1fr", md:"2fr 1fr", sm:"1fr" },
                }}>
                <Box display="flex" flexDirection="column" gap="20px">
                  <Typography variant="h3">
                    { classData.title }
                  </Typography>
                  <Typography variant="body1">
                    { classData.description }
                  </Typography>
                </Box>
                <Paper className={ `${styles.centerPageColumn}` }
                  sx={{
                    minWidth:{  md:"300px", sm:"200px", xs:"" },
                    padding:"15px",
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
                </Paper>
              </Box>
              <Box display="flex" gap="30px" flexWrap="wrap" color="background.contrastText">
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
          </Box>
        </Box>
      </Box>
      <Box component="hr" mt={2} mb={2} borderColor="background.contrastText"/>
      <Box display="flex" width="80%" justifyContent="start">
        <Tabs
          value={valueTab}
          onChange={(event, newOption) => setValueTab(newOption)}
          aria-label="basic tabs example"
          sx={{
            "& :not(.Mui-selected)":{
              color:"background.contrastText",
            },
            "&.MuiTabs-root":{
              overflow:"visible",
            },
          }}
        >
          <Tab label="Topicos" icon={ <TopicIcon />} iconPosition="start"/>
          <Tab label="Tareas" icon={ <BorderColorIcon />} iconPosition="start"/>
          <Tab label="Estudiantes" icon={ <SchoolIcon />} iconPosition="start"/>
        </Tabs>
      </Box>
      <Box mt={3} display={ valueTab!==0 && "none" }>
        <Box sx={{ p: 3, width: "90%" }}>
          <Box flexDirection="column" sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Typography variant="h6" sx={{ color: "background.contrastText", mb: 2 }}>
                Programas del curso
              </Typography>
              <Button variant="outlined" onClick={ () => setOpenModal(true) }>
                <SettingsIcon />
                Configuración
              </Button>
            </Box>
            { topics.map((data) => <AcordionData
              key={`${ data.id }topicData`}
              title={ data.title }
              description={ data.description }
              startDate={ data.startDate }
              content={ data.content }/>) }
          </Box>
        </Box></Box>
      <Box mt={3} display={ valueTab!==1 && "none" }><Typography>Tareas</Typography></Box>
      <Box mt={3} display={ valueTab!==2 && "none" }><Typography>Estudiantes</Typography></Box>
      <TopicGroupModal
        open={ openModal }
        setOpen={ setOpenModal }
        topicsAdded={ topics }
        id={ id }
        fetch = { fetchTopics }
      />
    </Box>
  );
};

export default Page;
