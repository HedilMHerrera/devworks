import React from 'react'
import { Button } from '@mui/material'
const ButtonCustom = ({ type, children, sx, ...props  }) => {
  return (
    <Button
        sx={{...sx,
           '&.MuiButtonBase-root':{
            bgcolor:(type === 'primary') ? 'primary.main':'secondary.main',
            color:(type==='primary') ? 'primary.contrastText':'secondary.contrastText',
            display:"flex",
            gap:1,
            border: (type !== 'primary') ? 1:"none",
            p:1.5
           },
        }}
        {...props}
    >
      {children}
    </Button>
  )
}

export default ButtonCustom
