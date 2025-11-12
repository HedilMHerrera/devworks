import React,{ useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Typography, Link } from "@mui/material";
const AcordionData = ({ title, description, startDate, content }) => {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };
  return (
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
                transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 0.3s ease",
                mr: 1,
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Link href="" variant="h6">{ title }</Link>
              <Box color="background.contrastText">
                Comienza en
                <Typography
                  variant="h6"
                  sx={{ ml: 4, fontSize: "0.9rem", mt: 0.5 }}>
                  { new Date(startDate).toLocaleString() }
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography
            variant="h6"
            sx={{ ml: 4, opacity: 0.7, fontSize: "0.9rem", mt: 0.5 }}
          >
            { description }
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: "background.main" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {content.map((topic) => (
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
  );
};

export default AcordionData;
