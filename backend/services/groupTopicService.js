class GroupTopicService {
  constructor(groupRepository, topicRepository, associationRepository) {
    this._groupRepository = groupRepository;
    this._topicRepository = topicRepository;
    this._associationRepository = associationRepository;
  }

  async addTopicToGroup(groupId, topicId) {
    const group = await this._groupRepository.getGroup(groupId);
    const topic = await this._topicRepository.getTopic(topicId);

    if (!group || !topic) {
      return { success: false, message: "grupo o topico no encontrado" };
    }

    const exists = await this._associationRepository.existsAssociation(groupId, topicId);
    if (exists) {
      return { success: false, message: "el topico ya esta asociado a este grupo" };
    }

    const association = await this._associationRepository.addTopicToGroup(groupId, topicId);
    return { success: true, message: "topico agregado al grupo", data: association };
  }

  async removeTopicFromGroup(groupId, topicId) {
    const exists = await this._associationRepository.existsAssociation(groupId, topicId);
    if (!exists) {
      return { success: false, message: "asociacion no encontrada" };
    }

    await this._associationRepository.removeTopicFromGroup(groupId, topicId);
    return { success: true, message: "topico eliminado del grupo" };
  }

  async getTopicsByGroup(groupId) {
    const topics = await this._associationRepository.getTopicsByGroup(groupId);
    return { success: true, data: topics.map(t => t.topic) };
  }
}

module.exports = GroupTopicService;
