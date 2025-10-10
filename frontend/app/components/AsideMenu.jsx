'use client';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, Typography, Button } from '@mui/material'
import "react-pro-sidebar/dist/css/styles.css";
import { menuItems } from './menuItems';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import styles from './menu.module.css'
import { useSessionZ } from '../context/SessionContext';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
const Item = ({ title, to, Icon }) => {
    const pathname = usePathname();
    const router = useRouter();
    return (
      <MenuItem 
        active= { title.replace(/\s+/g, "") === pathname.split('/')[2] }
        onClick={ () => { router.push(to) } }
        icon = { <Icon sx={{bgColor:"white"}}/> }
      >
        <Button  className={styles['shrink-border']}>
          <Typography 
          variant='p' 
          color='background.contrastText'
          
        >{ title }</Typography>
        </Button>
        
    </MenuItem>)
}

const AsideMenuBar= ({ data }) => {
  const [ isCollapsed, setIsCollapsed ] = useState(true)
  return (
    <Box 
      sx={{
        "& .pro-sidebar-inner": {
          bgcolor:"background.main",
          color:"primary.main",
          borderRightStyle:"solid",
          borderWidth:"1px",
          borderColor:"#202837",
        },
        "& .pro-icon-wrapper": {
          backgroundColor:"transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "primary.main",
        },
        "& .pro-menu-item.active": {
          color: "secondary.contrastText",
          borderLeftStyle:"solid",
          bgcolor: "secondary.main",
          borderColor:"primary.main",
        },
        "& .pro-item-content": {
          overflow:(isCollapsed) ? "hidden !important":"visible !important",
        },
        zIndex:100,
        height:"100%",
      }}

    >
      <ProSidebar collapsed={ isCollapsed }>
        <Menu iconShape='square'>
        <MenuItem
          onClick={ () => setIsCollapsed(!isCollapsed) }
          icon={ isCollapsed ? 
            <ArrowForward sx={{
                              color:"background.contrastText", 
                              bgcolor:"secondary.main",
                              borderRadius:"5px",
                            }} />: 
            <ArrowBack /> }
          style={{
            margin: "10px 0 20px 0",
          }}
        ><Typography
          className={ styles.shiny }
          variant='h6'
          sx={{
            textAlign:"center"
          }}
        >{ data.toUpperCase() }</Typography>
        </MenuItem>
          <Box paddingLeft={ isCollapsed ? undefined : "10%" }

          >
            {menuItems[data].map((dat) => (<Item 
              title={ dat.name }
              to={dat.route}
              key={ dat.name }
              Icon= { dat.Icon }
            />))}
          </Box>
      </Menu>
      </ProSidebar>
    </Box>
  )
}

export const AsideMenu = () => {
  const user = useSessionZ((state) => state.user)
  return user && <AsideMenuBar data = { user.role }/>
}

