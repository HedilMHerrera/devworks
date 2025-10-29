class AdminService {
  constructor(repository) {
    this._repository = repository;
  }

  async getAllUsers() {
    const users = await this._repository.getAllUsers();

    const sanitizedUsers = users.map((user) => this._sanitizeUser(user));

    return {
      success: true,
      users: sanitizedUsers,
    };
  }

  async getUserById(id) {
    const user = await this._repository.getUserById(id);

    if (!user) {
      return {
        success: false,
        message: "Usuario no encontrado",
        user: null,
      };
    }

    return {
      success: true,
      user: this._sanitizeUser(user),
    };
  }

  async updateUser(id, data) {
    if (!data || Object.keys(data).length === 0) {
      return {
        success: false,
        message: "No se proporcionaron datos para actualizar",
      };
    }

    const existingUser = await this._repository.getUserById(id);
    if (!existingUser) {
      return {
        success: false,
        message: "Usuario no encontrado",
      };
    }

    if (data.roleId) {
      const role = await this._repository.getRoleById(data.roleId);
      if (!role) {
        return {
          success: false,
          message: "El rol especificado no existe",
        };
      }
    }

    const updatedUser = await this._repository.updateUser(id, data);

    return {
      success: true,
      message: "Usuario actualizado exitosamente",
      user: this._sanitizeUser(updatedUser),
    };
  }

  async deleteUsers(ids) {
    if (!ids || ids.length === 0) {
      return {
        success: false,
        message: "Debe proporcionar al menos un ID de usuario",
      };
    }

    const validIds = ids.every((id) => Number.isInteger(id) && id > 0);
    if (!validIds) {
      return {
        success: false,
        message: "IDs inválidos",
      };
    }

    const result = await this._repository.deleteUsers(ids);

    return {
      success: true,
      message: `${result.count} usuario(s) eliminado(s) exitosamente`,
      count: result.count,
    };
  }

  async searchUsers(searchTerm) {
    const allUsers = await this._repository.getAllUsers();

    if (!searchTerm || searchTerm.trim() === "") {
      return {
        success: true,
        users: allUsers.map((u) => this._sanitizeUser(u)),
      };
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = allUsers.filter((user) => {
      const fullName = `${user.name} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      return fullName.includes(term) || email.includes(term);
    });

    return {
      success: true,
      users: filtered.map((u) => this._sanitizeUser(u)),
    };
  }

  async filterByRole(roleId) {
    const allUsers = await this._repository.getAllUsers();

    if (!roleId) {
      return {
        success: true,
        users: allUsers.map((u) => this._sanitizeUser(u)),
      };
    }

    const filtered = allUsers.filter((user) => user.roleId === roleId);

    return {
      success: true,
      users: filtered.map((u) => this._sanitizeUser(u)),
    };
  }

  async sortUsers(field = "name", order = "asc") {
    const allUsers = await this._repository.getAllUsers();

    const sorted = [...allUsers].sort((a, b) => {
      let valA = a[field] || "";
      let valB = b[field] || "";

      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (order === "desc") {
        return valB > valA ? 1 : valB < valA ? -1 : 0;
      }
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    });

    return {
      success: true,
      users: sorted.map((u) => this._sanitizeUser(u)),
    };
  }

  async getAllRoles() {
    const roles = await this._repository.getAllRoles();
    return {
      success: true,
      roles,
    };
  }

  _sanitizeUser(user) {
    // eslint-disable-next-line no-unused-vars
    const { password, verificationToken, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = AdminService;
