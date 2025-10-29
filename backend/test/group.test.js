const GroupService = require("../services/groupService");
const groups = [
  { id:1,
    name:"clase 1",
    idTutor:1,
    startDate: new Date(2026, 9, 17, 15, 30, 0),
    endDate: new Date(2027, 9, 17, 15, 30, 0),
  },
  { id:2,
    name:"clase 2",
    idTutor:1,
    startDate: new Date(2024, 9, 17, 15, 30, 0),
    endDate: new Date(2027, 9, 17, 15, 30, 0),
  },
  { id:3,
    name:"clase 3",
    idTutor:1,
    startDate: new Date(2022, 9, 17, 15, 30, 0),
    endDate: new Date(2023, 9, 17, 15, 30, 0),
  },
];
const role = [{
  id:1,
  name:"student",
},{
  id:2,
  name:"admin",
},{
  id:3,
  name:"teacher",
}];

const users =  [
  {
    id:1,
    name:"tutor",
    roleId:2,
    role:role[2],
  },{
    id:2,
    name:"student",
    roleId:1,
    role:role[0],
  },
];

const registers = [
  {
    id: 1,
    userId: 2,
    groupId: 3,
    group:groups[2],
  },{
    id: 1,
    userId: 1,
    groupId: 2,
    group:groups[2],
  },{
    id: 1,
    userId: 2,
    groupId: 2,
    group:groups[1],
  },
];

const mockUserRepository = {
  getUser: jest.fn().mockImplementation((id) => users.find((i) => i.id === id)),
  getRole: jest.fn().mockImplementation((id) => role.find((i) => i.id === id) ),
};

const mockRepositoryPrisma = {
  getAllGroups: jest.fn().mockResolvedValue(groups),
  createGroup: jest.fn().mockReturnValue({ id:1, code:"qweqwe" }),
  updateGroup: jest.fn().mockImplementation((id, data) => {
    const group = groups.find((i) => i.id === id) ?? null;
    return (group) ? { ...group, ...data }:group;
  }),
  deleteGroup: jest.fn().mockImplementation( data => groups.find((i) => i.id === data)),
  getGroup: jest.fn().mockImplementation((data) => groups.find((i) => i.id === data)),
  getTeacherGroups: jest.fn().mockImplementation((id) => groups.filter((i) => i.idTutor ===id )),
  getStudentRegister: jest.fn().mockImplementation((id) => registers.filter((i) => i.userId === id)),
  getGroupCode: jest.fn().mockReturnValue(null),
};

const payload = {
  title: "titulo de prueba",
  description: "una descripcion de prueba",
  idTutor: 1,
  startDate: new Date(2026, 9, 17, 15, 30, 0),
  endDate: new Date(2027, 9, 17, 15, 30, 0),
  isWorking: true,
};

describe("Operations on the groups", () => {
  test("creating a group", async() => {
    const groupService = new GroupService(mockRepositoryPrisma, mockUserRepository);
    const group = await groupService.addGroup(payload);
    expect(group.success).toBe(true);
  });

  test("creating group, with bad startDate and endDate",async() => {
    const groupService = new GroupService(mockRepositoryPrisma, mockUserRepository);
    const group = await groupService.addGroup({
      ... payload,
      startDate: new Date(2024, 9, 17, 15, 30, 0),
      endDate: new Date(2024, 10, 17, 15, 30, 0),
    });
    expect(group.success).toBe(false);
  });

  test("creating group, with endDate > startDate", async() => {
    const groupService = new GroupService(mockRepositoryPrisma, mockRepositoryPrisma);
    const group = await groupService.addGroup({
      ...payload,
      startDate: new Date(2026, 1, 17, 15, 30, 0),
      endDate: new Date(2026, 1, 10, 15, 30, 0),
    });
    expect(group.success).toBe(false);
  });

  test("creating group, with no teacher or bad teacher request", async() =>{
    const idTeacher = 10;
    const groupService = new GroupService(mockRepositoryPrisma, mockUserRepository);
    const group = await groupService.addGroup({ ...payload, idTutor:idTeacher });
    expect(group.success).toBe(false);
  });

  test("creating group, with no teacher user", async() =>{
    const idTeacher = 2;
    const groupService = new GroupService(mockRepositoryPrisma, mockUserRepository);
    const group = await groupService.addGroup({ ...payload, idTutor:idTeacher });
    expect(group.success).toBe(false);
  });

  test("getting group with id, success", async() => {
    const groupId = 1;
    const expectedName = "clase 1";
    const groupService = new GroupService(mockRepositoryPrisma);
    const group = await groupService.getGroup(groupId);
    expect(group).not.toBeNull();
    expect(group.name).toBe(expectedName);
  });

  test("getting group with invalid id, expected not success and message",async() => {
    const groupId = 10;
    const groupService = new GroupService(mockRepositoryPrisma);
    const group = await groupService.getGroup(groupId);

    expect(group.success).not.toBeUndefined();
    expect(group.success).not.toBeNull();
    expect(group.success).toBe(false);
  });

  test("getting all groups", async() => {
    const groupService = new GroupService(mockRepositoryPrisma);
    const allGroups = await groupService.getAllGroups();
    expect(allGroups).not.toBeNull();
    expect(allGroups).not.toBeUndefined();
    expect(allGroups.groups).toHaveLength(3);
    expect(allGroups.success).toBe(true);
  });

  test("getting teacher groups", async() => {
    const idTutor = 1;
    const groupService = new GroupService(mockRepositoryPrisma);
    const teacherGroups = await groupService.getTeacherGroups(idTutor);
    expect(teacherGroups).not.toBeUndefined();
    expect(teacherGroups).not.toBeNull();
    expect(teacherGroups.groups).toHaveLength(3);
    expect(teacherGroups.success).toBe(true);
  });

  test("getting groups still valid true and isn't running", async() => {
    const idTutor = 1;
    const groupService = new GroupService(mockRepositoryPrisma);
    const allGroups = await groupService.getAllGroups();
    const oneGroup = await groupService.getGroup(1);
    const teachersGroup = await groupService.getTeacherGroups(idTutor);
    expect(allGroups.groups[0].stillValid).toBe(true);
    expect(allGroups.groups[0].running).toBe(false);
    expect(oneGroup.stillValid).toBe(true);
    expect(oneGroup.running).toBe(false);
    expect(teachersGroup.groups[0].stillValid).toBe(true);
    expect(teachersGroup.groups[0].running).toBe(false);
  });

  test("getting groups still valid false and isn't running", async() => {
    const idTutor = 1;
    const groupService = new GroupService(mockRepositoryPrisma);
    const allGroups = await groupService.getAllGroups();
    const oneGroup = await groupService.getGroup(3);
    const teachersGroup = await groupService.getTeacherGroups(idTutor);
    expect(allGroups.groups[2].stillValid).toBe(false);
    expect(allGroups.groups[2].running).toBe(false);
    expect(oneGroup.stillValid).toBe(false);
    expect(oneGroup.running).toBe(false);
    expect(teachersGroup.groups[2].stillValid).toBe(false);
    expect(teachersGroup.groups[2].running).toBe(false);
  });

  test("getting groups still valid true and is running", async() => {
    const idTutor = 1;
    const groupService = new GroupService(mockRepositoryPrisma);
    const allGroups = await groupService.getAllGroups();
    const oneGroup = await groupService.getGroup(2);
    const teachersGroup = await groupService.getTeacherGroups(idTutor);
    expect(allGroups.groups[1].stillValid).toBe(true);
    expect(allGroups.groups[1].running).toBe(true);
    expect(oneGroup.stillValid).toBe(true);
    expect(oneGroup.running).toBe(true);
    expect(teachersGroup.groups[1].stillValid).toBe(true);
    expect(teachersGroup.groups[1].running).toBe(true);
  });

  test("getting group for no registered student expected null group", async() => {
    const idStudent = 1;
    const groupService = new GroupService(mockRepositoryPrisma);
    const group = await groupService.getStudentGroup(idStudent);
    expect(group.group).toBeNull();
    expect(group).not.toBeUndefined();
    expect(group.success).toBe(false);
  });

  test("getting group for registered student expected group not null", async() => {
    const idStudent=2;
    const groupService = new GroupService(mockRepositoryPrisma);
    const dataGroup = await groupService.getStudentGroup(idStudent);
    expect(dataGroup.group).not.toBeNull();
    expect(dataGroup.group.id).toBe(2);
  });

  test("updating a class with new title and description", async() => {
    const newTitle = "new Title";
    const groupId = 1;
    const newDescription = "new Descripcion";
    const groupService = new GroupService(mockRepositoryPrisma);
    const group = await groupService.updateGroup(groupId, { title:newTitle, description: newDescription });
    expect(group.success).toBe(true);
    expect(group.group).not.toBeNull();
    expect(group.group).not.toBeUndefined();
    expect(group.group.title).toBe(newTitle);
    expect(group.group.description).toBe(newDescription);
  });

  test("updating a unexistent group from the set", async() => {
    const payload = {
      title: "new title",
      description: "new description",
    };
    const groupId = 10;
    const groupService = new GroupService(mockRepositoryPrisma);
    const group = await groupService.updateGroup(groupId, payload);
    expect(group.success).toBe(false);
    expect(group.group).not.toBeUndefined();
    expect(group.group).toBeNull();
  });

  test("getUniqueCodeForClass", async()=>{
    const groupService = new GroupService(mockRepositoryPrisma, mockUserRepository);
    const group = await groupService.addGroup(payload);
    expect(group.code).not.toBeUndefined();
    expect(group.code).not.toBeNull();
  });
});
