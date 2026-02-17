const express = require("express");
const { register, login } = require("../controllers/auth.controllers");
const { validate } = require("../middleware/validate");
const { registerValidator, loginValidator } = require("./authvalidators");

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

module.exports = router;