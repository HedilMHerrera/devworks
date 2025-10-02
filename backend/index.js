const express = require('express');
const app = express();
const PORT = 3001;
const AuthenticacionService = require('./services/authenticationService');
const UserRepository = require('./repository/userRepository');
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
/*
function verifyToken(req, res, next){
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"token not provied"});
    }
    try{
        const payload = jwt.verify(token, secretKey);
        req.username = payload.username;
        next();
    } catch (e){
        console.log(e)
        return res.status(403).json({message: "Token no Valido"});
    }
}

app.get("/protected", verifyToken, (req, res) => {
    return res.status(200).json({ message: "Acceso correcto" });
});
*/
app.get('/', (req, res) => {
    res.send('Hello World');
});



app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});