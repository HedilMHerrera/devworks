"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  TextField,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const mockTopic = {
  title: "Introducción a Python",
  contentHtml: `
    <h2>¿Qué es Python?</h2>
    <p>Python es un lenguaje de programación interpretado, fácil de aprender y con una sintaxis clara.</p>
    <p>Por ejemplo:</p>
    <pre><code>print("Hola, mundo!")</code></pre>
    <p>Python se usa ampliamente en <strong>IA</strong>, <em>Data Science</em> y desarrollo web.</p>
  `,
};

export default function TopicEditPage() {
  const id = 1;
  const [topic, setTopic] = useState(mockTopic);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Simulando carga de tópico con ID:", id);
  }, [id]);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      alert("Tópico guardado (modo demo)");
      setLoading(false);
    }, 1000);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, height: "100%", display:"flex", justifyContent:"center" }} >
      <Grid container spacing={2} wrap="nowrap">
        <Grid item xs={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: "#071014",
              borderRadius: 2,
              border: "1px solid #0f1f1a",
              height: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
              Editar Tópico
            </Typography>

            <TextField
              label="Título"
              fullWidth
              variant="filled"
              value={topic.title}
              onChange={(e) =>
                setTopic((prev) => ({ ...prev, title: e.target.value }))
              }
              sx={{
                mb: 2,
                input: { color: "#d9f7be" },
                ".MuiFilledInput-root": { backgroundColor: "#0b1714" },
                label: { color: "#7fa86b" },
              }}
            />

            <Box sx={{ flex: 1, mb: 2 }}>
              <ReactQuill
                theme="snow"
                value={topic.contentHtml}
                onChange={(val) =>
                  setTopic((prev) => ({ ...prev, contentHtml: val }))
                }
                style={{ height: "90%", borderRadius: "8px" }}
              />

              <style jsx global>{`
                .ql-container {
                  height: 100% !important;
                  box-sizing: border-box;
                  background-color: #0b1213;
                  color: #d9f7be;
                  border-radius: 8px;
                  overflow-y: auto;
                }
                .ql-editor {
                  height: 100% !important;
                  min-height: 100%;
                }
                `}</style>
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
              <Button variant="outlined" sx={{ color: "#80ffbf", borderColor: "#80ffbf" }}>
                Guardar borrador
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                sx={{
                  backgroundColor: "#9bdc28",
                  color: "#0a120e",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#8ac923" },
                }}
              >
                {loading ? "Guardando..." : "Publicar"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: "#071014",
              borderRadius: 2,
              border: "1px solid #0f1f1a",
              height: "90%",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
              Vista Previa
            </Typography>

            <Box
              sx={{
                "& h1, & h2, & h3": { color: "#9bdc28", mt: 2 },
                "& p": {
                  color: "#d9f7be",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                },
                "& a": { color: "#80ffbf", textDecoration: "underline" },
                "& img": { maxWidth: "100%", borderRadius: 2, mt: 2 },
                "& pre": {
                  backgroundColor: "#0e1a12",
                  color: "#9bdc28",
                  padding: "10px",
                  borderRadius: "6px",
                  overflowX: "auto",
                },
                backgroundColor: "#081318",
                p: 3,
                borderRadius: 1,
                minHeight: 350,
              }}
              dangerouslySetInnerHTML={{
                __html: `<h2 style="margin-top:0">${topic.title}</h2>${topic.contentHtml}`,
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
