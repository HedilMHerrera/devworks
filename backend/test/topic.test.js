const request = require("supertest");
const express = require("express");
const topicRoutes = require("../server/Routers/topic.js");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use("/api/topic", topicRoutes);

const createdTopicIds = [];

afterAll(async() => {
  await prisma.topic.deleteMany({
    where: { id: { in: createdTopicIds } },
  });
});

describe("POST /api/topic", () => {
  it("debería crear un nuevo tópico correctamente", async() => {
    const newTopic = {
      title: "variables en python",
      description: "Conceptos básicos y primeros pasos",
      startDate: new Date("2025-11-01"),
      endDate: new Date("2025-11-10"),
    };

    const res = await request(app)
      .post("/api/topic")
      .send(newTopic)
      .expect(201);
    createdTopicIds.push(res.body.id);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(newTopic.title);
    expect(res.body.description).toBe(newTopic.description);
  });
});

describe("GET /api/topic", () => {
  it("debería retornar todos los tópicos ordenados por fecha de inicio", async() => {
    await prisma.topic.createMany({
      data: [
        {
          title: "variables",
          description: "introduccion a variables",
          startDate: new Date("2025-10-01"),
          endDate: new Date("2025-10-05"),
        },
        {
          title: "condicionales",
          description: "evaluacion de condicionales",
          startDate: new Date("2025-12-01"),
          endDate: new Date("2025-12-05"),
        },
      ],
    });

    const createdTopics = await prisma.topic.findMany({
      where: {
        title: { in: ["variables", "condicionales"] },
      },
    });

    createdTopics.forEach((t) => createdTopicIds.push(t.id));

    const res = await request(app)
      .get("/api/topic")
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(2);

    const [first, second] = res.body;

    expect(new Date(first.startDate) < new Date(second.startDate)).toBe(true);
  });
});

