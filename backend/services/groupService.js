const { addMetaRunningAndStillValid: addMeta } = require("./meta/newMeta");

class GroupService{
  constructor(repository, userRepository){
    this._repository = repository;
    this._userRepository = userRepository ?? null;
  }

  async _createCode(){
    const chars = "abcdefghijkmnopqrstuvwxyz0123456789";
    let isFinished = false;
    let res = "";
    while (!isFinished){
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      res = code.slice(0, 3) + "-" + code.slice(3);
      const codeAux = await this._repository.getGroupCode(res);
      if (!codeAux){
        isFinished=true;
      }
    }
    return res;
  }

  async addGroup(payload){
    const fechaActual = new Date();
    const startDate = payload.startDate;
    const endDate = payload.endDate;

    if ( endDate < startDate){
      return { message: "Error, la fecha de fin no puede ser inferior a la fecha de inicio", success:false };
    }

    if ( startDate < fechaActual ){
      return { message: "error al crear, la fecha de inicio no puede ser inferior a la fecha actual",success: false };
    }

    if ( endDate < fechaActual ){
      return { message: "error al crear, la fecha de fin no puede ser inferior a la fecha actual",success: false };
    }

    const teacher = await this._userRepository.getUser(payload.idTutor);
    if (!teacher || teacher.role.name !== "teacher"){
      return { success: false, message:"usuario inexistente o no profesor" };
    }

    const code = await this._createCode();
    const group = await this._repository.createGroup({ ...payload, code });
    if (!group){
      return {
        message: "Error al añadir, verifique los datos",
        success: false,
        ...group };
    }
    return { message: "Creado Exitoso",success: true, ...group };
  }

  async getGroup(id){
    const group = await this._repository.getGroup(id);
    if (!group){
      return { success: false, message:"id Invalido, no se puede obtener el id" };
    }
    const completeDataGroup = addMeta(group);
    return { success: true, ...completeDataGroup };
  }

  async getAllGroups(){
    const allGroups = await this._repository.getAllGroups();
    const groups = allGroups.map(( group => addMeta(group)));
    return { success: true, groups };
  }

  async getTeacherGroups(id){
    const allGroups = await this._repository.getTeacherGroups(id);
    const allCompleteDataGroups = allGroups.map((group) => addMeta(group) );
    return { success:true, groups:allCompleteDataGroups };
  }

  async getStudentGroup(id){
    const registers = await this._repository.getStudentRegister(id);
    const group = registers
      .map((i) => addMeta(i.group))
      .find((i) => i.running) ?? null;
    return { success:false , message:"grupo obtenido con exito", group };
  }

  async updateGroup(groupId, payload){
    const group = await this._repository.updateGroup(groupId, payload);
    const success = !!group;
    return { success , message:"Grupo actualizado con exito", group };
  }

  async dropGroup(id){
    const group = await this._repository.dropGroup(id);
    const message = (!group) ? "Grupo no existe":"Grupo Eliminado con exito";
    return { message, success: !!group, group };
  }

  async restoreGroup(id){
    const group = await this._repository.restoreGroup(id);
    const message = (!group) ? "Grupo no existe":"Grupo Restaurado con exito";
    return { message, success: !!group, group };
  }

  async deleteGroup(id, userId, password){
    const user = await this._userRepository.getUser(userId);
    if (!user){
      return { message:"El usuario no Existe", success:false };
    }
    const isGoodPassword = await this._userRepository.login(user.email, password);
    if (isGoodPassword) {
      await this._repository.deleteGroup(id);
      return { success:true, message:"Grupo Eliminado con Exito!" };
    }
    return { message:"Contraseña Incorrecta", success:false };
  }
}

module.exports = GroupService;
