const secretKey = 'secret';
const jwt = require('jsonwebtoken');
const tokenDecode = require('jwt-decode');
class AuthenticacionService{
    constructor(repository){
        this._repository = repository;
    }

    async login(username, pass){
        const user = await this._repository.login(username, pass);
        let token = null;
        if(user){
            token = jwt.sign({ username }, secretKey, {expiresIn:"1h"});
        }
        return {token, user};
    }

    async loginGoogleS(tokenUser){
        const { email, email_verified } = tokenDecode.jwtDecode(tokenUser);
        let token = null;
        if(!email_verified){
            return { token, user:null };
        }
        const user = await this._repository.loginGoogle(email);
        if(user){
            token = jwt.sign({ email }, secretKey, {expiresIn:"1h"});
        }
        return {token, user};
    }

    /*verifyToken(req, res, next){
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Token no existe"});
    }
    try{
        const payload = jwt.verify(token, secretKey);
        req.username = payload.username;
        next();
    } catch (e){
        return res.status(403).json({message: "Token no Valido :"+e});
    }
}*/
}

module.exports = AuthenticacionService;
