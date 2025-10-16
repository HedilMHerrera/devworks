import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, IconButton, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
const Input = ({ label="", Icon, value, setValue, type, error, setError, sx}) => {
    const [showPass, setShowPass] = useState(false);
    const handleChange = (e) => {
        setError("");
        setValue(e.target.value);
    }
    return (
    <Box
        sx={{
            ...sx,
            display:"flex",
            flexDirection:"column",
            gap:0.5,
        }}
    >
        <Box
            sx={{
                '&.MuiBox-root':{
                    color:'background.contrastText',
                },
                display:"flex",
                alignItems:"center",
                gap:1,
                fontSize:"15px"
            }}
        >
            {Icon && <Icon sx={{
                color:'primary.main',
            }}/>} { label } <Box color="red">{error}</Box>
        </Box>
        <TextField 
            fullWidth
            value={ value }
            type={ type === 'pass' && !showPass ?  'password':'text'}
            onChange={ (e) => handleChange(e) }
            sx={{
                '& .MuiInputBase-root':{
                    color:"secondary.contrastText",
                    bgcolor:'secondary.main',
                    borderStyle:'solid',
                    borderWidth:1,
                    borderColor:((error || '').length == 0) ? "background.contrastText":"red",
                    fontSize:20,
                    '& :focus':{
                        borderWidth:1,
                    },
                '& .MuiInputBase-input':{
                    p:1.3
                }
                },
            }}
            slotProps={{
                input:{
                    endAdornment:((type === 'pass') && <IconButton
                    onClick={ () => {setShowPass(!showPass)} }
                    edge="end"
                    sx={{
                        color:"background.contrastText"
                    }}
                >
                    {showPass ? <Visibility />:<VisibilityOff />}
                </IconButton>)
                }
            }}
        />
    </Box>
  )
}

export default Input