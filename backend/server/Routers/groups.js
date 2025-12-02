const express = require("express");

const userRepository = require("../../repository/userRepository");
const groupRpository = require("../../repository/groupRepository");
const GroupService = require("../../services/groupService");
const { toBeAdminOrTeacher, toBeAdminOrOwner } = require("../middlewares/AuthorizationMiddleware");
const repository = new userRepository();
const groupRepository = new groupRpository();
const AuthorizationService = require("../../services/authorizationService");

const groupService = new GroupService(groupRepository, repository);
const autorizationService = new AuthorizationService(new userRepository);
const router = express.Router();

const payloadStruct = {
  title :null,
  description: null,
  idTutor: null,
  startDate:null,
  endDate:null,
};
/* Solo para usuario adminsitrador supongo */
router.post("/api/groups/create" , async(req,res)=>{
  try {
    const data = { ...payloadStruct, ...req.body };
    const isNull = Object.values(data).some(value => value===null );
    if (isNull){
      return res.status(400).send({ success:false, message:"Error de usuario, verifique que los datos sean correctos" });
    }
    const createdGroup = await groupService.addGroup(data);
    let status = 400;
    if (createdGroup.success) {
      status = 200;
    }
    return res.status(status).send(createdGroup);
  } catch (_){
    return res.status(500).send({ success:false, message:"error de servidor" });
  }
});

router.put("/api/group/update", async(req, res) => {
  try {
    const { id, running, stillValid, idTutor, ...payload } = req.body;
    const newGroup = await groupService.updateGroup(id, payload);
    return res.status(200).send( newGroup );
  } catch (e){
    return res.status(500).send({ success:false, message:`Error interno del servidor: ${e}` });
  }
});

router.get("/api/groups/all", async(req, res) => {
  try {
    const allgroups = await groupService.getAllGroups();
    return res.status(200).send(allgroups);
  } catch (_){
    return res.status(500).send({ success:false, message:"error del servidor" });
  }
});

router.get("/api/groups/student", async(req, res) => {
  try {
    const groups = await groupService.getStudentGroup(3);
    return res.status(200).send(groups);
  } catch (_){
    return res.status(500).send({ success:false, message:"error interno del servidor" });
  }
});

router.get("/api/groups/teacher", async(req, res) => {
  try {
    const token = req.cookies.authToken ?? null;
    await autorizationService.setToken(token);
    const id = autorizationService.user.id;
    const groups = await groupService.getTeacherGroups(id);
    return res.status(200).send(groups);
  } catch (e){
    return res.status(500).send({ success:false, message:`error interno del servidor : ${ e } ` });
  }
});

router.get("/api/group/drop/:id", async(req, res) => {
  const id = parseInt(req.params.id);
  try {
    const group = await groupService.dropGroup(id);
    return res.status(200).send( group );
  } catch (_){
    return res.status(500).send({ message:"error interno del servidor", success:false });
  }
});

router.get("/api/group/restore/:id", async(req, res)=>{
  const id = parseInt(req.params.id);
  try {
    const response = await groupService.restoreGroup(id);
    return res.status(200).send( response );
  } catch (e){
    return res.status(500).send({ message:`Error interno del servidor : ${ e }`, success:false });
  }
});

router.get("/api/group/:id", async(req, res) => {
  const id = parseInt(req.params.id);
  try {
    const response = await groupService.getGroup(id);
    return res.status(200).send(response);
  } catch {
    return res.status(500).send({ message:"error interno del servdor", success:false });
  }
});

router.post("/api/group/delete", async(req, res) => {
  const payloadStructure = {
    id:null,
    userId: null,
    password: null,
  };
  const payload = { ...payloadStructure, ...req.body };
  const haveNull = Object.values(payload).some((obj) => obj === null);
  if (haveNull){
    return res.status(400).send({ message:"error de usuario, los datos no deben ser nulos", success:false });
  }
  const { id, userId, password } = payload;
  try {
    const response = await groupService.deleteGroup(id, userId, password);
    return res.status(200).send(response);
  } catch (e) {
    return res.status(500).send({ message:`Error interno del servidor : ${e}`, success:false });
  }
});

module.exports = router;
