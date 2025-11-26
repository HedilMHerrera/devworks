import { Box } from "@mui/material";

export default function ContentHtml({ topic }) {
  return (
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
        __html: `<h2 style="margin-top:0">${topic.title}</h2>${topic.statement}`,
      }}
    />

  );
}
