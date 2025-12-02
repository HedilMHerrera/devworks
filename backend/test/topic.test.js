const TopicService = require("../services/topicService");

const role = [
  { id: 1, name: "student" },
  { id: 2, name: "admin" },
  { id: 3, name: "teacher" },
];

const users = [
  { id: 1, name: "juan perez", roleId: 3, role: role[2] },
  { id: 2, name: "carlos garcia", roleId: 1, role: role[0] },
];

const topics = [
  {
    id: 1,
    idTutor: 1,
    title: "Introducción a Python",
    description: "Conceptos básicos de Python",
    startDate: new Date("2025-11-05T10:00:00Z"),
    endDate: new Date("2025-11-20T10:00:00Z"),
  },
  {
    id: 2,
    idTutor: 2,
    title: "Estructuras de Control",
    description: "Condicionales y bucles en Python",
    startDate: new Date("2025-11-21T10:00:00Z"),
    endDate: new Date("2025-11-30T10:00:00Z"),
  },
];

const mockRepository = {
  createTopic: jest.fn().mockResolvedValue({ id: 1, title: "introduccion a python" }),
  getAllTopics: jest.fn().mockReturnValue(topics.sort((a, b) => b.startDate - a.startDate)),
  getTopic: jest.fn().mockImplementation((id) => topics.find((t) => t.id === id)),
  updateTopic: jest.fn().mockImplementation((id, data) => ({ ...topics.find((t) => t.id === id), ...data })),
  deleteTopic: jest.fn().mockImplementation((id) => !!topics.find((t) => t.id === id)),
  getTopicTeacher: jest.fn().mockImplementation((idTutor) => topics.filter((t) => t.idTutor === idTutor)),
};

const mockUserRepository = {
  getUser: jest.fn().mockImplementation((id) => users.find((user) => user.id === id)),
  getRole: jest.fn().mockImplementation((id) => role.find((i) => i.id === id)),
};

const data = {
  idTutor: 1,
  title: "Introduccion a Numpy",
  description: "Manejo de arrays multidimensionales",
  startDate: new Date("2025-12-05T10:00:00Z"),
  endDate: new Date("2025-12-25T10:00:00Z"),
};

describe("Prueba de CRUD de tópicos", () => {
  test("crea un tópico con datos válidos", async() => {
    const topicService = new TopicService(mockRepository, mockUserRepository);
    const topic = await topicService.addTopic(data);
    expect(topic.success).toBe(true);
    expect(topic.message).toBe("topico creado con Exito");
  });

  test("creación de tópico con fechas inválidas", async() => {
    const topicService = new TopicService(mockRepository, mockUserRepository);
    const topic = await topicService.addTopic({
      ...data,
      startDate: new Date("2025-10-21T10:00:00Z"),
      endDate: new Date("2025-11-02T10:00:00Z"),
    });
    expect(topic.success).toBe(false);
  });

  test("creación con fecha fin menor que inicio", async() => {
    const topicService = new TopicService(mockRepository, mockUserRepository);
    const topic = await topicService.addTopic({
      ...data,
      startDate: new Date("2025-11-21T10:00:00Z"),
      endDate: new Date("2025-11-20T10:00:00Z"),
    });
    expect(topic.success).toBe(false);
  });

  test("creación con usuario distinto a profesor", async() => {
    const topicService = new TopicService(mockRepository, mockUserRepository);
    const topic = await topicService.addTopic({
      ...data,
      idTutor: 2,
    });
    expect(topic.success).toBe(false);
  });

  test("devuelve todos los tópicos ordenados por fechaInicio", async() => {
    const topicService = new TopicService(mockRepository, mockUserRepository);
    const allTopics = await topicService.getAllTopics();
    expect(allTopics.success).toBe(true);
    expect(allTopics.data.length).toBeGreaterThan(0);
  });

  test("obtiene un tópico existente", async() => {
    const topicService = new TopicService(mockRepository, mockUserRepository);
    const topic = await topicService.getTopic(1);
    expect(topic.success).toBe(true);
    expect(topic.data.title).toBe("Introducción a Python");
  });

  test("obtiene un tópico inexistente", async() => {
    const topicService = new TopicService(mockRepository, mockUserRepository);
    const topic = await topicService.getTopic(99);
    expect(topic.success).toBe(false);
  });

  test("actualiza un tópico existente", async() => {
    const topicService = new TopicService(mockRepository, mockUserRepository);
    const updated = await topicService.updateTopic(1, { title: "Python Avanzado" });
    expect(updated.success).toBe(true);
    expect(updated.data.title).toBe("Python Avanzado");
  });

  test("elimina un tópico existente", async() => {
    const topicService = new TopicService(mockRepository, mockUserRepository);
    const deleted = await topicService.deleteTopic(1);
    expect(deleted.success).toBe(true);
  });

  test("obtiene tópicos por profesor", async() => {
    const topicService = new TopicService(mockRepository, mockUserRepository);
    const teacherTopics = await topicService.getTopicTeacher(1);
    expect(teacherTopics.success).toBe(true);
    expect(teacherTopics.data.length).toBeGreaterThan(0);
  });
});
