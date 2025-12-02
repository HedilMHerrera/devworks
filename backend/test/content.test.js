const ContentService = require("../services/contentService");

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
    contentService = new ContentService(mockContentRepo, mockTopicRepo);
  });

  test("crea un contenido válido", async() => {
    const result = await contentService.addContent(validContent);
    expect(result.success).toBe(true);
    expect(mockContentRepo.createContent).toHaveBeenCalled();
  });

  test("falla si falta un campo requerido", async() => {
    const result = await contentService.addContent({ idTopic: 1 });
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/Campos obligatorios/);
  });

  test("falla si el tópico no existe", async() => {
    const result = await contentService.addContent({ ...validContent, idTopic: 999 });
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/Topico no encontrado/);
  });

  test("falla si el contenido ya existe en el mismo tópico", async() => {
    const result = await contentService.addContent({ ...contents[0] });
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/duplicado/);
  });

  test("obtiene todos los contenidos", async() => {
    const result = await contentService.getAllContent();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  test("obtiene un contenido existente", async() => {
    const result = await contentService.getContentById(1);
    expect(result.success).toBe(true);
    expect(result.data.title).toBeDefined();
  });

  test("falla al obtener un contenido inexistente", async() => {
    const result = await contentService.getContentById(999);
    expect(result.success).toBe(false);
  });

  test("actualiza un contenido existente", async() => {
    const result = await contentService.updateContent(1, { title: "Actualizado" });
    expect(result.success).toBe(true);
    expect(result.data.title).toBe("Actualizado");
  });

  test("elimina un contenido correctamente", async() => {
    const result = await contentService.deleteContent(1);
    expect(result.success).toBe(true);
  });
});
