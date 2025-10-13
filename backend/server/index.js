const express = require('express');
const cors = require('cors');
const app = express();
const VIEW_DIRECTION = 'http://localhost:3000'

app.use(cors({
    origin: VIEW_DIRECTION,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const AuthenticacionService = require('../services/authenticationService');
const UserRepository = require('../repository/userRepository');
const bcrypt = require('bcrypt');
const repository = new UserRepository();
app.use(express.json());

app.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const pass = req.body.password;
        if (!username || !pass) {
            return res.status(400).json({ message: 'Nombre de Usuario y contrasenia son requeridos' });
        }
        const acc = new AuthenticacionService(repository);
        const { token, user } = await acc.login(username, pass);
        if (!token) {
            return res.status(401).json({ message: "Nombre de usuario o contrasenia incorrectas" });
        }
        return res.status(200).json({ token, user });
    } catch (e) {
        return res.status(500).json({ message: `Internal server error ${e}` });
    }
});

app.post('/logingoogle', async (req, res) => {
    try {
        const tokenUser = req.body.token;
        if (!tokenUser) {
            return res.status(400).json({ message: 'Inicio Invalido' });
        }
        const acc = new AuthenticacionService(repository);
        const { token, user } = await acc.loginGoogleS(tokenUser);
        if (!token) {
            return res.status(401).json({ message: "Nombre de usuario o contrasenia incorrectas" });
        }
        return res.status(200).json({ token, user });
    } catch (e) {
        return res.status(500).json({ message: `Internal server error ${e}` });
    }
});

app.get('/check-email', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json({ message: 'Email requerido' });

        const user = await repository.findByEmail(email);
        if (user) return res.status(409).json({ message: 'El email ya esta registrado' });
        return res.status(200).json({ message: 'Email disponible' });
    } catch (e) {
        return res.status(500).json({ message: `Error interno del servidor: ${e.message}` });
    }
});

app.get('/check-username', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) return res.status(400).json({ message: 'Nombre de usuario requerido' });

        const user = await repository.findByUsername(username);
        if (user) return res.status(409).json({ message: 'El nombre de usuario ya existe' });
        return res.status(200).json({ message: 'Nombre de usuario disponible' });
    } catch (e) {
        return res.status(500).json({ message: `Error interno del servidor: ${e.message}` });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }
        const existingUser = await repository.findByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(409).json({ message: 'El usuario o email ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await repository.createUser(username, email, hashedPassword);

        const acc = new AuthenticacionService(repository);
        const { token, user } = await acc.login(username, password);

        if (!token) {
            return res.status(500).json({ message: 'No se pudo iniciar sesión después del registro' });
        }

        return res.status(201).json({ token, user, message: 'Usuario creado e iniciado sesión exitosamente' });
    } catch (e) {
        console.error('❌ ERROR EN /register:', e);
        return res.status(500).json({ message: `Error interno del servidor: ${e.message}` });
    }
});

app.get('/', (req, res) => {
    res.send('Bienvenido a PyCraft');
});

module.exports = app;
