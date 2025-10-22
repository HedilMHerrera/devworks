const { PrismaClient } = require("@prisma/client");

class groupRpository{
  constructor(){
    this._prisma = new PrismaClient();
  }

  async getAllGroups(){
    const groups = await this._prisma.group.findMany();
    return groups;
  }

  async createGroup(payload){
    const newGroup = await this._prisma.group.create({
      data:{
        ...payload,
      },
    });
    return newGroup;
  }

  async updateGroup(idGroup, payload){
    const updatedGroup = await this._prisma.group.update({
      where: { id:idGroup },
      data: {
        ...payload,
      },
    });
    return updatedGroup;
  }

  async getGroup(id){
    const group = await this._prisma.group.findUnique({
      where:{ id },
    });
    return group;
  }

  async getTeacherGroups(idUser){
    const groups = this._prisma.group.findMany({
      where:{ idTutor:idUser },
    });
    return groups;
  }

  async getStudentRegister(idUser){
    const registers = this._prisma.register.findMany({
      where:{ userId:idUser },
      include:{
        group:true,
      },
    });
    return registers;
  }

}

module.exports = groupRpository;
