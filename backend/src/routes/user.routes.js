const express = require("express");
const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const { deleteUser } = require("../controllers/user.controller");

const router = express.Router();

router.delete("/:id", auth, requireRole("admin"), deleteUser);

module.exports = router;