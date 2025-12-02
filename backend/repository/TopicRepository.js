const { PrismaClient } = require("@prisma/client");

class TopicRepository {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async createTopic(topicData) {

    return await this._prisma.topic.create({
      data: {
        ...topicData,
      },
    });

  }

  async getAllTopics() {
    return await this._prisma.topic.findMany({
      orderBy: {
        startDate:"asc",
      },
      include:{
        content:true,
      },
    });
  }

  async updateTopic(id, topicData) {
    const updatedTopic = await this._prisma.topic.update({
      where: { id: id },
      data: {
        ...topicData,
      },
    });

    return updatedTopic;
  }

  async getTopic(id) {
    const topic = await this._prisma.topic.findUnique({
      where:{ id:id },
    });

    return topic;
  }

  async deleteTopic(id) {
    try {
      await this._prisma.topic.delete({
        where: { id:id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getTopicTeacher(idTutor) {
    const topics = await this._prisma.topic.findMany({
      where: { idTutor:idTutor },
    });

    return topics;
  }

}

module.exports = TopicRepository;
