import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
const HeaderTableTitle = ({ children, title, Icon }) => {
  const theme = useTheme();
  return (
    <Box mb={1} display="flex" justifyContent="space-between" alignItems="center"
      sx={{
        background: `linear-gradient(to right, transparent 20%, ${ theme.palette.secondary.main })`,
        paddingTop:"20px",
        paddingBottom:"20px",
        paddingRight:"30px",
        borderTopRightRadius:"5px",
        borderBottomRightRadius:"5px",
        minWidth:{  md:"600px", sm:"500px", xs:"" },
      }}
    >
      <Box display="flex" flexDirection="column" width="100%">
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          { title }
        </Typography>
        <Box color="background.contrastText" >
          { children }
        </Box>
      </Box>
      <Icon
        sx={{
          fontSize: 70,
          color: theme.palette.secondary.contrastText,
        }}/>
    </Box>
  );
};

export default HeaderTableTitle;

