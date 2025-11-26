const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  const [adminRol, teacherRol, studentRol, editorRol] = await Promise.all([
    prisma.role.upsert({
      where: { name: "admin" },
      update: {},
      create: { name: "admin" },
    }),
    prisma.role.upsert({
      where: { name: "teacher" },
      update: {},
      create: { name: "teacher" },
    }),
    prisma.role.upsert({
      where: { name: "student" },
      update: {},
      create: { name: "student" },
    }),
    prisma.role.upsert({
      where: { name: "editor" },
      update: {},
      create: { name: "editor" },
    }),
  ]);
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "admin",
        lastName: "user",
        email: "admin@example.com",
        password: passwordHash,
        roleId: adminRol.id,
        isVerified:true,
      },
      {
        name: "teacher",
        lastName: "user",
        email: "teacher@example.com",
        password: passwordHash,
        roleId: teacherRol.id,
        isVerified:true,
      },
      {
        name: "student",
        lastName: "user",
        email: "student@example.com",
        password: passwordHash,
        roleId: studentRol.id,
        isVerified:true,
      },
      {
        name: "editor",
        lastName: "user",
        email: "editor@example.com",
        password: passwordHash,
        roleId: editorRol.id,
        isVerified:true,
      },
    ],
    skipDuplicates: true,
  });

}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("error al crear seeds : ", e);
  })
  .finally(async() => {
    await prisma.$disconnect();
  });
