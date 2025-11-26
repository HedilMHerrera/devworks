class TopicService {
  constructor(repository, teacherRepository) {
    this._repository = repository;
    this._teacherRepository = teacherRepository;
  }

  async addTopic(data) {
    const currentDate = new Date();
    const startDate = data.startDate;
    const endDate = data.endDate;

    if (endDate <= startDate) {
      return { message: "Error, la fecha fin no puede ser inferior al inicio", success: false };
    }

    if (startDate < currentDate) {
      return { message: "error al crear, la fecha de inicio no puede ser menor a la fecha actual", success: false };
    }

    if (endDate < currentDate) {
      return { message: "error al crear, la fecha de fin no puede ser inferior a la fecha actual", success: false };
    }

    const teacher = await this._teacherRepository.getUser(data.idTutor);

    if (!teacher || teacher.role.name !== "teacher") {
      return { message: "usuario inexistente o no profesor", success: false };
    }

    const topic = await this._repository.createTopic({ ...data });

    if (!topic) {
      return {
        message: "Error al crear topico, verifique los datos",
        success: false,
      };
    }
    return { message: "topico creado con Exito", success: true };
  }

  async getAllTopics() {
    const topics = await this._repository.getAllTopics();
    if (!topics || topics.length === 0) {
      return { message: "No existen tópicos", success: false };
    }
    return { message: "topico obtenidos correctamente", success: true, data: topics };
  }

  async getTopic(id) {
    const topic = await this._repository.getTopic(id);
    if (!topic) {
      return { message: "topico  no encontrado", success: false };
    }
    return { message: "topico  obtenido con éxito", success: true, data: topic };
  }

  async updateTopic(id, data) {
    const existing = await this._repository.getTopic(id);
    if (!existing) {
      return { message: "topico  no encontrado", success: false };
    }

    const updated = await this._repository.updateTopic(id, data);
    if (!updated) {
      return { message: "Error al actualizar", success: false };
    }

    return { message: "topico  actualizado con éxito", success: true, data: updated };
  }

  async deleteTopic(id) {
    const deleted = await this._repository.deleteTopic(id);
    if (!deleted) {
      return { message: "Error al eliminar el tópico", success: false };
    }
    return { message: "topico  eliminado con éxito", success: true };
  }

  async getTopicTeacher(idTeacher) {
    const topics = await this._repository.getTopicTeacher(idTeacher);
    if (!topics || topics.length === 0) {
      return { message: "No existen topicos para este profesor", success: false };
    }
    return { message: "topico  del profesor obtenidos correctamente", success: true, data: topics };
  }
}

module.exports = TopicService;
