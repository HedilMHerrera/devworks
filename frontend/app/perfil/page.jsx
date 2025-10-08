'use client'
import { Box, Container, Paper, Typography, Avatar, Button, IconButton, Tooltip } from '@mui/material'
import Input from '../components/Input'
import ButtonCustom from '../components/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';


export default function () {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const id = 1;
                const response = await fetch(`http://localhost:30001/api/user/${id}`);
                if (!response.ok) {
                    throw new Error(`Server Error: ${response.status}`);
                }

                const data = await response.json();
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(data.email);
                setPassword(data.password);

            } catch (error) {
                console.error("Error: ", error);
            }
        };

        fetchUser();

    }, []);



    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                justifySelf: "center",
                alignSelf: "center",
            }}
            maxWidth="md"
        >
            <Box>
                <Typography
                    variant='h5'
                    sx={{
                        fontWeight: 400,
                    }}
                >
                    Perfil de Usuario
                </Typography>
                <Typography
                    sx={{
                        fontSize: 15,
                        color: "background.contrastText",
                    }}
                >
                    Administra tu información personal dentro de PyCraft.
                </Typography>
                <Box component="hr" sx={{ flexGrow: 1, borderColor: "secondary.main" }} />
            </Box>
            <Box sx={{
                display: "flex",
                gap: 2,
                border: "0.5px solid",
                alignItems: "center",
                justifyContent: "space-between",
                borderColor: "secondary.main",
                borderRadius: 2,
                padding: "1rem 1.5rem"

            }}>
                <Box sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",

                }}>
                    <Avatar
                        alt="Remy Sharp"
                        src="/user.png"
                        sx={{ width: 120, height: 120 }} />
                    <Box >
                        <Typography
                            variant='h6'
                            sx={{
                                fontWeight: 400,
                            }}
                        >
                            Sube tu avatar
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 15,
                                color: "background.contrastText",
                            }}
                        >
                            El avatar debe tener al menos 300x300 píxeles.<br />
                            Se admiten archivos .png, .jpg y .jpeg.
                        </Typography>
                    </Box>


                </Box>
                <Box sx={{
                    display: "flex",
                    gap: 2,

                }} >
                    <Button sx={{
                        bgcolor: "secondary.main",
                        color: "secondary.contrastText",
                        display: "flex",
                        gap: 1,
                        textTransform: "lowercase",
                        padding: "5px 30px ",
                        transition: "0.3s",
                        "&:hover": {
                            bgcolor: "#52525b",

                        }
                    }}>
                        subir avatar
                    </Button>
                    <Box sx={{
                        bgcolor: "#ef4444",
                        borderRadius: 1,
                        transition: "0.3s",
                        "&:hover": {
                            bgcolor: "#fca5a5",

                        },
                    }}>
                        <Tooltip title="eliminar" arrow>
                            <IconButton aria-label="delete">
                                <DeleteIcon sx={{
                                    transition: "0.3s",
                                    "&:hover": {
                                        color: "secondary.contrastText",

                                    }
                                }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                border: "0.5px solid",
                borderColor: "secondary.main",
                borderRadius: 2,
                padding: 3,

            }}>
                <Box sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    gap: 2

                }}>
                    <Input
                        label="Nombre"
                        value={firstName}
                        setValue={setFirstName}
                        sx={{ flex: 1 }}
                        error=""
                    />
                    <Input
                        label="Apellido"
                        value={lastName}
                        setValue={setLastName}
                        sx={{ flex: 1 }}
                        error=""

                    />
                </Box>
                <Box sx={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}
                >
                    <Input
                        label="correo"
                        value={email}
                        setValue={setEmail}
                        sx={{ with: 1 }}
                        error=""

                    />
                    <Input
                        label="contraseña"
                        value={password}
                        setValue={setPassword}
                        sx={{ with: 1 }}
                        error=""
                    />
                        

                </Box>
                <ButtonCustom
                    type="primary" sx={{ width: "11rem", padding: "2rem", marginTop: "1rem" }}>
                    Guardar Cambios
                </ButtonCustom>
            </Box>
        </Container>

    )
}