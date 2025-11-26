const { PrismaClient } = require("@prisma/client");

class ContentLogRepository {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async createContentLog(contentData) {

    return await this._prisma.contentLog.create({
      data: {
        ...contentData,
      },
    });
  }

  async updateContentLog(id, contentData) {
    const updatedContent = await this._prisma.contentLog.update({
      where: { id: id },
      data: {
        ...contentData,
      },
    });

    return updatedContent;
  }

  async getAllContentLog() {
    return await this._prisma.contentLog.findMany();
  }

  async getContentByIdLog(id) {
    return await this._prisma.contentLog.findUnique({
      where: { id: id },
    });
  }

  async getContentTopicsLog(idTopic) {
    const contents = await this._prisma.contentLog.findMany({
      where: { idTopic:idTopic },
    });

    return contents;
  }

  async deleteContentLog(id) {
    try {
      await this._prisma.contentLog.delete({
        where:{ id },
      });

      return true;
    } catch {
      return false;
    }
  }
}

module.exports = ContentLogRepository;
