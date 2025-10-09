'use client';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, Typography, Button } from '@mui/material'
import "react-pro-sidebar/dist/css/styles.css";
import { menuItems } from './menuItems';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import styles from './menu.module.css'
import { SessionContext } from '../context/SessionContext';
const roles = {
      1:"admin",
      2:"teacher",
      3:"student",
      null:null,
    }
const Item = ({ title, to, Icon, selected, setSelected }) => {
    return (
      <MenuItem 
        active= { title === selected }
        onClick={ () => setSelected(title) }
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

const AsideMenuBar= ({ data, name }) => {
  const [ isCollapsed, setIsCollapsed ] = useState(true)
  const [selected, setSelected] = useState("Dashboard")
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
          color: "background.contrastText",
        },
        "& .pro-item-content": {
          overflow:(isCollapsed) ? "hidden !important":"visible !important",
        },
        zIndex:100,
        height:"100%",
        position:{xs:"fixed", sm:"relative"}
      }}

    >
      <ProSidebar collapsed={ isCollapsed }>
        <Menu iconShape='square'>
        <MenuItem
          onClick={ () => setIsCollapsed(!isCollapsed) }
          icon={ isCollapsed ? 
            <ArrowForward sx={{
                              color:"primary.contrastText", 
                              bgcolor:"primary.main",
                              borderRadius:"5px",
                            }} />: 
            <ArrowBack /> }
          style={{
            margin: "10px 0 20px 0",
          }}
        ><Typography
          variant='h4'
          sx={{
            color:"red",
            textAlign:"center"
          }}
        >{ name.toUpperCase() }</Typography>
        </MenuItem>
          <Box paddingLeft={ isCollapsed ? undefined : "10%" }

          >
            {data && data.map((dat) => (<Item 
              title={ dat.name }
              to="/"
              key={ dat.name }
              Icon= { dat.Icon }
              selected={ selected }
              setSelected={ setSelected }
            />))}
          </Box>
      </Menu>
      </ProSidebar>
      
    </Box>
  )
}

const ConditionalRender = ({dataUser}) => {
    const [data, setData] = useState(null);
  const [name, setName] = useState(roles[dataUser.roleId]);
  useEffect(() => {
    setData(menuItems[name])
  },[])
  return(<>
    {(data) && <AsideMenuBar name={name} data={data} />}
  </>)
}

export const AsideMenu = () => {
  const { dataUser } = useContext(SessionContext);
  return dataUser && <ConditionalRender dataUser = { dataUser }/>
}

