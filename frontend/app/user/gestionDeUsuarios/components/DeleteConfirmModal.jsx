"use client";
import React from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography, Box, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

const DeleteConfirmModal = ({ open, onClose, users, onConfirm, loading = false }) => {
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
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "error.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningIcon sx={{ color: "secondary.contrastText", fontSize: 28 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Eliminar usuario
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: "background.contrastText", mb: 2 }}>
          ¿Seguro que quieres eliminar {users.length === 1 ? "a este usuario" : "a estos usuarios"}?
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
                primary={`• ${user.name} ${user.lastName} (${user.email})`}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "secondary.contrastText",
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onClose}
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
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "error.main",
            color: "secondary.contrastText",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "error.main" },
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

export default DeleteConfirmModal;
