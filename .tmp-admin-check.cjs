const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  const users = await prisma.user.findMany({
    where: { role: { in: ["SUPER_ADMIN", "ADMIN", "EDITOR"] } },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true }
  });
  console.log("count", users.length);
  console.log(users);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e.message || e);
  try { await prisma.$disconnect(); } catch {}
  process.exit(1);
});
