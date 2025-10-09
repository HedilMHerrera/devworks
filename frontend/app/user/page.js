'use client'
import React,{ useContext, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import ItemMenu from './components/ItemMenu';
import { menuItems } from '../components/menuItems';
import style from "./components/ItemMenu.module.css";
import { SessionContext } from '../context/SessionContext';
const roles = {
      1:"admin",
      2:"teacher",
      3:"student",
      null:null,
  }

const Page = () => {
  const { dataUser } = useContext(SessionContext);
  const [items, setItems] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const roleId = dataUser ? dataUser.roleId:null;
    const roleValue = roles[roleId];
    setRole(roleValue);
  },[dataUser])

  useEffect(()=>{
    setItems(menuItems[role]);
  },[role])

  useEffect(() => {
    console.log(items);
  },[items])
  return (
    <Box
      className={style.paperContainer}
    >
        {items && (items.map((item) => <ItemMenu key={item.name} {...item} />))}
    </Box>
  )
}

export default Page
