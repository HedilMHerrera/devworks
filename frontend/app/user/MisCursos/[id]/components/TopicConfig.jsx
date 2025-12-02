"use client";
import React, { useEffect, useState } from "react";
import { Dialog,
  DialogActions,
  Button,
  Typography,
  Box,
  Checkbox } from "@mui/material";
import { URL_API_ROOT } from "@/app/redirections";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import AcordionData from "./AcordionData";
const TopicGroupModal = ({ open, setOpen, topicsAdded, id, fetch }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchTopics();
  },[topicsAdded]);

  const saveChekeds = async() => {
    try {
      for (const { checked, topic } of topics) {
        const url = `${ URL_API_ROOT }/api/grouptopics/${ id }/topics/${ topic.id }`;
        if (checked) {
          await axios.post(url, null, { withCredentials:true });
        } else {
          await axios.delete(url, { withCredentials:true });
        }
      }
      enqueueSnackbar("configuracion guardada", { variant:"info" });
      fetch();
      setOpen(false);
    } catch {
      enqueueSnackbar("error interno del servidor", { variant:"error" });
    }
  };

  const setChecked = async(id) => {
    const topicAux = [...topics];
    const res = [];
    for (const { checked ,topic } of topicAux){
      const isClicked = topic.id === id;
      const newChecked = isClicked ? !checked: checked;
      res.push({ checked: newChecked, topic });
    }
    setTopics(res);
  };

  const fetchTopics = async() => {
    const url = `${ URL_API_ROOT }/api/topic`;
    try {
      const response = await axios.get(url, { withCredentials:true });
      const topicsAux = [];
      for (const topic of response.data){
        const checked = topicsAdded.some((topicAdd) => topicAdd.id === topic.id);
        topicsAux.push({ checked, topic });
      }
      setTopics(topicsAux);
    } catch {
      enqueueSnackbar("Error interno del servidor", { variant:"error" });
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          padding:"20px",
          borderRadius: 2,
          backgroundColor: "secondary.main",
          color: "secondary.contrastText",
          overflow:"hidden",
        },
      }}
    >
      <Typography variant="body2" sx={{ color: "background.contrastText", mb: 2 }}>
        Lista de Tópicos
      </Typography>
      { topics.map(({ checked, topic }) => <Box key={ `${ topic.id }b` }
        display="flex"
        alignItems="center"
        gap="15px"
      >
        <Checkbox checked={checked} onChange={ () => setChecked(topic.id) }/>
        <AcordionData
          key={ `${topic.id}topicC` }
          title={ topic.title }
          description={ topic.description }
          startDate={ topic.startDate }
          content={ topic.content } /></Box>) }

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={() => setOpen(false)}
          sx={{
            color: "background.contrastText",
            textTransform: "none",
            "&:hover": { backgroundColor: "secondary.main" },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={ saveChekeds }
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
           Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TopicGroupModal;
