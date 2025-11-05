"use client";
import { Box, Container, Paper, Typography, Link, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert } from "@mui/material";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SnakeIcon from "../snakeicon/SnakeIcon";
import Input from "../components/Input";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import ButtonCustom from "../components/Button";
import { register, checkEmail, verifyEmail } from "./register";
import { useSnackbar } from "notistack";
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
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [agreeNews, setAgreeNews] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [shakeTerms, setShakeTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [originalVerificationCode, setOriginalVerificationCode] = useState("");
  const [openTermsDialog, setOpenTermsDialog] = useState(false);
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
    } catch {
      setEmailError("Error al validar el correo");
    }
    setIsLoading(false);
  };

  const handlePasswordContinue = () => {
    if (!allRulesOk) {
      setPasswordError("La contraseña no cumple con todos los requisitos.");
      return;
    }
    setPasswordError("");
    setStep(3);
  };

  const handleCreateAccount = async() => {
    setNameError("");
    setLastNameError("");
    let hasErrors = false;
    const n = (name || "").trim();
    const l = (lastName || "").trim();

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    if (!n) {setNameError("Debe ingresar su nombre"); hasErrors = true;}
    else if (!nameRegex.test(n)) {setNameError("Nombre inválido: solo letras y espacios"); hasErrors = true;}

    if (!l) {setLastNameError("Debe ingresar sus apellidos"); hasErrors = true;}
    else if (!nameRegex.test(l)) {setLastNameError("Apellidos inválidos: solo letras y espacios"); hasErrors = true;}

    if (hasErrors) {
      return;
    }

    if (!agreeTerms) {
      setShakeTerms(true);
      setTimeout(() => setShakeTerms(false), 500);
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(email.trim());
      if (res.success) {
        setOriginalVerificationCode(res.data.verificationCode);
        setStep(4);
        enqueueSnackbar(res.message || "Revisa tu correo para el código de verificación.", { variant: "success" });
      } else {
        if (res.code === 409) {
          const msg = (res.message || "").toLowerCase();
          if (msg.includes("email")) {setEmailError("El email ya está registrado");} else {enqueueSnackbar(res.message || "Error al registrar", { variant: "error" });}
        } else {
          enqueueSnackbar(res.message || "Error al registrar", { variant: "error" });
        }
      }
    } catch {
      enqueueSnackbar("Error del servidor", { variant: "error" });
    }
    setIsLoading(false);
  };

  const handleVerifyCode = async() => {
    if (verificationCode.length !== 6) {
      setVerificationError("El código debe tener 6 dígitos.");
      return;
    }
    setVerificationError("");
    setIsLoading(true);

    const verifyResult = await verifyEmail(
      name.trim(),
      lastName.trim(),
      email.trim(),
      password,
      verificationCode,
      originalVerificationCode,
    );

    if (verifyResult.success) {
      const { token, user } = verifyResult.data;
      setSession(token, user);
      enqueueSnackbar(`¡Bienvenido, ${user.name}!`, { variant: "success" });
      router.push("/user");
    } else {
      setVerificationError(verifyResult.message || "Error al verificar el código.");
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async(token) => {
    setIsLoading(true);
    const { message, success, ...more } = await loginGoogle(token);
    if (success) {
      const { data: { token, user } } = more;
      enqueueSnackbar(`Bienvenido "${user.name}"`, { variant: "success" });
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
              error={passwordError}
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
            <Input label="Nombre" value={name} setValue={(v) => {
              setName(v);
              const t = (v || "").trim();
              if (t.length === 0)
              {return setNameError("");}
              if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(t))
              {return setNameError("No se permiten números ni símbolos especiales.");}
              setNameError("");
            }} setError={setNameError} error={nameError} showHelperText={false} />

            <Input label="Apellidos" value={lastName} setValue={(v) => {
              setLastName(v);
              const t = (v || "").trim();
              if (t.length === 0)
              {return setLastNameError("");}
              if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(t))
              {return setLastNameError("No se permiten números ni símbolos especiales.");}
              setLastNameError("");
            }} setError={setLastNameError} error={lastNameError} showHelperText={false} />

            <FormControlLabel
              control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />}
              sx={{
                animation: shakeTerms ? "shake 0.5s" : "none",
                "@keyframes shake": {
                  "0%, 100%": { transform: "translateX(0)" },
                  "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
                  "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
                },
              }}
              label={
                <Typography sx={{ fontSize: 13 }}>
                  Acepto y estoy de acuerdo con los{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTermsDialog(true);
                    }}
                    sx={{ color: "primary.main", fontWeight: "medium", verticalAlign: "baseline" }}
                  >
                    términos y condiciones
                  </Link>{" "}
                  de privacidad.
                </Typography>
              }
            />

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

        {step === 4 && (
          <>
            <Typography variant="h5" sx={{ fontWeight: 400 }}>Verifica tu cuenta</Typography>
            <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
              Hemos enviado un código de 6 dígitos a <strong>{email}</strong>. Por favor, ingrésalo a continuación.
            </Alert>
            <Input
              label="Código de Verificación"
              value={verificationCode}
              setValue={setVerificationCode}
              error={verificationError}
              setError={setVerificationError}
              showHelperText={false}
            />
            <ButtonCustom
              type="primary"
              onClick={handleVerifyCode}
              loading={isLoading}
            >
              Verificar e Iniciar Sesión
            </ButtonCustom>
          </>
        )}
      </Paper>
      <Dialog
        open={openTermsDialog}
        onClose={() => setOpenTermsDialog(false)}
        aria-labelledby="terms-dialog-title"
        aria-describedby="terms-dialog-description"
      >
        <DialogTitle id="terms-dialog-title">Términos y Condiciones de Privacidad</DialogTitle>
        <DialogContent>
          <DialogContentText id="terms-dialog-description" component="div">
            <Typography variant="body2" gutterBottom>
              <strong>Última actualización:</strong> 17 Octubre 2025
            </Typography>
            <Typography variant="body2" paragraph>
              Bienvenido a PyCraft. Estos términos y condiciones describen las reglas y regulaciones para el uso de nuestro sitio web y servicios. Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTermsDialog(false)} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
