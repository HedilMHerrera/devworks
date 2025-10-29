const express = require("express");
const AdminRepository = require("../../repository/adminRepository");
const AdminService = require("../../services/adminService");
const verifyToken = require("../middlewares/verifiToken");
const requireAdmin = require("../middlewares/requireAdmin");

const repository = new AdminRepository();
const adminService = new AdminService(repository);

const router = express.Router();

router.get("/api/admin/users", verifyToken, requireAdmin, async(req, res) => {
  try {
    const result = await adminService.getAllUsers();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error del servidor: ${error.message}`,
    });
  }
});

router.get("/api/admin/users/:id", verifyToken, requireAdmin, async(req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario inválido",
      });
    }

    const result = await adminService.getUserById(id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error del servidor: ${error.message}`,
    });
  }
});

router.put("/api/admin/users/:id", verifyToken, requireAdmin, async(req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario inválido",
      });
    }

    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar un roleId",
      });
    }

    const roleIdNum = parseInt(roleId);
    if (isNaN(roleIdNum) || roleIdNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "roleId inválido",
      });
    }

    const result = await adminService.updateUser(id, { roleId: roleIdNum });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error del servidor: ${error.message}`,
    });
  }
});

router.delete("/api/admin/users", verifyToken, requireAdmin, async(req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar un array de IDs",
      });
    }

    const numIds = ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));

    if (numIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "IDs inválidos",
      });
    }

    const result = await adminService.deleteUsers(numIds);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error del servidor: ${error.message}`,
    });
  }
});

router.get("/api/admin/roles", verifyToken, requireAdmin, async(req, res) => {
  try {
    const result = await adminService.getAllRoles();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error del servidor: ${error.message}`,
    });
  }
});

module.exports = router;
