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
const repository = new UserRepository();
app.use(express.json());



app.post('/login',async (req,res) => {
    try{
        const username = req.body.username;
        const pass = req.body.password;
        if(!username || !pass){
            return res.status(400).json({message:'Nombre de Usuario y contrasenia son requeridos'});
        }
        const acc = new AuthenticacionService(repository);
        const { token ,user } = await acc.login(username, pass);
        if(!token){
            return res.status(401).json({ message: "Nombre de usuario o contrasenia incorrectas" });
        }
        return res.status(200).json({ token, user });
    }catch(e){
            return res.status(500).json( {message:`Internal server error ${e}`});
    }
});


/*app.get("/protected", AuthenticacionService.verifyToken, (req, res) => {
    return res.status(200).json({ message: "Acceso correcto" });
});*/

app.get('/',(req,res) => {
    res.send('Bienvenido a PyCraft');
});




let users = [
    {
        id: 1,
        firstName: "Juan ",
        LastName: "Perez Garcia",
        email: "perezjuan@gmail.com",
        password:"PZR234"
    }
]

app.get('/api/user/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(us => us.id == id);

    if(!user){
        return res.status(404).send(`usuario no encontrado`);
    }

    res.json(user);

});



module.exports = app;
