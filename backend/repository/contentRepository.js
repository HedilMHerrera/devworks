const { PrismaClient } = require("@prisma/client");

class ContentRepository {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async createContent(contentData) {

    return await this._prisma.content.create({
      data: {
        ...contentData,
      },
    });
  }

  async getAllContent() {
    return await this._prisma.content.findMany();
  }

  async getContentById(id) {
    return await this._prisma.content.findUnique({
      where: { id: id },
    });
  }

  async updateContent(id, contentData) {
    const updatedContent = await this._prisma.content.update({
      where: { id: id },
      data: {
        ...contentData,
      },
    });

    return updatedContent;
  }

  async getContentTopics(idTopic) {
    const contents = await this._prisma.content.findMany({
      where: { idTopic:idTopic },
    });

    return contents;
  }

  async deleteContent(id) {
    try {
      await this._prisma.content.delete({
        where:{ id },
      });

      return true;
    } catch {
      return false;
    }
  }
}

module.exports = ContentRepository;
