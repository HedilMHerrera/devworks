const express = require("express");

const userRepository = require("../../repository/userRepository");
const groupRpository = require("../../repository/groupRepository");
const verifiToken = require("../../repository/groupRepository");
const GroupService = require("../../services/groupService");

const repository = new userRepository();
const groupRepository = new groupRpository();

const groupService = new GroupService(groupRepository, repository);
const router = express.Router();

const payloadStruct = {
  title :null,
  description: null,
  idTutor: null,
  startDate:null,
  endDate:null,
};
/* Solo para usuario adminsitrador supongo */
router.post("/api/groups/create", async(req,res)=>{
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

router.get("/api/groups/all", async(req, res) => {
  try {
    const allgroups = await groupService.getAllGroups();
    return res.status(200).send(allgroups);
  } catch (_){
    return res.status(500).send({ success:false, message:"error del servidor" });
  }
});

router.get("/api/groups/student", async(res, req) => {
  try {
    const groups = await groupService.getStudentGroup(3);
    return req.status(200).send(groups);
  } catch (_){
    return req.status(500).send({ success:false, message:"error interno del servidor" });
  }
});

router.get("/api/groups/teacher", async(res, req) => {
  try {
    const groups = await groupService.getTeacherGroups(2);
    return req.status(200).send(groups);
  } catch (_){
    return req.status(500).send({ success:false, message:"error interno del servidor" });
  }
});

module.exports = router;
