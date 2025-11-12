const GroupTopicService = require("../services/groupTopicService");

const mockGroupRepo = {
  getGroup: jest.fn(),
};

const mockTopicRepo = {
  getTopic: jest.fn(),
};

const mockAssociationRepo = {
  existsAssociation: jest.fn(),
  addTopicToGroup: jest.fn(),
  removeTopicFromGroup: jest.fn(),
  getTopicsByGroup: jest.fn(),
};

describe("prueva de la gestion de topicos y grupos", () => {
  let service;

  beforeEach(() => {
    service = new GroupTopicService(
      mockGroupRepo,
      mockTopicRepo,
      mockAssociationRepo,
    );
    jest.clearAllMocks();
  });

  test("agrega un tópico a un grupo correctamente", async() => {
    mockGroupRepo.getGroup.mockResolvedValue({ id: 1, name: "Grupo 1" });
    mockTopicRepo.getTopic.mockResolvedValue({ id: 2, title: "Tópico 2" });
    mockAssociationRepo.existsAssociation.mockResolvedValue(null);
    mockAssociationRepo.addTopicToGroup.mockResolvedValue({
      id: 10,
      groupId: 1,
      topicId: 2,
    });

    const result = await service.addTopicToGroup(1, 2);

    expect(result.success).toBe(true);
    expect(result.message).toBe("topico agregado al grupo");
    expect(result.data).toEqual({
      id: 10,
      groupId: 1,
      topicId: 2,
    });

    expect(mockGroupRepo.getGroup).toHaveBeenCalledWith(1);
    expect(mockTopicRepo.getTopic).toHaveBeenCalledWith(2);
    expect(mockAssociationRepo.addTopicToGroup).toHaveBeenCalled();
  });

  test("falla si el grupo o topico no existe", async() => {
    mockGroupRepo.getGroup.mockResolvedValue(null);
    mockTopicRepo.getTopic.mockResolvedValue(null);

    const result = await service.addTopicToGroup(1, 2);

    expect(result.success).toBe(false);
    expect(result.message).toBe("grupo o topico no encontrado");
  });

  test("impide asociar un topico duplicado", async() => {
    mockGroupRepo.getGroup.mockResolvedValue({ id: 1 });
    mockTopicRepo.getTopic.mockResolvedValue({ id: 2 });
    mockAssociationRepo.existsAssociation.mockResolvedValue({
      id: 100,
      groupId: 1,
      topicId: 2,
    });

    const result = await service.addTopicToGroup(1, 2);

    expect(result.success).toBe(false);
    expect(result.message).toBe("el topico ya esta asociado a este grupo");
  });

  test("elimina un topico de un grupo correctamente", async() => {
    mockAssociationRepo.existsAssociation.mockResolvedValue({ id: 10 });
    mockAssociationRepo.removeTopicFromGroup.mockResolvedValue(true);

    const result = await service.removeTopicFromGroup(1, 2);

    expect(result.success).toBe(true);
    expect(result.message).toBe("topico eliminado del grupo");
    expect(mockAssociationRepo.removeTopicFromGroup).toHaveBeenCalledWith(1, 2);
  });

  test("devuelve error si la asociacion no existe", async() => {
    mockAssociationRepo.existsAssociation.mockResolvedValue(null);

    const result = await service.removeTopicFromGroup(1, 2);

    expect(result.success).toBe(false);
    expect(result.message).toBe("asociacion no encontrada");
  });

  test("devuelve la lista de topicos de un grupo", async() => {
    mockAssociationRepo.getTopicsByGroup.mockResolvedValue([
      { topic: { id: 1, title: "Intro a python" } },
      { topic: { id: 2, title: "variables en python" } },
    ]);

    const result = await service.getTopicsByGroup(10);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].title).toBe("Intro a python");
  });
});
