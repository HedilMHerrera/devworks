import { Box, Typography } from "@mui/material";
import React, { useMemo } from "react";
const StepComponent = ({ title, number, selected = false }) => {
  return (<Box
    sx={{
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
    }}
  >
    <Box
      sx={{
        borderRadius:"100px",
        backgroundColor:(selected) ? "primary.main":"secondary.main",
        width:"30px",
        padding:"10px",
        textAlign:"center",
      }}
    >
      <Typography variant="h5" color={ (selected) ? "primary.contrastText":"secondary.contrastText" }>
        { number }
      </Typography>
    </Box>
    <Typography
      fontSize={13}
      maxWidth={ 90 }
      textAlign="center"
    >
      { title }
    </Typography>
  </Box>);
};
const LineComponent = ({ selected=false ,...props }) => {
  return <Box
    zIndex="-100"
    component="hr"
    position="absolute"
    top="35%"
    width="33%"
    sx={{
      borderColor:(selected) ? "primary.main":"secondary.main",
    }}
    { ...props }
  />;
};
const StepPeakComponent = ({ children, step }) => {
  const peak = useMemo(() => children.length ?? 0);
  return (
    <Box display="flex" justifyContent="space-around" position="relative" overflow="hidden">
      { children.map((child, index) =><React.StrictMode key={ index+"strict" }>
        <StepComponent
          key={ index+"step" }
          title={ child.props.children }
          number={ index+1 } selected={ step===index }/>
        <LineComponent
          key={ index+"line" }
          left={ `${ ((100/peak)*index)+15 }%` }
          selected={ index<step }/>
      </React.StrictMode>) }
    </Box>
  );
};

export default StepPeakComponent;
