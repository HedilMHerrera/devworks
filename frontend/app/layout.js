import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Notify from "./notify";
import Theme from "./theme";
import { Box } from "@mui/material";
import { SessionProvider } from "./context/SessionContext";
import { MenuCustom } from "./components/Menu";
import { AsideMenu } from "./components/AsideMenu";
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <Theme>
        <Box
          component="body"
          sx={{
            backgroundColor:"background.main",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            padding:0,
            margin:0
          }}
        >
          <SessionProvider>
            <Notify>
              
              <Box
                width="100%"
              >
                 <Box>
                    <MenuCustom />
                  </Box>
                  <Box
                    component="main"
                    display="flex"
                    width="100%"
                    padding="0"
                    alignItems="start"
                    justifyContent="start"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      width="100%"
                      mt={2}
                      zIndex={1}
                    >
                       {children}
                    </Box>
                  </Box>
              </Box>
            </Notify>
          </SessionProvider>
        </Box>
      </Theme>
    </html>
  );
}
