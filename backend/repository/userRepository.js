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
        // Si no se encuentra el usuario O si el usuario no tiene una contraseña (es una cuenta de Google)
        if(!user || !user.password){
            return false;
        }

        // Compara la contraseña proporcionada con la almacenada en la base de datos.
        if(!await bcrypt.compare(password, user.password)){
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

    async findByUsernameOrEmail(username, email) {
        return await this._prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        });
    }

    async findByEmail(email) {
        return await this._prisma.user.findFirst({
            where: { email: email }
        });
    }

    async findByUsername(username) {
        return await this._prisma.user.findFirst({
            where: { username: username }
        });
    }

    async createUser(username, email, password) {
        const studentRole = await this._prisma.role.findUnique({
            where: { name: 'student' },
        });

        if (!studentRole) {
            throw new Error("El rol 'student' no existe. Asegúrate de haber ejecutado el seeder de la base de datos.");
        }

        return await this._prisma.user.create({
            data: {
                username,
                email,
                password,
                roleId: studentRole.id,
            }
        });
    }
}

module.exports = UserRespository;
