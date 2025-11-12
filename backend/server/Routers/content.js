const express = require("express");
const ContentRepository = require("../../repository/contentRepository");
const TopicRepository = require("../../repository/TopicRepository");
const ContentService = require("../../services/contentService");

const router = express.Router();

const contentRepository = new ContentRepository();
const topicRepository = new TopicRepository();

const service = new ContentService(contentRepository, topicRepository);

//muestra todos los contenidos
router.get("/", async(req, res) => {
  try {
    const result = await service.getAllContent();
    res.json(result.data);
  } catch (error) {
    console.error("Error al obtener contenidos:", error);
    res.status(500).json({ message: "Error al obtener contenidos" });
  }
});

router.get("/:id", async(req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await service.getContentById(id);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.json(result.data);
  } catch (error) {
    console.error("Error al obtener contenido:", error);
    res.status(500).json({ message: "Error al obtener contenido" });
  }
});

router.post("/", async(req, res) => {
  try {
    const data = req.body;
    const result = await service.addContent(data);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(201).json(result.data);
  } catch (error) {
    console.error("Error al crear contenido:", error);
    res.status(500).json({ message: "Error al crear contenido" });
  }
});

router.put("/:id", async(req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const result = await service.updateContent(id, data);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.json(result.data);
  } catch (error) {
    console.error("Error al actualizar contenido:", error);
    res.status(500).json({ message: "Error al actualizar contenido" });
  }
});

router.delete("/:id", async(req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await service.deleteContent(id);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.json({ message: result.message });
  } catch (error) {
    console.error("Error al eliminar contenido:", error);
    res.status(500).json({ message: "Error al eliminar contenido" });
  }
});

module.exports = router;
