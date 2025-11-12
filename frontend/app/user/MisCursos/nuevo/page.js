"use client";
import { Box, IconButton, Paper, Tooltip, Typography, Slide, Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import StepPeakComponent from "./components/StepPeakComponent";
import HeaderTableTitle from "../components/HeaderTableTitle";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { ArrowLeft, ArrowRight, Create } from "@mui/icons-material";
import AcordionData from "../[id]/components/AcordionData";
import { URL_API_ROOT } from "@/app/redirections";
import axios from "axios";
const Page = () => {
  const user = useSessionZ((state) => state.user);
  const [topics, setTopics] = useState([]);
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
  const [checked, setChecked] = useState(true);
  const [direction, setDirection] = useState("down");

  useEffect(() => {
    fetchTopics();
  },[]);

  const fetchTopics = async() => {
    const url = `${ URL_API_ROOT }/api/topic`;
    try {
      const response = await axios.get(url, { withCredentials:true });
      const topicsAux = [];
      for (const topic of response.data){
        const checked = true;
        topicsAux.push({ checked, topic });
      }
      setTopics(topicsAux);
    } catch {
      enqueueSnackbar("Error interno del servidor", { variant:"error" });
    }
  };

  const setCheckedF = async(id) => {
    const topicAux = [...topics];
    const res = [];
    for (const { checked ,topic } of topicAux){
      const isClicked = topic.id === id;
      const newChecked = isClicked ? !checked: checked;
      res.push({ checked: newChecked, topic });
    }
    setTopics(res);
  };

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
      handleStepChange(1);
    }
  };

  const handleStepChange = (newStep) => {
    setDirection("down");
    setChecked(false);

    setTimeout(() => {
      setStep(newStep);
    }, 500);

    setTimeout(() => {
      setDirection("up");
      setChecked(true);
    }, 510);
  };

  const saveChekeds = async(id) => {
    try {
      for (const { checked, topic } of topics) {
        const url = `${ URL_API_ROOT }/api/grouptopics/${ id }/topics/${ topic.id }`;
        if (checked) {
          await axios.post(url, null, { withCredentials:true });
        }
      }
    } catch {
      enqueueSnackbar("error interno del servidor", { variant:"error" });
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
      console.log(response);
      saveChekeds(response.id);
      enqueueSnackbar("Curso Creado Exitosamente", { variant:"success" });
      handleStepChange(2);
    } else {
      enqueueSnackbar(response.message, { variant:"error" });
    }
  };
  return (
    <Box className={ stylesNew.fullContainerFade }>
      <HeaderTableTitle title="Registrar un Grupo" Icon={ CreateNewFolderIcon }>
        <StepPeakComponent step={ step }>
          <Box>
            Datos Basicos
          </Box>
          <Box>
            Configuracion de Tópicos
          </Box>
          <Box>
            Código de Inscripción
          </Box>
        </StepPeakComponent>
      </HeaderTableTitle>
      <Box
        display="flex"
        mt={2}
        overflow="hidden"
        flexDirection="column"
      >
        <Slide direction={ direction } mountOnEnter in={checked && step===0} timeout={500} unmountOnExit>
          <Paper className={ `${styles.centerPageColumn} ${ stylesNew.paperNew }` }
            sx={{
              minWidth:{  md:"600px", sm:"500px", xs:"" },
            }}
          >
            <Input
              width="100%"
              label="Titulo"
              Icon={ TextFieldsIcon }
              value={ title }
              setValue={ setTitle }
              error={ errorTitle }
              placeholder="Titulo"
              setError={ setErrorTitle }/>
            <Input
              label="Descripción"
              Icon={ TextFieldsIcon }
              value={ description }
              setValue={ setDescription }
              error={ errorDescription }
              setError={ setErrorDescription }
              minRows={3}
              maxRows={3}
              multiline
            />
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
            <Box width="100%" justifyContent="space-between" display="flex" mt={ 3 }>
              <ButtonCustom onClick={ () => router.back() }>
                <ArrowLeft />
                Atrás
              </ButtonCustom>
              <ButtonCustom type="primary" onClick={ handleStep1 }>
                Siguiente <ArrowRight />
              </ButtonCustom>
            </Box>
          </Paper>
        </Slide>
        <Slide direction={ direction }  in={checked && step === 1} timeout={500} unmountOnExit>
          <Paper className={ `${styles.centerPageColumn} ${ stylesNew.paperNew }` }
            sx={{
              minWidth:{  md:"600px", sm:"500px", xs:"" },
            }}>
            <Typography variant="h6">
              Configuracion de Tópicos
            </Typography>
            <Typography variant="body2" sx={{ color: "background.contrastText", mb: 2 }}>
              Lista de Tópicos
            </Typography>
            { topics.map(({ checked, topic }) => <Box key={ `${ topic.id }b` }
              display="flex"
              alignItems="center"
              gap="15px"
              width="100%"
            >
              <Checkbox checked={checked} onChange={ () => setCheckedF(topic.id) }/>
              <AcordionData
                key={ `${topic.id}topicC` }
                title={ topic.title }
                description={ topic.description }
                startDate={ topic.startDate }
                content={ topic.content } /></Box>) }
            <Box width="100%" justifyContent="space-between" display="flex" mt={ 3 }>
              <ButtonCustom onClick={ () => handleStepChange(0) }>
                <ArrowLeft />Volver
              </ButtonCustom>
              <ButtonCustom type="primary" onClick={ handleStep2 }>
                <Create />Crear Grupo
              </ButtonCustom>
            </Box>
          </Paper>
        </Slide>
        <Slide direction={ direction }  in={checked && step === 2} timeout={500} unmountOnExit>
          <Paper className={ `${styles.centerPageColumn} ${ stylesNew.paperNew }` }
            sx={{
              minWidth:{  md:"600px", sm:"500px", xs:"" },
            }}>
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
