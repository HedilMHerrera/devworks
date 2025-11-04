const { PrismaClient } = require("@prisma/client");

class TopicRepository {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async createTopic(topicData) {

    return await this._prisma.topic.create({
      data: {
        title: topicData.title,
        description: topicData.description,
        startDate: topicData.startDate,
        endDate: topicData.endDate,
      },
    });

  }

  async getAllTopics() {
    return await this._prisma.topic.findMany({
      orderBy: {
        startDate:"asc",
      },
    });
  }
}

module.exports = TopicRepository;
