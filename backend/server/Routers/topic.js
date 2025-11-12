const express = require("express");
const TopicRepository = require("../../repository/TopicRepository");
const userRepository = require("../../repository/userRepository");
const TopicService = require("../../services/topicService");

const router = express.Router();
const repository = new TopicRepository();
const teacherRepository = new userRepository();

const service = new TopicService(repository, teacherRepository);
//muestra todos los topicos creados
router.get("/", async(req, res) => {
  try {
    const result = await service.getAllTopics();
    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }
    res.status(200).json(result.data);
  } catch (error) {
    console.error("Error al obtener tópicos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//crea un topico
router.post("/", async(req, res) => {
  try {
    const data = req.body;
    const result = await service.addTopic(data);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(201).json({ message: result.message, success: true });
  } catch (error) {
    console.error("Error al crear tópico:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.put("/:id", async(req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const result = await service.updateTopic(id, data);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    console.error("Error al actualizar tópico:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get("/:id", async(req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await service.getTopic(id);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json(result.data);
  } catch (error) {
    console.error("Error al obtener tópico:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.delete("/:id", async(req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await service.deleteTopic(id);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error al eliminar tópico:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
