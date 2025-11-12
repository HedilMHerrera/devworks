"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Link from "next/link";

const TopicAccordion = ({ topic }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (_, isExpanded) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        backgroundColor: "#1a2332",
        color: "white",
        borderRadius: "8px",
        "&:before": { display: "none" },
        width: "100%",
        mb: 2,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          "& .MuiAccordionSummary-content": { marginLeft: 1 },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{topic.title}</Typography>
          </Box>
          {topic.description && (
            <Typography
              variant="body2"
              sx={{ opacity: 0.7, fontSize: "0.9rem", mt: 0.5 }}
            >
              {topic.description}
            </Typography>
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ bgcolor: "#0e1724" }}>
        <Box
          component={Link}
          href={`/user/cursos/topic/${topic.id}`}
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

        {topic.content && topic.content.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {topic.content.map((content) => (
              <Box
                key={content.id}
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
                  {content.title}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography
            sx={{ color: "#aaa", fontSize: "0.9rem", mt: 1, ml: 1 }}
          >
            No hay contenidos aún
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default TopicAccordion;
