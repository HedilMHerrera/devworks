import React from 'react'
import { Paper } from '@mui/material';
import styles from "./ItemMenu.module.css";
import style from "../../global.module.css";

const ItemMenuSkeleton = () => {
    return(
        <Paper
            className={ `${styles.paperItem} ${style.skeleton}` }          
        />)
}

export default ItemMenuSkeleton
