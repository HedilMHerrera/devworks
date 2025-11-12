"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Grid, Card, CardContent, TextField } from "@mui/material";
import TopicAccordion from "./components/TopicAccordion";
import axios from "axios";

const URL_BASE = "http://localhost:30001";
const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get(`${URL_BASE}/api/topic`);
        setTopics(res.data);
      } catch (err) {
        console.error("Error al cargar tópicos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleCreateTopic = async () => {
    if (!newTopic.title || !newTopic.description) {
      alert("Completa el título y la descripción");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        idTutor: 2,
        title: newTopic.title,
        description: newTopic.description,
        startDate: newTopic.startDate
          ? new Date(newTopic.startDate).toISOString()
          : new Date().toISOString(),
        endDate: newTopic.endDate
          ? new Date(newTopic.endDate).toISOString()
          : new Date().toISOString(),
      };

      const res = await axios.post("http://localhost:30001/api/topic", payload);

      if (res.data && res.data.id) {
        setTopics((prev) => [...prev, res.data]);
      }
      setSaving(true);

      setNewTopic({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      console.error("Error al crear el tópico:", err);
      alert("Error al crear el tópico");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: "70%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ color: "background.contrastText", mb: 2 }}>
          Programas del curso
        </Typography>
        <Button
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            gap: 1,
            textTransform: "lowercase",
            padding: "5px 30px ",
            transition: "0.3s",
            "&:hover": {
              color: "primary.main",
              bgcolor: "transparent",
              border: "1px solid",
              borderColor: "primary.main",
            },
          }}
        >
          añadir tópico
        </Button>
      </Box>

      {topics.length === 0 ? (
        <Typography sx={{ color: "#aaa" }}>No hay tópicos disponibles.</Typography>
      ) : (
        topics.map((topic) => <TopicAccordion key={topic.id} topic={topic} />)
      )}
      <Card
        sx={{
          mb: 4,
          p: 2,
          backgroundColor: "secondary.main",
          borderRadius: 2,
          color: "white",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Crear nuevo tópico
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                variant="filled"
                value={newTopic.title}
                onChange={(e) =>
                  setNewTopic((prev) => ({ ...prev, title: e.target.value }))
                }
                sx={{
                  input: { color: "#d9f7be" },
                  label: { color: "#7fa86b" },
                  ".MuiFilledInput-root": { backgroundColor: "#0b1714" },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                variant="filled"
                value={newTopic.description}
                onChange={(e) =>
                  setNewTopic((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                sx={{
                  input: { color: "#d9f7be" },
                  label: { color: "#7fa86b" },
                  ".MuiFilledInput-root": { backgroundColor: "#0b1714" },
                }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            onClick={handleCreateTopic}
            disabled={saving}
            sx={{
              backgroundColor: "#9bdc28",
              color: "#0a120e",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#8ac923" },
              mt: 3,
            }}
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </CardContent>

      </Card>
    </Box>
  );
};

export default TopicList;
