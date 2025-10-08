import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Notify from "./notify";
import Theme from "./theme";
import { Container } from "@mui/material";
import { SessionProvider } from "./context/SessionContext";
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <Theme>
        <Container
          component="body"
          sx={{
            backgroundColor:"background.main",
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center"
          }}
        >
          <SessionProvider>
            <Notify>
            {children}
            </Notify>
          </SessionProvider>
        </Container>
        
      </Theme>
    </html>
  );
}
