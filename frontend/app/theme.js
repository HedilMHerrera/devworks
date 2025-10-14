"use client";
import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material'
import { BorderColor, BorderStyle } from '@mui/icons-material';
const palette = {
    palette:{
        mode:"light",
        primary:{
            main:"#9fef00",
            contrastText:"#000000",
        },
        secondary:{
            main:"#202837",
            contrastText:"#ffffff",
        },
        background:{
            main:"#0b121f",
            contrastText:"#a4b1cd",
        },
        warning:{
            main:"#FFA500",
            contrastText:"#333333",
        },
    },
    components:{
        MuiPaper: {
            styleOverrides:{
                root:{
                    backgroundColor:'#141d2b',
                    color:'#a4b1cd',
                    borderRadius:"7px",
                    borderColor:'#202837',
                    borderStyle:"solid",
                    borderWidth: "1px",
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.05)',
                }
            }
        },
        MuiTypography:{
            styleOverrides:{
                root:{
                    color:"#ffffff",
                }
            }
        },
        MuiLink:{
            color:"#9fef00",
        }
    }

}
  
const theme = createTheme(palette);


const Theme= ({children}) => {
  return (
    <ThemeProvider theme={ theme }>
         {children}
    </ThemeProvider>
  )
}

export default Theme
