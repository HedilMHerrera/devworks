"use client";

import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const Page = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const topics = [
    { id: 1, title: "Introducción al curso de programación web", startDate: "12-11-2025" },
    { id: 2, title: "Configurar el entorno de desarrollo", startDate: "13-11-2025" },
    { id: 3, title: "Primitivas en PHP", startDate: "14-11-2025" },
  ];

  return (
    <Box sx={{ p: 3, width: "70%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ color: "background.contrastText", mb: 2 }}>
          Programas del curso
        </Typography>
        <Button sx={{
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
        }}>
          añadir topico
        </Button>
      </Box>

      <Accordion expanded={expanded} onChange={handleChange}
        sx={{
          backgroundColor: "#1a2332",
          color: "white",
          borderRadius: "8px",
          "&:before": { display: "none" },
          width: "100%",
        }}
      >
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            "& .MuiAccordionSummary-content": {
              marginLeft: 1,
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ExpandMoreIcon
                sx={{
                  color: "primary.main",
                  transform: expanded ? "rotate(90deg)" : "rotate(-90deg)",
                  transition: "transform 0.3s ease",
                  mr: 1,
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Typography variant="h6">¿Qué es Python?</Typography>
                <Typography variant="h6" sx={{ ml: 4, color: "primary.main", fontSize: "0.9rem", mt: 0.5 }}>inicia: 12-11-2025</Typography>
              </Box>
            </Box>

            <Typography
              variant="h6"
              sx={{ ml: 4, opacity: 0.7, fontSize: "0.9rem", mt: 0.5 }}
            >
              En este tópico verás una introducción a Python.
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ bgcolor: "background.main" }}>
          <Box
            component={Link}
            href="/user/MisCursos/topic/1"
            sx={{
              display: "inline-block",
              color: "background.contrastText",
              textDecoration: "none",
              fontWeight: "bold",
              mt: 2,
              mb: 2,
              "&:hover": {
                color: "primary.main",
                textDecoration: "underline",
              },
            }}
          >
            Añadir contenido
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {topics.map((topic) => (
              <Box
                key={topic.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#1f2a3a",
                  borderRadius: "6px",
                  p: 1.5,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#273446" },
                }}
              >
                <Typography
                  sx={{ display: "flex", alignItems: "center", color: "white" }}
                >
                  <ArrowRightIcon
                    sx={{ fontSize: "20px", color: "primary.main", mr: 1 }}
                  />
                  {topic.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Page;
