"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Close as CloseIcon } from "@mui/icons-material";
import Input from "@/app/components/Input";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import DescriptionIcon from "@mui/icons-material/Description";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { TextValidator, NotIsVoid, HaveBetweenLength, DateIsNotAfterOf, DateIsNotBeforeOf } from "@/app/validators/TextInputValidator";
import { URL_API_ROOT } from "@/app/redirections";
import { enqueueSnackbar } from "notistack";
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

const EditGroupModal = ({ open, onClose, group, loading = false, setUpdated, updated }) => {
  const [groupEdited, setGroupEdited] = useState(null);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorStartDate, setErrorStartDate] = useState("");
  const [errorEndDate, setErrorEndDate] = useState("");
  const handleSave = async() => {
    const titleValidator = new TextValidator()
      .addValidator(new NotIsVoid())
      .addValidator(new HaveBetweenLength(4, 40));
    const descriptionValidator = new TextValidator()
      .addValidator(new NotIsVoid())
      .addValidator(new HaveBetweenLength(10, 200));
    const startDateValidator = new TextValidator()
      .addValidator(new NotIsVoid())
      .addValidator(new DateIsNotAfterOf(groupEdited.endDate));
    const endDateValidator = new TextValidator();
    endDateValidator
      .addValidator(new NotIsVoid())
      .addValidator(new DateIsNotBeforeOf(groupEdited.startDate));

    const endDateValidate = endDateValidator.validate(groupEdited.endDate);
    setErrorEndDate(endDateValidate.error);
    const startDateValidate = startDateValidator.validate(groupEdited.startDate);
    setErrorStartDate(startDateValidate.error);
    const descriptionValidate = descriptionValidator.validate(groupEdited.description);
    setErrorDescription(descriptionValidate.error);
    const titleValidate = titleValidator.validate(groupEdited.title);
    setErrorTitle(titleValidate.error);

    const isValid = [
      titleValidate,
      descriptionValidate,
      startDateValidate,
      endDateValidate].every((data) => data.isValid);
    if (isValid){
      const url = `${URL_API_ROOT}/api/group/update`;
      const startDateFormated = new Date(groupEdited.startDate).toISOString();
      const endDateFormated = new Date(groupEdited.endDate).toISOString();
      const groupformated = { ...groupEdited, startDate: startDateFormated, endDate: endDateFormated };
      try {
        const response = await axios.put(
          url,
          groupformated,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );
        setUpdated(!updated);
        enqueueSnackbar(response.data.message, { variant:"success" });
        onClose();
      } catch (_){
        enqueueSnackbar("error del servidor", { variant:"error" });
      }
    }
  };

  const handleChange = (title, description, startDate, endDate) => {
    setGroupEdited({ ...groupEdited, title, description, startDate, endDate });
  };

  useEffect(() => {
    setGroupEdited(group);
  },[group]);

  if (!group) {
    return null;
  }
  if (!groupEdited){
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
        <Input
          value={groupEdited.title}
          fullWidth
          margin="normal"
          Icon={ TextFieldsIcon }
          label="Título"
          error={ errorTitle }
          setError={ setErrorTitle }
          onChange={(e) =>
            handleChange(e.target.value,
              groupEdited.description,
              groupEdited.startDate,
              groupEdited.endDate) }
          sx={disabledTextFieldStyles}
        />
        <Input
          multiline
          maxRows={3}
          minRows={3}
          error={ errorDescription }
          setError={ setErrorDescription }
          value={groupEdited.description}
          fullWidth
          margin="normal"
          sx={disabledTextFieldStyles}
          Icon={ DescriptionIcon }
          label="Descripción"
          onChange={(e) =>
            handleChange(groupEdited.title,
              e.target.value,
              groupEdited.startDate,
              groupEdited.endDate) }
        />
        <Input
          value={new Date(groupEdited.startDate).toISOString().split("T")[0]}
          fullWidth
          margin="normal"
          type="date"
          label="fecha de incio"
          Icon={ DateRangeIcon }
          sx={disabledTextFieldStyles}
          error={ errorStartDate }
          setError={ setErrorStartDate }
          onChange={(e) =>
            handleChange(groupEdited.title,
              groupEdited.description,
              e.target.value,
              groupEdited.endDate) }
        />
        <Input
          value={new Date(groupEdited.endDate).toISOString().split("T")[0]}
          fullWidth
          margin="normal"
          type="date"
          label="fecha Fin"
          Icon={ DateRangeIcon }
          error={ errorEndDate }
          setError={ setErrorEndDate }
          sx={disabledTextFieldStyles}
          onChange={(e) =>
            handleChange(groupEdited.title,
              groupEdited.description,
              groupEdited.startDate,
              e.target.value) }
        />
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
          onClick={ handleSave }
          variant="contained"
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

export default EditGroupModal;
