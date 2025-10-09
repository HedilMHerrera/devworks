/* eslint-disable no-unused-vars */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
class UserRespository{
    constructor(){
        this._prisma = new PrismaClient();
    }
    async login(username, password){
        const pass = await bcrypt.hash(password, 10);
        const user = await this._prisma.user.findFirst({
            where: {
                OR:[
                    {
                        username: username,
                    },{
                        email: username,
                    }   
                ] 
            }
        });
        if(!user){
            return false;
        }

        if(!bcrypt.compare(pass, user.password)){
            return false;
        }

        const { password: _, ...safeUser} = user;
        return safeUser;
    }
}

module.exports = UserRespository;