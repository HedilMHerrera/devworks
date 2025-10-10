import { Box, Typography } from '@mui/material';
import React from 'react';
import SnakeIcon from './snakeicon/SnakeIcon';
import styles from './loading.module.css';
const Loading = () => {
  return (
    <Box className={ styles.containerLoading }>
        <Box className={ styles['shrink-border-loading'] } 
            width={49} height={49}>
            <SnakeIcon  width={50} height={50}/>
        
        </Box>
        <Typography
            variant='h4'
        >
            Cargando
            <span className={ styles['loading-dots'] }>
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </span>
        </Typography>
    </Box> )
}

export default Loading
