'use client';
import React from 'react'
import { useRouter } from 'next/navigation';
import { Paper, Typography, Box } from '@mui/material';
import styles from "./ItemMenu.module.css";
import styles2 from "../../components/menu.module.css"


const ItemMenu = ({ name, Icon, route, description }) => {
    const router = useRouter()
    return(
        <Paper
            className={ `${styles.paperItem} ${styles2['shrink-border']}` }
            onClick = {() => router.push(route)}
            sx={{
                '&:hover':{
                    color:"primary.main"
                }
            }}
        >
            <Typography
                variant='h5'
                fontWeight={700}
                textAlign="center"
            >
                {name}
            </Typography>
            <Icon 
                color="primary"
                sx={{
                    width:80,
                    height:80,
                }}
            />
            <Typography
                variant='p'
                color='background.contrastText'
                maxWidth={250}
                maxHeight={250}
                textAlign="center"
            >
                {description}
            </Typography>
            
        </Paper>
        )
}

export default ItemMenu
