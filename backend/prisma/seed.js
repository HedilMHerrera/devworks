const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const [adminRol, teacherRol, studentRol] = await Promise.all([
    prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin' },
    }),
    prisma.role.upsert({
      where: { name: 'teacher' },
      update: {},
      create: { name: 'teacher' },
    }),
    prisma.role.upsert({
      where: { name: 'student' },
      update: {},
      create: { name: 'student' },
    }),
  ]);
    const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.createMany({
    data: [
      {
        username: 'admin_user',
        email: 'admin@example.com',
        password: passwordHash,
        roleId: adminRol.id,
      },
      {
        username: 'teacher_user',
        email: 'teacher@example.com',
        password: passwordHash,
        roleId: teacherRol.id,
      },
      {
        username: 'student_user',
        email: 'student@example.com',
        password: passwordHash,
        roleId: studentRol.id,
      },
    ],
    skipDuplicates: true,
  });

}

main()
  .catch((e) => {
    console.error('error al crear seeds : ', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
