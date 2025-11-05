const groupRpository = require("../../repository/groupRepository");
const userRepository = require("../../repository/userRepository");
const AuthorizationService = require("../../services/authorizationService");
const authorizationService = new AuthorizationService(new userRepository, new groupRpository);

const toBeAdminOrTeacher = async(req, res, next) => {
  const token = req.cookies.authToken ?? null;
  await authorizationService.setToken(token);
  const isAdmin = await authorizationService.isAdmin();
  const isTeacher = await authorizationService.isTeacher();
  if (isAdmin || isTeacher){
    next();
  } else {
    return res.status(401).send({ message:"No autorizado para hacer esta accion", success:false });
  }
};

const toBeAdminOrOwner = async(req, res, next)=>{
  const token = req.cookies.authToken ?? null;
  const id = req.body?.id ?? parseInt(req.params?.id) ?? null;
  if (!id){
    return res.status(400).send({ message:"Datos Erroneos", success:false });
  }
  await authorizationService.setToken(token);
  const isAdmin = await authorizationService.isAdmin();
  const isOwner = await authorizationService.isOwner(id);
  if (isAdmin || isOwner){
    next();
  } else {
    return res.status(401).send({ message:"No tiene permisos para acceder a esta pestaña", success:false });
  }
};

module.exports = { toBeAdminOrTeacher, toBeAdminOrOwner };
