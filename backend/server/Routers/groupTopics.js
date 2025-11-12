const express = require("express");
const GroupRepository = require("../../repository/groupRepository");
const TopicRepository = require("../../repository/TopicRepository");
const GroupTopicRepository = require("../../repository/groupTopicRepository");
const GroupTopicService = require("../../services/groupTopicService");

const router = express.Router();

const groupRepo = new GroupRepository();
const topicRepo = new TopicRepository();
const associationRepo = new GroupTopicRepository();

const service = new GroupTopicService(groupRepo, topicRepo, associationRepo);

//devuelve todos los topicos asociados al grupo
router.get("/:groupId/topics", async(req, res) => {
  try {
    const { groupId } = req.params;
    const result = await service.getTopicsByGroup(parseInt(groupId));
    res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los topicos del grupo" });
  }
});

//añade un topico a un grupo especifico
router.post("/:groupId/topics/:topicId", async(req, res) => {
  try {
    const { groupId, topicId } = req.params;
    const result = await service.addTopicToGroup(parseInt(groupId), parseInt(topicId));

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(201).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al asociar el topico al grupo" });
  }
});

//elimina un topico del grupo
router.delete("/:groupId/topics/:topicId", async(req, res) => {
  try {
    const { groupId, topicId } = req.params;
    const result = await service.removeTopicFromGroup(parseInt(groupId), parseInt(topicId));

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.json({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el topico del grupo" });
  }
});

module.exports = router;
