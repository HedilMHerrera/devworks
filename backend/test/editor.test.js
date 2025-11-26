jest.mock("@prisma/client", () => {
  const findUnique = jest.fn();
  const PrismaClient = jest.fn(() => ({ user: { findUnique } }));
  return { PrismaClient };
});

const requireEditor = require("../server/middlewares/requireEditor");
const { PrismaClient } = require("@prisma/client");

describe("requireEditor middleware", () => {
  let mockPrisma;
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = PrismaClient.mock.instances[0] || new PrismaClient();
  });

  test("devuelve 401 cuando no hay user en la request", async() => {
    const req = { user: undefined };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await requireEditor(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  test("devuelve 403 cuando el usuario no tiene rol editor", async() => {
    const req = { user: { id: 10 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    mockPrisma.user.findUnique.mockResolvedValue({ id: 10, role: { name: "teacher" } });

    await requireEditor(req, res, next);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 10 }, include: { role: true } });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  });

  test("permite continuar cuando el usuario tiene rol editor", async() => {
    const req = { user: { id: 20 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    mockPrisma.user.findUnique.mockResolvedValue({ id: 20, role: { name: "editor" } });

    await requireEditor(req, res, next);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 20 }, include: { role: true } });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
