/*
  Owner: dueño del producto(del grupo o recurso que se quiere acceder o editar)
  Admin: tiene el rol de admin
  Teacher: tiene el rol de profesor

  cualquier permiso revisará si el usuario tiene una session activa.
  si la peticion tiene Owner y Admin, entonces revisara que solamente los propietarios y los
  administradores puedan acceder, entonces es un tema de OR y no de AND.

  por ejemeplo para crear un curso, solo los profesores y administradores pueden acceder
  es decir {ADMIN ó TEACHER}
  para obtener todos los cursos de un profesor se debe tener los permisos de
  {OWNER ó ADMIN}
*/
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

class AuthorizationService{
  constructor(userRepository, groupRepository){
    this._userRepository = userRepository;
    this._groupRepository = groupRepository;
    this.user = null;
  }

  async setToken(token, ignoreExpiration=false){
    try {
      const { id } = jwt.verify(token, JWT_SECRET, { ignoreExpiration });
      const user = await this._userRepository.getUser(id);
      this.user = user;
      return true;
    } catch {
      return false;
    }
  }

  async isOwner(idProduct){
    const group = await this._groupRepository.getGroup(idProduct) ?? null;
    return this.user.id === group.idTutor;
  }

  async isAdmin(){
    return this.user.role.name === "admin";
  }

  async isTeacher(){
    return this.user.role.name === "teacher";
  }
};

module.exports = AuthorizationService;
