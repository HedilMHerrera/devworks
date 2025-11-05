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
    const groups = await this._prisma.group.findMany({
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

  async getGroupCode(code){
    const data = this._prisma.group.findUnique({
      where:{ code },
    });
    return data;
  }
  async dropGroup(groupId){
    try {
      const data = await this._prisma.group.update({
        where:{ id: groupId },
        data:{ dropped:true, droppedDate: new Date() },
      }) ?? null;
      return data;
    } catch {
      return null;
    }
  }

  async restoreGroup(groupId){
    const data = await this._prisma.group.update({
      where:{ id: groupId },
      data:{
        dropped:false,
      },
    });
    return data;
  }

  async deleteGroup(id){
    try {
      await this._prisma.group.delete({
        where:{ id },
      });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = groupRpository;
