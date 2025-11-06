const { PrismaClient } = require("@prisma/client");

class ContentRepository {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async createContent(contentData) {

    return await this._prisma.content.create({
      data: {
        title: contentData.title,
        type: contentData.type,
        statement: contentData.statement,
      },
    });

  }

  async getAllContent() {
    return await this._prisma.content.findMany();
  }

  async getContentById(id) {
    return await this._prisma.content.findUnique({
      where: { idContent: id },
    });
  }
}

module.exports = ContentRepository;
