"use client";
import React from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography, Box, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

const ArchiveGroupModal = ({ open, onClose, users, onConfirm, loading = false }) => {
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
            <WarningIcon sx={{ color: "warning.main", fontSize: 50 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Archivar Grupo
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: "background.contrastText", mb: 2 }}>
          ¿Seguro que quieres Archivar {users.length === 1 ? "este grupo" : "estos grupos"}?
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
            backgroundColor: "warning.main",
            color: "secondary.contrastText",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} sx={{ color: "secondary.contrastText" }} />
              Archivando...
            </Box>
          ) : (
            "Archivar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArchiveGroupModal;
