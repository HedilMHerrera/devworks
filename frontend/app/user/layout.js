import React from "react";
import { Box } from "@mui/material";
import { AsideMenu } from "../components/AsideMenu";

const layout = ({ children }) => {
  return (
    <Box width="100%" display="flex">
      <AsideMenu />
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
  );
};

export default layout;
