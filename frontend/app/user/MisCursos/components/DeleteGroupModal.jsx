"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography, Box, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { Password, Warning as WarningIcon } from "@mui/icons-material";
import Input from "@/app/components/Input";
import { TextValidator, NotIsVoid, HaveBetweenLength } from "@/app/validators/TextInputValidator";
const DeleteGroupModal = ({ open, onClose, users, onConfirm, loading = false }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    const validator = new TextValidator();
    validator.addValidator(new NotIsVoid());
    const validatePass = validator.validate(value);
    setError(validatePass.error);
    if (validatePass.isValid){
      onConfirm(value);
      setValue("");
      setError("");
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: "secondary.main",
          color: "secondary.contrastText",
        },
      }}
    >
      <DialogContent sx={{ pt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningIcon sx={{ color: "error.main", fontSize: 50 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Eliminar Grupo
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: "background.contrastText", mb: 2 }}>
          ¿Seguro que quieres Eliminar {users.length === 1 ? "este grupo" : "estos grupos"}?
        </Typography>

        <List
          sx={{
            backgroundColor: "secondary.main",
            borderRadius: 1,
            p: 1,
          }}
        >
          {users.map((user) => (
            <ListItem key={user.id} sx={{ py: 0.5 }}>
              <ListItemText
                primary={`• ${user.title}`}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "secondary.contrastText",
                }}
              />
            </ListItem>
          ))}
        </List>
        <Input
          label="Ingrese su contraseña"
          Icon={ Password }
          value={ value }
          setValue={ setValue }
          error={ error }
          setError={ setError }
          type="pass"/>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={() => {
            onClose();
            setError("");
            setValue("");
          }}
          sx={{
            color: "background.contrastText",
            textTransform: "none",
            "&:hover": { backgroundColor: "secondary.main" },
          }}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={ handleConfirm }
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "error.main",
            color: "secondary.contrastText",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} sx={{ color: "secondary.contrastText" }} />
              Eliminando...
            </Box>
          ) : (
            "Eliminar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteGroupModal;
