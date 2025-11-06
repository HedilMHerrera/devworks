const express = require("express");
const ContentRepository = require("../../repository/contentRepository");

const router = express.Router();
const repository = new ContentRepository();

router.get("/", async(req, res) => {
  try {
    const topics = await repository.getAllContent();
    res.json(topics);
  } catch {
    res.status(500).json({ message: "Error al obtener los topicos" });
  }
});

router.get("/:id", async(req, res) => {
  try {
    const id = parseInt(req.params.id);
    const content = repository.getContentById(id);
    if (!content){
      return res.status(404).json({ error: "not found" });
    }
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

router.post("/", async(req, res) => {
  try {
    const data = req.body;

    const newContent = await repository.createContent(data);

    res.status(201).json(newContent);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error al crear topico" });
  }
});

module.exports = router;
