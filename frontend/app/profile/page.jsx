"use client";
import { Box, Container, Typography, Avatar, Button, IconButton, Tooltip } from "@mui/material";
import Input from "../components/Input";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "./profile";

export default function ProfilePage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUser = async() => {
      try {
        const id = 4;
        const user = await getProfile(id);

        if (user) {
          setFirstName(user.username);
          setEmail(user.email);
          setPassword(user.password);
        }

      } catch (error) {
        if (error.message === "No autorizado") {
          router.push("/login");
        } else {
          console.error("Error: ", error);
        }
      }
    };

    fetchUser();

  }, [router]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        justifySelf: "center",
        alignSelf: "center",
        marginTop: 5,
        marginBottom: 5,
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
        <Box component="hr" sx={{ flexGrow: 2, borderColor: "secondary.main", width: "100%" }} />
      </Box>
      <Box sx={{
        display: "flex",
        gap: 2,
        border: "0.5px solid",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "secondary.main",
        borderRadius: 2,
        padding: "1rem 1.5rem",

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

            },
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

                  },
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
          width: "50%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        >
          <Input
            label="Nombre de Usuario"
            value={firstName}
            setValue={setFirstName}
            error=""
            sx={{ with: 1 }}
            setError={
              () => { }
            }
          />
          <Input
            label="correo"
            value={email}
            setValue={setEmail}
            sx={{ with: 1 }}
            error=""
            setError={
              () => { }
            }

          />
          <Input
            label="contraseña"
            value={password}
            setValue={setPassword}
            sx={{ with: 1 }}
            error=""
            setError={
              () => { }
            }
            type="pass"
          />

        </Box>
        <Button
          sx={{
            marginTop: "3rem",
            p : 1,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              color: "primary.main",
              bgcolor: "transparent",
              border:"1px solid",
              borderColor:"primary.main",
            },
            width: "25%",
          }}
        >
                    Guardar Cambios
        </Button>
      </Box>
    </Container>

  );
}
