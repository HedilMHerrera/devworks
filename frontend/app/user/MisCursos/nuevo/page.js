"use client";
import { Box, IconButton, Paper, Tooltip, Typography, Slide } from "@mui/material";
import React, { useState } from "react";
import styles from "@/app/global.module.css";
import stylesNew from "./new.module.css";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Input from "@/app/components/Input";
import ButtonCustom from "@/app/components/Button";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { TextValidator, NotIsVoid, HaveBetweenLength, DateIsNotBeforeNow, StartDateIsBeforeEndDate } from "@/app/validators/TextInputValidator";
import { sendGroup } from "./createGroup";
import { useSessionZ } from "@/app/context/SessionContext";

const Page = () => {
  const user = useSessionZ((state) => state.user);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [errorStartDate, setErrorStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorEndDate, setErrorEndDate] = useState("");
  const [code, setCode] = useState({ copied:false, code:"" });
  const [step, setStep] = useState(0);
  const handleCopied = async() => {
    await navigator.clipboard.writeText(code.code);
    setCode({ ...code, copied: !code.copied });
  };

  const handleCleanErrors = () => {
    setErrorTitle("");
    setErrorDescription("");
    setErrorStartDate("");
    setErrorEndDate("");
  };

  const handleStep1 = async() => {
    handleCleanErrors();

    const validatorTitle = new TextValidator();
    validatorTitle
      .addValidator(new NotIsVoid())
      .addValidator(new HaveBetweenLength(4, 40));
    const response = validatorTitle.validate(title);
    setErrorTitle(response.error);

    const validatorDescription = new TextValidator();
    validatorDescription
      .addValidator(new NotIsVoid())
      .addValidator(new HaveBetweenLength(10, 100));
    const responseDescription = validatorDescription.validate(description);
    setErrorDescription(responseDescription.error);

    const startDateValidator = new TextValidator();
    startDateValidator
      .addValidator(new NotIsVoid())
      .addValidator(new DateIsNotBeforeNow());
    const responseStartDate = startDateValidator.validate(startDate);
    setErrorStartDate(responseStartDate.error);

    const endDateValidator = new TextValidator();
    endDateValidator
      .addValidator(new NotIsVoid())
      .addValidator(new DateIsNotBeforeNow())
      .addValidator(new StartDateIsBeforeEndDate(startDate, endDate));
    const responseEndDate = endDateValidator.validate(endDate);
    setErrorEndDate(responseEndDate.error);

    const isValid = [response, responseStartDate, responseDescription, responseEndDate]
      .every((res) => res.isValid);
    if (isValid){
      setStep(1);
    }
  };

  const handleStep2 = async() => {
    const payload = {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      idTutor: user.id,
    };
    const response = await sendGroup(payload);
    if (response.success){
      setCode({ ...code, code: response.code } );
      enqueueSnackbar("Curso Creado Exitosamente", { variant:"success" });
      setStep(2);
    } else {
      enqueueSnackbar(response.message, { variant:"error" });
    }
  };
  return (
    <Box className={ stylesNew.fullContainerFade }>
      <Box
        display="flex"
        sx={{
          width:"500px",
        }}
      >
        <Slide direction="left" mountOnEnter in={step===0} timeout={100} unmountOnExit>
          <Paper className={ `${styles.centerPageColumn} ${ stylesNew.paperNew }` }>
            <Typography variant="h6" >
                Crear Clase
            </Typography>
            <Input
              width="100%"
              label="Titulo"
              Icon={ TextFieldsIcon }
              value={ title }
              setValue={ setTitle }
              error={ errorTitle }
              setError={ setErrorTitle }/>
            <Input
              label="Descripción"
              Icon={ TextFieldsIcon }
              value={ description }
              setValue={ setDescription }
              error={ errorDescription }
              setError={ setErrorDescription }
              minRows={5}
              maxRows={5}
              multiline
            />
            <Box className={ stylesNew.dateContent }>
              <Input
                label="Fecha de Inicio"
                Icon={ DateRangeIcon }
                value={ startDate }
                setValue={ setStartDate }
                error={ errorStartDate }
                setError={ setErrorStartDate }
                type="date"
              />
              <Input
                label="Fecha de Fin"
                Icon={ DateRangeIcon }
                value={ endDate }
                setValue={ setEndDate }
                error={ errorEndDate }
                setError={ setErrorEndDate }
                type="date"
              />
            </Box>
            <Box width="100%" justifyContent="end" display="flex" mt={ 3 }>
              <ButtonCustom type="primary" onClick={ handleStep1 }>
                Siguiente
              </ButtonCustom>
            </Box>
          </Paper>
        </Slide>
        <Slide direction="left" mountOnEnter in={step === 1} timeout={100} unmountOnExit>
          <Paper className={ `${styles.centerPageColumn} ${ stylesNew.paperNew }` }>
            <Typography variant="h6">
              Configuracion de Tópicos
            </Typography>
            Acá configuramos los topicos que se verán
            <Box width="100%" justifyContent="space-between" display="flex" mt={ 3 }>
              <ButtonCustom onClick={ () => setStep(0) }>
                Volver
              </ButtonCustom>
              <ButtonCustom type="primary" onClick={ handleStep2 }>
                Crear Grupo
              </ButtonCustom>
            </Box>
          </Paper>
        </Slide>
        <Slide direction="left" mountOnEnter in={step === 2} timeout={100} unmountOnExit>
          <Paper className={ `${styles.centerPageColumn} ${ stylesNew.paperNew }` }>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
            >
              <CheckCircleIcon color="success" /> Grupo creado con Exito.
            </Box>
            <Typography variant="h6">
              Código de inscripción
            </Typography>
            <Box className={ styles.centerPageRow }
              gap={ 3 }
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              sx={{
                border:"2px dashed",
              }}
            >
              <Typography color="background.contrastText" variant="h2">{ code.code }</Typography>
              <Tooltip title={ code.copied ? "Copiado":"Copiar" }>
                <IconButton size="medium" onClick={ handleCopied }>
                  { code.copied ? <CheckIcon color="success"/>: <ContentCopyIcon color="primary" /> }
                </IconButton>
              </Tooltip>
            </Box>
            <Box width="100%" display="flex" justifyContent="end" mt={ 3 }>
              <ButtonCustom type="primary" onClick={ () => router.push("/user/MisCursos")}>
                Volver a Cursos
              </ButtonCustom>
            </Box>
          </Paper>
        </Slide>
      </Box>
    </Box>
  );
};

export default Page;
