const { PrismaClient } = require("@prisma/client");

class AdminRepository {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async getAllUsers() {
    const users = await this._prisma.user.findMany({
      include: {
        role: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  }

  async getUserById(id) {
    const user = await this._prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });
    return user;
  }

  async updateUser(id, data) {
    try {
      const updatedUser = await this._prisma.user.update({
        where: { id },
        data,
        include: {
          role: true,
        },
      });
      return updatedUser;
    } catch (error) {
      if (error.code === "P2025") {
        return null;
      }
      throw error;
    }
  }

  async deleteUsers(ids) {
    const result = await this._prisma.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return result;
  }

  async getRoleById(id) {
    const role = await this._prisma.role.findUnique({
      where: { id },
    });
    return role;
  }

  async getAllRoles() {
    const roles = await this._prisma.role.findMany();
    return roles;
  }
}

module.exports = AdminRepository;
