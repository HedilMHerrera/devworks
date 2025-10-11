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
            },
            include:{
                role: true,
            }
        });
        if(!user){
            return false;
        }

        if(!bcrypt.compare(pass, user.password)){
            return false;
        }
        const roleName = user.role.name
        const { password: _, role: __, roleId: ___, ...safeUser} = user;

        return {role: roleName, ...safeUser};
    }
    async loginGoogle(email){
        const user = await this._prisma.user.findFirst({
            where: {
                OR:[
                    {
                        email
                    } 
                ] 
            },
            include:{
                role: true,
            }
        });
        if(!user){
            return false;
        }
        
        const roleName = user.role.name
        const { password: _, role: __, roleId: ___, ...safeUser} = user;

        return {role: roleName, ...safeUser};
    }
}

module.exports = UserRespository;