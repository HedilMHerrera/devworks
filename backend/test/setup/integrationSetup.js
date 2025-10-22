const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function setupIntegrationTests() {

  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  await prisma.role.createMany({
    data: [
      { name: "student" },
      { name: "teacher" },
      { name: "admin" },
    ],
  });
}

async function cleanupAfterEachTest() {
  await prisma.user.deleteMany();
}

async function teardownIntegrationTests() {
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.$disconnect();
}

async function createTestUser(userData = {}) {
  const defaultUser = {
    name: "Test",
    lastName: "User",
    email: `test${Date.now()}@example.com`,
    password: "Password123!",
    isVerified: true,
  };

  const user = { ...defaultUser, ...userData };

  let hashedPassword = null;
  if (user.password) {
    hashedPassword = await bcrypt.hash(user.password, 10);
  }

  const studentRole = await prisma.role.findUnique({
    where: { name: "student" },
  });

  if (!studentRole) {
    throw new Error("El rol 'student' no existe. Ejecuta setupIntegrationTests primero.");
  }

  const createdUser = await prisma.user.create({
    data: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: hashedPassword,
      googleId: user.googleId || null,
      roleId: studentRole.id,
      isVerified: user.isVerified,
    },
    include: {
      role: true,
    },
  });

  return createdUser;
}

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
}

module.exports = {
  prisma,
  setupIntegrationTests,
  cleanupAfterEachTest,
  teardownIntegrationTests,
  createTestUser,
  findUserByEmail,
};
