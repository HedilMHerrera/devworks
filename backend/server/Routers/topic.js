const express = require("express");
const TopicRepository = require("../../repository/TopicRepository");

const router = express.Router();
const repository = new TopicRepository();

router.get("/", async(req, res) => {
  try {
    const topics = await repository.getAllTopics();
    res.json(topics);
  } catch {
    res.status(500).json({ message: "Error al obtener los topicos" });
  }
});

router.post("/", async(req, res) => {
  try {
    const data = req.body;

    const newTopic = await repository.createTopic(data);

    res.status(201).json(newTopic);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message:"Error al crear topico" });
  }
});

module.exports = router;
