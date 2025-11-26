const ContentLogService = require("../services/contentLogService");

const contents = [
  {
    id: 1,
    idTopic: 1,
    title: "¿Qué es Python?",
    type: "html",
    statement: "<p>Python es un lenguaje interpretado.</p>",
  },
];

const topics = [
  { id: 1, title: "Introducción a Python" },
  { id: 2, title: "Estructuras de Control" },
];

const mockContentRepo = {
  createContent: jest.fn().mockResolvedValue({ id: 2, title: "Nuevo contenido" }),
  getAllContent: jest.fn().mockResolvedValue(contents),
  getContentById: jest.fn().mockImplementation(id => contents.find(c => c.id === id)),
  getContentTopics: jest.fn().mockImplementation(idTopic => contents.filter(c => c.idTopic === idTopic)),
  updateContent: jest.fn().mockResolvedValue({ id: 1, title: "Actualizado", type: "html" }),
  deleteContent: jest.fn().mockResolvedValue(true),
};

const mockTopicRepo = {
  getTopic: jest.fn().mockImplementation(id => topics.find(t => t.id === id)),
};

const validContent = {
  idTopic: 1,
  title: "Nuevo contenido",
  type: "html",
  statement: "<p>Ejemplo</p>",
};

describe("Pruebas de servicio de Contenido", () => {
  let contentService;

  beforeEach(() => {
    contentService = new ContentLogService(mockContentRepo, mockTopicRepo);
  });

  test("crea un contenido válido", async() => {
    const result = await contentService.addContentLog(validContent);
    expect(result.success).toBe(true);
    expect(mockContentRepo.createContent).toHaveBeenCalled();
  });
});

