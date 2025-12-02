const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function requireEditor(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    const roleName = (user?.role?.name || "").toLowerCase();
    if (roleName !== "editor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
}

module.exports = requireEditor;
