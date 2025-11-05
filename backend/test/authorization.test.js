const AuthorizationService = require("../services/authorizationService");
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
let groups = [
  { id:1,
    name:"clase 1",
    idTutor:12,
    startDate: new Date(2026, 9, 17, 15, 30, 0),
    endDate: new Date(2027, 9, 17, 15, 30, 0),
  },
  { id:2,
    name:"clase 2",
    idTutor:11,
    startDate: new Date(2024, 9, 17, 15, 30, 0),
    endDate: new Date(2027, 9, 17, 15, 30, 0),
  },
  { id:3,
    name:"clase 3",
    idTutor:11,
    startDate: new Date(2022, 9, 17, 15, 30, 0),
    endDate: new Date(2023, 9, 17, 15, 30, 0),
  },
];
const mockRepositoryPrisma = {
  getAllGroups: jest.fn().mockResolvedValue(groups),
  createGroup: jest.fn().mockReturnValue({ id:1, code:"qweqwe" }),
  updateGroup: jest.fn().mockImplementation((id, data) => {
    const group = groups.find((i) => i.id === id) ?? null;
    return (group) ? { ...group, ...data }:group;
  }),
  dropGroup: jest.fn().mockImplementation( data => {
    const group = groups.find((i) =>i.id === data) ?? null;
    group.dropped = true;
    return group;
  }),
  restoreGroup: jest.fn().mockImplementation( data => {
    const group = groups.find((i) =>i.id === data) ?? null;
    group.dropped = false;
    return group;
  }),
  deleteGroup: jest.fn().mockImplementation( data => {
    const group = groups.find((i) => i.id === data);
    const newGroups = groups.filter((item) => item.id !== group.id );
    groups = newGroups;
    return true;
  }),
  getGroup: jest.fn().mockImplementation((data) => groups.find((i) => i.id === data) ?? null),
  getTeacherGroups: jest.fn().mockImplementation((id) => groups.filter((i) => i.idTutor ===id )),
  getGroupCode: jest.fn().mockReturnValue(null),
};
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoidGVhY2hlckBleGFtcGxlLmNvbSIsImlhdCI6MTc2MjI4Nzg0NCwiZXhwIjoxNzYyMjkxNDQ0fQ.XFW3blxUwy0_q26eAEDZqD5dIak9MSftCHk-uoaHbdo";
const tokenAdmin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NjIyOTEzMzEsImV4cCI6MTc2MjI5NDkzMX0.F-4EeqabzctbnPe-bSTNPARB3HVTtbQIBJZlbdkv9-0";
const users =  [
  {
    id:1,
    name:"tutor",
    roleId:2,
    role:role[2],
    password: "123456",
    email:"eusebio",
  },{
    id:2,
    name:"student",
    roleId:1,
    role:role[0],
  },{
    id:12,
    name:"teacher",
    roleId:1,
    role:role[2],
  },{
    id:11,
    name:"teacher",
    roleId:1,
    role:role[1],
  },
];
const mockUserRepository = {
  getUser: jest.fn().mockImplementation((id) => users.find((i) => i.id === id)),
  getRole: jest.fn().mockImplementation((id) => role.find((i) => i.id === id) ),
  login: jest.fn().mockImplementation((email, password) => {
    const user = users.find((i) => i.email === email) ?? null;
    if (user.password+"" === password+""){
      return user;
    }
    return  false;
  }),
};

describe("Test Differ ways to Authorize the users", () => {
  test("testing user not owner product", async() => {
    const authorizationService = new AuthorizationService(mockUserRepository, mockRepositoryPrisma);
    await authorizationService.setToken(token, true);
    const idTutor = 2;
    const isOwner = await authorizationService.isOwner(idTutor);
    expect(isOwner).toBe(false);
  });

  test("testing user owner product", async() => {
    const authorizationService = new AuthorizationService(mockUserRepository, mockRepositoryPrisma);
    await authorizationService.setToken(token, true);
    const idTutor = 1;
    const isOwner = await authorizationService.isOwner(idTutor);
    expect(isOwner).toBe(true);
  });

  test("Test is the not userAdmin", async() => {
    const authorizationService = new AuthorizationService(mockUserRepository);
    await authorizationService.setToken(token, true);
    const isAdmin = await authorizationService.isAdmin();
    expect(isAdmin).toBe(false);
  });

  test("Test is the user a Admin, expected true", async() => {
    const authorizationService = new AuthorizationService(mockUserRepository);
    await authorizationService.setToken(tokenAdmin, true);
    const isAdmin = await authorizationService.isAdmin();
    expect(isAdmin).toBe(true);
  });

  test("Test is the user a teacher, expected false", async() => {
    const authorizationService = new AuthorizationService(mockUserRepository);
    await authorizationService.setToken(tokenAdmin, true);
    const isTeacher = await authorizationService.isTeacher();
    expect(isTeacher).toBe(false);
  });

  test("Test is the user a teacher, expected true", async() => {
    const authorizationService = new AuthorizationService(mockUserRepository);
    await authorizationService.setToken(token, true);
    const isTeacher = await authorizationService.isTeacher();
    expect(isTeacher).toBe(true);
  });

  test("Test is the tokenExpired", async() => {
    const authorizationService = new AuthorizationService(mockUserRepository);
    const isExpired = await authorizationService.setToken(token);
    expect(isExpired).toBe(false);
  });
});
