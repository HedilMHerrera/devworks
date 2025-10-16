import React from "react";
import { Box } from "@mui/material";
import style from "./components/ItemMenu.module.css";
import ItemMenuSkeleton from "./components/ItemMenuSkeleton";
const items = [0,1,2,3,4,5];
const Loading = () => {
  return (
    <Box
      className={style.paperContainer}
    >
      {items.map((item) => <ItemMenuSkeleton key={item}/>)}
    </Box>
  );
};

export default Loading;
