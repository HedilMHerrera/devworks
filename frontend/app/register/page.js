"use client";
import { Box, Container, Paper, Typography, Link, Checkbox, FormControlLabel } from "@mui/material";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SnakeIcon from "../snakeicon/SnakeIcon";
import Input from "../components/Input";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import ButtonCustom from "../components/Button";
import { register, checkEmail, checkUsername } from "./register";
import { useSnackbar } from "notistack";
import PersonIcon from "@mui/icons-material/Person";
import { ArrowForward } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { GoogleLogin } from "@react-oauth/google";
import { loginGoogle } from "../login/login";
import { useSessionZ } from "../context/SessionContext";

const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

export default function Page() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [fullname, setFullname] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [agreeNews, setAgreeNews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const setSession = useSessionZ((state) => state.setSession);
  const router = useRouter();

  const rules = useMemo(() => ({
    length: (s) => s.length >= 10,
    uppercase: (s) => /[A-Z]/.test(s),
    special: (s) => /[^A-Za-z0-9]/.test(s),
    number: (s) => /[0-9]/.test(s),
  }), []);

  const rulesState = useMemo(() => ({
    length: rules.length(password),
    uppercase: rules.uppercase(password),
    special: rules.special(password),
    number: rules.number(password),
  }), [password, rules]);

  const allRulesOk = Object.values(rulesState).every(Boolean);

  const handleEmailChange = (v) => {
    setEmail(v);
    const t = (v || "").trim();
    if (t.length === 0) {return setEmailError("");}
    if (!gmailRegex.test(t)) {setEmailError("El correo electrónico no es válido");}
    else {setEmailError("");}
  };

  const handleEmailContinue = async() => {
    const t = (email || "").trim();
    if (!t || !gmailRegex.test(t)) {
      setEmailError("Ingrese su correo electrónico");
      return;
    }
    setEmailError("");
    setIsLoading(true);
    try {
      const res = await checkEmail(t);
      if (!res.success) {
        if (res.code === 409) {
          setEmailError("El email ya está registrado");
        } else {
          setEmailError(res.message || "Error al validar el correo");
        }
        setIsLoading(false);
        return;
      }

      setStep(2);
    } catch (_) {
      setEmailError("Error al validar el correo");
    }
    setIsLoading(false);
  };

  const handlePasswordContinue = () => {
    if (!allRulesOk) {
      setPasswordError("La contraseña no cumple los requisitos");
      return;
    }
    setPasswordError("");
    setStep(3);
  };

  const handleCreateAccount = async() => {
    setUsernameError("");
    setFullnameError("");
    const u = (username || "").trim();
    const f = (fullname || "").trim();
    if (!u) {return setUsernameError("Debe ingresar el nombre de usuario");}
    if (!f) {return setFullnameError("Debe ingresar el nombre completo");}
    const usernameRegex = /^[A-Za-z0-9]+$/;
    if (!usernameRegex.test(u)) {return setUsernameError("Nombre de usuario inválido: solo letras y números.");}

    const fullnameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    if (!fullnameRegex.test(f)) {return setFullnameError("Nombre completo inválido: solo letras y espacios");}

    setIsLoading(true);
    try {
      const resCheck = await checkUsername(u);
      if (!resCheck.success) {
        if (resCheck.code === 409) {
          setUsernameError("El nombre de usuario ya existe");
        } else {
          setUsernameError(resCheck.message || "Error al validar el nombre de usuario");
        }
        setIsLoading(false);
        return;
      }

      const res = await register(u, email.trim(), password);
      if (res.success) {
        const { token, user } = res.data;
        enqueueSnackbar(`Bienvenido "${user.username}"`, { variant: "success" });
        setSession(token, user);
        router.push("/user");
      } else {
        if (res.code === 409) {
          const msg = (res.message || "").toLowerCase();
          if (msg.includes("email")) {setEmailError("El email ya está registrado");}
          else if (msg.includes("usuario") || msg.includes("nombre")) {setUsernameError("El nombre de usuario ya existe");}
          else {enqueueSnackbar(res.message || "Error al registrar", { variant: "error" });}
        } else {
          enqueueSnackbar(res.message || "Error al registrar", { variant: "error" });
        }
      }
    } catch (_) {
      enqueueSnackbar("Error del servidor", { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async(token) => {
    setIsLoading(true);
    const { message, success, ...more } = await loginGoogle(token);
    if (success) {
      const { data: { token, user } } = more;
      enqueueSnackbar(`Bienvenido "${user.username}"`, { variant: "success" });
      setSession(token, user);
      router.push("/user");
    } else {
      enqueueSnackbar(message, { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}>
        <SnakeIcon width={40} height={40} />
        <Typography variant="h4">PyCraft</Typography>
      </Box>

      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 5 },
          gap: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {step === 1 && (
          <>
            <Typography variant="h5" sx={{ fontWeight: 400 }}>Crear cuenta en PyCraft</Typography>
            <Input
              label="Email"
              Icon={EmailIcon}
              value={email}
              setValue={handleEmailChange}
              setError={setEmailError}
              error={emailError}
              showHelperText={false}
            />
            <ButtonCustom
              type="primary"
              onClick={handleEmailContinue}
              loading={isLoading}
            >
                        Registrarse
            </ButtonCustom>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box component="hr" sx={{ flexGrow: 1, borderColor: "secondary.main" }} />
              <Typography sx={{ fontSize: 13, color: "background.contrastText", mx: 1 }}>También</Typography>
              <Box component="hr" sx={{ flexGrow: 1, borderColor: "secondary.main" }} />
            </Box>
            <GoogleLogin onSuccess={credentialResponse => {
              handleGoogleLogin(credentialResponse.credential);
            }} />

            <Box sx={{ display: "flex", justifyContent: "start", mt: 1 }}>
              <Typography sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 1 }}>
                            ¿Ya tienes una cuenta PyCraft?
                <Link component="button" underline="none" onClick={() => router.push("/login")} sx={{ display: "flex", alignItems: "center", color: "primary.main", fontWeight: 500, ml: 0.5 }}>
                                Iniciar sesión
                  <ArrowForward sx={{ ml: 0.5 }} />
                </Link>
              </Typography>
            </Box>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h5" sx={{ fontWeight: 400 }}>Crear cuenta en PyCraft</Typography>
            <Input
              label="Contraseña"
              Icon={KeyIcon}
              value={password}
              setValue={setPassword}
              setError={setPasswordError}
              type="pass"
            />

            <Box sx={{ fontSize: 13, color: "background.contrastText" }}>Su contraseña debe contener:</Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box
                sx={{ display: "flex",
                  lignItems: "center",
                  gap: 1,
                  color: rulesState.length ? "primary.main" : "background.contrastText" }}
              >
                {rulesState.length ? <CheckCircleIcon sx={{ fontSize: 12 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 12 }} />}
                <Box sx={{ fontSize: 13 }}>Al menos 10 caracteres</Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: rulesState.uppercase ? "primary.main" : "background.contrastText",
                }}
              >
                {rulesState.uppercase ? <CheckCircleIcon sx={{ fontSize: 12 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 12 }} />}
                <Box sx={{ fontSize: 13 }}>Al menos un carácter en mayúscula</Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: rulesState.special ? "primary.main" : "background.contrastText",
                }}
              >
                {rulesState.special ? <CheckCircleIcon sx={{ fontSize: 12 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 12 }} />}
                <Box sx={{ fontSize: 13 }}>Al menos un carácter especial</Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: rulesState.number ? "primary.main" : "background.contrastText",
                }}
              >
                {rulesState.number ? <CheckCircleIcon sx={{ fontSize: 12 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 12 }} />}
                <Box sx={{ fontSize: 13 }}>Al menos un numero</Box>
              </Box>
            </Box>

            <ButtonCustom type="primary" onClick={handlePasswordContinue}>Continuar</ButtonCustom>
          </>
        )}

        {step === 3 && (
          <>
            <Typography variant="h5" sx={{ fontWeight: 400 }}>Crear cuenta en PyCraft</Typography>
            <Input label="Nombre de Usuario" Icon={PersonIcon} value={username} setValue={(v) => {
              setUsername(v);
              const t = (v || "").trim();
              if (t.length === 0)
              {return setUsernameError("");}
              if (!/^[A-Za-z0-9]+$/.test(t))
              {return setUsernameError("No se permiten espacios, símbolos ni puntos");}
              setUsernameError("");
            }} setError={setUsernameError} error={usernameError} showHelperText={false} />

            <Input label="Nombre Completo" value={fullname} setValue={(v) => {
              setFullname(v);
              const t = (v || "").trim();
              if (t.length === 0)
              {return setFullnameError("");}
              if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(t))
              {return setFullnameError("No se permiten números ni símbolos especiales.");}
              setFullnameError("");
            }} setError={setFullnameError} error={fullnameError} showHelperText={false} />

            <FormControlLabel control={<Checkbox checked={agreeNews} onChange={(e) => setAgreeNews(e.target.checked)} />} label={<Typography sx={{ fontSize: 13 }}>Deseo recibir correos electrónicos sobre actualizaciones de productos.</Typography>} />

            <ButtonCustom type="primary" onClick={handleCreateAccount} loading={isLoading}>Crear Cuenta</ButtonCustom>

            <Typography
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
                        ¿Cometió un error?
              <Link
                component="button"
                underline="none"
                onClick={() => setStep(1)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "primary.main",
                  fontWeight: 500, ml: 0.5,
                }}
              >
                            Empezar de nuevo
                <ArrowForward sx={{ ml: 0.5 }} />
              </Link>
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  );
}
