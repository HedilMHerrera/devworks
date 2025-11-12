const { PrismaClient } = require("@prisma/client");

class GroupTopicRepository {
  constructor() {
    this._prisma = new PrismaClient();
  }

  async addTopicToGroup(groupId, topicId) {
    return await this._prisma.groupTopic.create({
      data: { groupId, topicId },
    });
  }

  async removeTopicFromGroup(groupId, topicId) {
    return await this._prisma.groupTopic.delete({
      where: {
        groupId_topicId: { groupId, topicId },
      },
    });
  }

  async getTopicsByGroup(groupId) {
    return await this._prisma.groupTopic.findMany({
      where: { groupId },
      include: {
        topic: {
          include: {
            content: true,
          },
        },
      },
    });
  }

  async getGroupsByTopic(topicId) {
    return await this._prisma.groupTopic.findMany({
      where: { topicId },
      include: { group: true },
    });
  }

  async existsAssociation(groupId, topicId) {
    return await this._prisma.groupTopic.findUnique({
      where: { groupId_topicId: { groupId, topicId } },
    });
  }
}

module.exports = GroupTopicRepository;
