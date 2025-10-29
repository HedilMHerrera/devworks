require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const VIEW_DIRECTION = "http://localhost:3000";

const cookieParser = require("cookie-parser");
const MAX_TIME = 1000;
const nodemailer = require("nodemailer");

app.use(cors({
  origin: VIEW_DIRECTION,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

const AuthenticacionService = require("../services/authenticationService");
const UserRepository = require("../repository/userRepository");
const bcrypt = require("bcrypt");
const routerUser = require("./Routers/user");
const routerAdmin = require("./Routers/admin");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const repository = new UserRepository();
app.use(cookieParser());
app.use(express.json());
app.use("", routerUser);
app.use("", routerAdmin);

app.post("/login", async(req, res) => {
  try {
    const email = req.body.email;
    const pass = req.body.password;
    if (!email || !pass) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }
    const acc = new AuthenticacionService(repository);
    const { token, user } = await acc.login(email, pass);
    if (!token) {
      return res.status(401).json({ message: "Nombre de usuario o contrasenia incorrectas" });
    }

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * MAX_TIME,
    });

    return res.status(200).json({ token, user });
  } catch (e) {
    return res.status(500).json({ message: `Internal server error ${e}` });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  return res.status(200).json({ message: "sesion cerrada" },
  );
});

app.post("/logingoogle", async(req, res) => {
  try {
    const tokenUser = req.body.token;
    if (!tokenUser) {
      return res.status(400).json({ message: "Inicio Invalido" });
    }
    const acc = new AuthenticacionService(repository);
    const { token, user } = await acc.loginGoogleS(tokenUser);
    if (!token || !user) {
      return res.status(401).json({ message: "Token de Google inválido o error en la autenticación." });
    }

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * MAX_TIME,
    });

    return res.status(200).json({ token, user });
  } catch (e) {
    return res.status(500).json({ message: `Error interno del servidor: ${e.message}` });
  }
});

app.get("/check-email", async(req, res) => {
  try {
    const email = req.query.email;
    if (!email) {return res.status(400).json({ message: "Email requerido" });}

    const user = await repository.findByEmail(email);
    if (user) {return res.status(409).json({ message: "El email ya esta registrado" });}
    return res.status(200).json({ message: "Email disponible" });
  } catch (e) {
    return res.status(500).json({ message: `Error interno del servidor: ${e.message}` });
  }
});

app.get("/check-verification-status", async(req, res) => {
  try {
    const { email } = req.query;
    const user = await repository.findByEmail(email);
    return res.status(200).json({ isVerified: user?.isVerified || false });
  } catch (e) {
    return res.status(500).json({ message: `Error interno del servidor: ${e.message}` });
  }
});

app.post("/register", async(req, res) => {
  try {
    const { email } = req.body;

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verifica tu cuenta de PyCraft",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; color: #333; background-color: #f4f4f4;">
          <h2 style="color: #4CAF50;">¡Bienvenido a PyCraft!</h2>
          <p>Gracias por registrarte. Usa el siguiente código para verificar tu cuenta.</p>
          <div style="background-color: #ffffff; border: 1px dashed #ccc; padding: 20px; margin: 20px auto; max-width: 200px;">
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 0;">${verificationCode}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">Si no te registraste en PyCraft, puedes ignorar este correo.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Código de verificación enviado.",
      verificationCode: verificationCode,
    });

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("ERROR EN /register:", e);
    return res.status(500).json({ message: `Error interno del servidor: ${e.message}` });
  }
});

app.post("/verify-email", async(req, res) => {

  try {
    const existingUser = await repository.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(409).json({ message: "El usuario o email ya existe" });
    }

    const { name, lastName, email, password, code, originalCode } = req.body;

    if (!name || !lastName || !email || !password || !code || !originalCode) {
      return res.status(400).json({ message: "Todos los campos son requeridos para la verificación." });
    }

    if (code !== originalCode) {
      return res.status(400).json({ message: "Código de verificación inválido." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await repository.createUser({
      name,
      lastName,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    const acc = new AuthenticacionService(repository);
    const { token, user } = await acc.login(email, password, true);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * MAX_TIME,
    });

    return res.status(200).json({ message: "Email verificado exitosamente.", token, user });
  } catch (e) {
    return res.status(500).json({ message: `Error interno del servidor: ${e.message}` });
  }
});

app.get("/", (req, res) => {
  res.send("Bienvenido a PyCraft");
});

module.exports = app;

