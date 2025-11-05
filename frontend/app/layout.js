import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Notify from "./notify";
import Theme from "./theme";
import { Box } from "@mui/material";
import { MenuCustom } from "./components/Menu";
import Charging from "./components/Charging";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
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
            margin:0,
          }}
        >
          <GoogleOAuthProvider clientId={ GOOGLE_CLIENT_ID }>
            <Charging>
              <Notify>
                <Box
                  width="100%"
                  height="100%"
                >

                  <MenuCustom />
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
                      zIndex={1}
                    >

                      {children}

                    </Box>
                  </Box>
                </Box>
              </Notify>
            </Charging>
          </GoogleOAuthProvider>
        </Box>
      </Theme>
    </html>
  );
}
