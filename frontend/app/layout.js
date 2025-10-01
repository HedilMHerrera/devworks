import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Theme from "./theme";
import { Container } from "@mui/material";
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <Theme>
        <Container
          component="body"
          sx={{
            backgroundColor:"background.main",
          }}
        >
          {children}
        </Container>
      </Theme>
    </html>
  );
}
