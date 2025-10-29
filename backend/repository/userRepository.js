/* eslint-disable no-unused-vars */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
class UserRespository{
  constructor(){
    this._prisma = new PrismaClient();
  }
  async login(email, password, isVerifiedLogin = false){
    const user = await this._prisma.user.findFirst({
      where: {
        email: email,
      },
      include:{
        role: true,
      },
    });

    if (!user){
      return null;
    }

    if (!user.isVerified && !isVerifiedLogin) {
      return null;
    }

    if (!isVerifiedLogin && user.password && !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    const roleName = user.role.name;
    const { password: _, role: __, roleId: ___, ...safeUser } = user;

    return { role: roleName, ...safeUser };
  }
  async loginGoogle(email){
    const user = await this._prisma.user.findFirst({
      where: {
        OR:[
          {
            email,
          },
        ],
      },
      include:{
        role: true,
      },
    });
    if (!user){
      return false;
    }

    const roleName = user.role.name;
    const { password: _, role: __, roleId: ___, ...safeUser } = user;

    return { role: roleName, ...safeUser };
  }

  async findUserById(id) {
    return await this._prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true, name: true, lastName: true, email: true, role: true,
      },
    });
  }

  async findByEmail(email) {
    return await this._prisma.user.findFirst({
      where: { email: email },
      include: {
        role: true,
      },
    });
  }

  async createUser(userData) {
    const {
      name,
      lastName,
      email,
      password,
      googleId,
      isVerified = false,
      verificationCode = null,
      verificationCodeExpires = null } = userData;
    const studentRole = await this._prisma.role.findUnique({
      where: { name: "student" },
    });

    if (!studentRole) {
      throw new Error("El rol 'student' no existe. Asegúrate de haber ejecutado el seeder de la base de datos.");
    }

    return await this._prisma.user.create({
      data: {
        name,
        lastName,
        email,
        password,
        googleId,
        roleId: studentRole.id,
        isVerified: isVerified,
        verificationToken: verificationCode,
        verificationExpires: verificationCodeExpires,
      },
      include: {
        role: true,
      },
    });
  }

  async verifyUser(email, code) {
    const user = await this._prisma.user.findFirst({
      where: { email: email, verificationToken: code },
    });

    if (!user || user.verificationExpires < new Date()) {
      return null;
    }

    return await this._prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });
  }
}

module.exports = UserRespository;
