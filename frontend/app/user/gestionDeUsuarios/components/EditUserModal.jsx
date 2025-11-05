"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Box,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { getRoleDisplay } from "../utils/roleUtils";

const disabledTextFieldStyles = {
  mt: 0,
  mb: 2,
  "& .MuiInputBase-root": {
    color: "secondary.contrastText",
    bgcolor: "secondary.main",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "background.contrastText",
    fontSize: 18,
    pointerEvents: "none",
    "& .MuiInputBase-input": {
      p: 1.3,
      cursor: "default",
      WebkitTextFillColor: "#ffffff !important",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "background.contrastText !important" },
  "& .MuiInputBase-root.Mui-disabled": {
    color: "#ffffff",
    bgcolor: "secondary.main",
    WebkitTextFillColor: "#ffffff !important",
  },
};

const EditUserModal = ({ open, onClose, user, roles, onUpdate, loading = false }) => {
  const [selectedRoleId, setSelectedRoleId] = useState("");

  React.useEffect(() => {
    if (user) {
      setSelectedRoleId(user.roleId);
    }
  }, [user]);

  const handleSave = () => {
    if (selectedRoleId && user) {
      onUpdate(user.id, selectedRoleId);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: "secondary.main",
          color: "secondary.contrastText",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Editar Usuario</span>
        <IconButton onClick={onClose} sx={{ color: "secondary.contrastText" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3, mt: 2 }}>
          <Avatar
            src={`https://ui-avatars.com/api/?name=${user.name}+${user.lastName}&background=random&size=128`}
            sx={{ width: 120, height: 120 }}
          />
        </Box>

        <Box sx={{ color: "background.contrastText", fontSize: 15, mb: 0.25 }}>Nombres</Box>
        <TextField
          value={user.name}
          fullWidth
          margin="normal"
          disabled
          InputProps={{ readOnly: true }}
          sx={disabledTextFieldStyles}
        />
        <Box sx={{ color: "background.contrastText", fontSize: 15, mb: 0.25 }}>Apellidos</Box>
        <TextField
          value={user.lastName}
          fullWidth
          margin="normal"
          disabled
          InputProps={{ readOnly: true }}
          sx={disabledTextFieldStyles}
        />
        <Box sx={{ color: "background.contrastText", fontSize: 15, mb: 0.25 }}>Correo Electrónico</Box>
        <TextField
          value={user.email}
          fullWidth
          margin="normal"
          disabled
          InputProps={{ readOnly: true }}
          sx={disabledTextFieldStyles}
        />

        <Box sx={{ color: "background.contrastText", fontSize: 15, mb: 0.25 }}>Rol</Box>
        <FormControl
          fullWidth
          sx={{
            mt: 0,
            mb: 2,
            "& .MuiInputBase-root": {
              color: "secondary.contrastText",
              bgcolor: "secondary.main",
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "background.contrastText",
              fontSize: 18,
              "& .MuiSelect-select": {
                p: 1.3,
              },
            },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "background.contrastText !important" },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "background.contrastText !important" },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "background.contrastText !important" },
            "& .MuiSvgIcon-root": { color: "background.contrastText" },
          }}
        >
          <Select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            disabled={loading}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {getRoleDisplay(role.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
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
          onClick={handleSave}
          variant="contained"
          disabled={!selectedRoleId || loading}
          sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "primary.main" },
          }}
        >
          {loading ? (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} sx={{ color: "primary.contrastText" }} />
              Guardar Cambios
            </Box>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;
