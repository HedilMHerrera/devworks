"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { URL_API_ROOT } from "@/app/redirections";
import { useSnackbar } from "notistack";
import axios from "axios";
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
import ContentHtml from "@/app/user/(teacher)/cursos/components/ContentHTML";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const mockTopic = {
  title: "Introducción a Python",
  statement: `
    <h2>¿Qué es Python?</h2>
    <p>Python es un lenguaje de programación interpretado, fácil de aprender y con una sintaxis clara.</p>
    <p>Por ejemplo:</p>
    <pre><code>print("Hola, mundo!")</code></pre>
    <p>Python se usa ampliamente en <strong>IA</strong>, <em>Data Science</em> y desarrollo web.</p>
  `,
};

export default function TopicEditPage() {
  const params = useParams();
  const id = parseInt(params.id);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [topic, setTopic] = useState(mockTopic);
  const [loading, setLoading] = useState(false);

  const handleSave = async() => {
    try {
      setLoading(true);

      const contentData = {
        idTopic:id,
        title: topic.title,
        type: "texto",
        statement: topic.statement,
        urlView: "url",
        urlSource: "url",
      };

      const res = await axios.post(`${URL_API_ROOT}/api/content`, contentData);

      if (res.status === 201 || res.data.success) {
        enqueueSnackbar("contenido guardado exitosamente",{ variant:"success" });
        router.back();
      } else {
        enqueueSnackbar("error al guardar contenido", { variant:"error" });
      }
    } catch (error) {
      enqueueSnackbar("error al guardar contenido", { variant:"error" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, height: "100%", display:"flex", justifyContent:"center" }} >
      <Grid container spacing={2} wrap="nowrap">
        <Grid item xs={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: "secondary.main",
              borderRadius: 2,
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
                value={topic.statement}
                onChange={(val) =>
                  setTopic((prev) => ({ ...prev, statement: val }))
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
              <Button
                variant="contained"
                onClick={() => router.back()}
                sx={{
                  backgroundColor: "#9adc2856",
                  color: "#0a120e",
                  fontWeight: "bold",
                }}
              >
                cancelar
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
              backgroundColor: "secondary.main",
              borderRadius: 2,
              border: "1px solid #0f1f1a",
              height: "90%",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
              Vista Previa
            </Typography>
            <ContentHtml topic={ topic }/>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
