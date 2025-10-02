const secretKey = 'secret';
const jwt = require('jsonwebtoken');

class AuthenticacionService{
    constructor(repository){
        this._repository = repository;
    }

    async login(username, pass){
        const user = await this._repository.login(username, pass);
        let token = null;
        if(!user){
            return {token, user};
        }
        token = jwt.sign({ username }, secretKey, {expiresIn:"1h"});
        return {token, user};
    }
}

module.exports = AuthenticacionService;
