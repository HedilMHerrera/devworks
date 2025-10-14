'use client'
import React,{ useEffect, useState } from 'react'
import { Box } from '@mui/material'
import ItemMenu from './components/ItemMenu';
import { menuItems } from '../components/menuItems';
import style from "./components/ItemMenu.module.css";
import { useSessionZ } from '../context/SessionContext';
const Page = () => {
  const user = useSessionZ((state) =>state.user);
  return (
    <Box
      className={style.paperContainer}
    >
        {user && (menuItems[user.role].map((item) => <ItemMenu key={item.name} {...item} />))}
    </Box>
  )
}

export default Page
