const AdminService = require("../services/adminService");

const roles = [
  { id: 1, name: "student" },
  { id: 2, name: "teacher" },
  { id: 3, name: "admin" },
];

const users = [
  {
    id: 1,
    name: "Ana",
    lastName: "García",
    email: "ana.garcia@example.com",
    roleId: 3,
    role: roles[2],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    name: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.r@example.com",
    roleId: 2,
    role: roles[1],
    createdAt: new Date("2024-02-20"),
  },
  {
    id: 3,
    name: "Luisa",
    lastName: "Martínez",
    email: "luisa.m@example.com",
    roleId: 1,
    role: roles[0],
    createdAt: new Date("2024-03-10"),
  },
  {
    id: 4,
    name: "Javier",
    lastName: "Fernández",
    email: "javier.f@example.com",
    roleId: 1,
    role: roles[0],
    createdAt: new Date("2024-03-12"),
  },
];

const mockAdminRepository = {
  getAllUsers: jest.fn().mockResolvedValue(users),

  getUserById: jest.fn().mockImplementation((id) => {
    const user = users.find((u) => u.id === id);
    return Promise.resolve(user || null);
  }),

  updateUser: jest.fn().mockImplementation((id, data) => {
    const user = users.find((u) => u.id === id);
    if (!user) {
      return Promise.resolve(null);
    }
    const updated = { ...user, ...data };
    return Promise.resolve(updated);
  }),

  deleteUsers: jest.fn().mockImplementation((ids) => {
    const deleted = users.filter((u) => ids.includes(u.id));
    return Promise.resolve({ count: deleted.length });
  }),

  getRoleById: jest.fn().mockImplementation((id) => {
    const role = roles.find((r) => r.id === id);
    return Promise.resolve(role || null);
  }),
};

describe("AdminService - User Management", () => {
  let adminService;

  beforeEach(() => {
    adminService = new AdminService(mockAdminRepository);
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    test("debería devolver todos los usuarios correctamente", async() => {
      const result = await adminService.getAllUsers();

      expect(result.success).toBe(true);
      expect(result.users).toHaveLength(4);
      expect(result.users[0]).toHaveProperty("name");
      expect(result.users[0]).toHaveProperty("lastName");
      expect(result.users[0]).toHaveProperty("email");
      expect(result.users[0]).toHaveProperty("role");
      expect(mockAdminRepository.getAllUsers).toHaveBeenCalledTimes(1);
    });

    test("debe excluir la contraseña de los datos del usuario", async() => {
      const result = await adminService.getAllUsers();

      result.users.forEach((user) => {
        expect(user).not.toHaveProperty("password");
      });
    });
  });

  describe("getUserById", () => {
    test("debería devolver el usuario por id correctamente", async() => {
      const result = await adminService.getUserById(1);

      expect(result.success).toBe(true);
      expect(result.user).not.toBeNull();
      expect(result.user.id).toBe(1);
      expect(result.user.name).toBe("Ana");
      expect(mockAdminRepository.getUserById).toHaveBeenCalledWith(1);
    });

    test("debería devolver un error para usuario no existente", async() => {
      const result = await adminService.getUserById(999);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Usuario no encontrado");
      expect(result.user).toBeNull();
    });
  });

  describe("updateUser", () => {
    test("debería actualizar el rol del usuario correctamente", async() => {
      const updateData = { roleId: 2 };
      const result = await adminService.updateUser(3, updateData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Usuario actualizado exitosamente");
      expect(result.user.roleId).toBe(2);
      expect(mockAdminRepository.updateUser).toHaveBeenCalledWith(3, updateData);
    });

    test("debería validar que el rol existe antes de actualizar", async() => {
      mockAdminRepository.getRoleById.mockResolvedValueOnce(null);
      const updateData = { roleId: 999 };

      const result = await adminService.updateUser(1, updateData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("El rol especificado no existe");
      expect(mockAdminRepository.updateUser).not.toHaveBeenCalled();
    });

    test("debería devolver un error para usuario no existente", async() => {
      const updateData = { roleId: 2 };
      const result = await adminService.updateUser(999, updateData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Usuario no encontrado");
    });

    test("no debería permitir datos de actualización vacíos", async() => {
      const result = await adminService.updateUser(1, {});

      expect(result.success).toBe(false);
      expect(result.message).toBe("No se proporcionaron datos para actualizar");
    });
  });

  describe("deleteUsers", () => {
    test("debería eliminar un usuario correctamente", async() => {
      const result = await adminService.deleteUsers([3]);

      expect(result.success).toBe(true);
      expect(result.message).toContain("1 usuario(s) eliminado(s)");
      expect(result.count).toBe(1);
      expect(mockAdminRepository.deleteUsers).toHaveBeenCalledWith([3]);
    });

    test("debería eliminar varios usuarios correctamente", async() => {
      const result = await adminService.deleteUsers([3, 4]);

      expect(result.success).toBe(true);
      expect(result.message).toContain("2 usuario(s) eliminado(s)");
      expect(result.count).toBe(2);
      expect(mockAdminRepository.deleteUsers).toHaveBeenCalledWith([3, 4]);
    });

    test("Debería devolver un error si el array de IDs está vacío.", async() => {
      const result = await adminService.deleteUsers([]);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Debe proporcionar al menos un ID de usuario");
      expect(mockAdminRepository.deleteUsers).not.toHaveBeenCalled();
    });

    test("debe validar que los identificadores sean números enteros positivos", async() => {
      const result = await adminService.deleteUsers([1, -5, "abc"]);

      expect(result.success).toBe(false);
      expect(result.message).toBe("IDs inválidos");
      expect(mockAdminRepository.deleteUsers).not.toHaveBeenCalled();
    });
  });

  describe("searchUsers", () => {
    test("Debe permitir buscar usuarios por nombre", async() => {
      const result = await adminService.searchUsers("Ana");

      expect(result.success).toBe(true);
      expect(result.users).toHaveLength(1);
      expect(result.users[0].name).toBe("Ana");
    });

    test("Debe permitir buscar usuarios por email", async() => {
      const result = await adminService.searchUsers("carlos");

      expect(result.success).toBe(true);
      expect(result.users).toHaveLength(1);
      expect(result.users[0].email).toContain("carlos");
    });

    test("La búsqueda debe ignorar mayúsculas y minúsculas", async() => {
      const result = await adminService.searchUsers("LUISA");

      expect(result.success).toBe(true);
      expect(result.users).toHaveLength(1);
    });

    test("debería devolver todos los usuarios cuando el campo de búsqueda está vacío", async() => {
      const result = await adminService.searchUsers("");

      expect(result.success).toBe(true);
      expect(result.users).toHaveLength(4);
    });
  });

  describe("filterByRole", () => {
    test("debería filtrar usuarios por rol", async() => {
      const result = await adminService.filterByRole(1);

      expect(result.success).toBe(true);
      expect(result.users).toHaveLength(2);
      expect(result.users.every((u) => u.roleId === 1)).toBe(true);
    });

    test("debería devolver todos los usuarios cuando el rol es nulo", async() => {
      const result = await adminService.filterByRole(null);

      expect(result.success).toBe(true);
      expect(result.users).toHaveLength(4);
    });
  });

  describe("sortUsers", () => {
    test("debería ordenar usuarios por nombre ascendente", async() => {
      const result = await adminService.sortUsers("name", "asc");

      expect(result.success).toBe(true);
      expect(result.users[0].name).toBe("Ana");
      expect(result.users[3].name).toBe("Luisa");
    });

    test("debería ordenar usuarios por nombre descendente", async() => {
      const result = await adminService.sortUsers("name", "desc");

      expect(result.success).toBe(true);
      expect(result.users[0].name).toBe("Luisa");
      expect(result.users[3].name).toBe("Ana");
    });

    test("debería ordenar usuarios por apellido ascendente", async() => {
      const result = await adminService.sortUsers("lastName", "asc");

      expect(result.success).toBe(true);
      expect(result.users[0].lastName).toBe("Fernández");
      expect(result.users[3].lastName).toBe("Rodríguez");
    });

    test("debería usar la ordenación por defecto cuando no se especifica ningún campo", async() => {
      const result = await adminService.sortUsers();

      expect(result.success).toBe(true);
      expect(result.users).toHaveLength(4);
    });
  });
});
