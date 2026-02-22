const express = require("express");
const { register, login, logout, me } = require("../controllers/auth.controller");
const { validate } = require("../middleware/validate");
const { registerValidator, loginValidator } = require("../validators/auth.validators");
const auth = require("../middleware/auth"); 

const router = express.Router();

//POST
router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", auth, logout);

//GET
router.get("/me", auth, me);
 
module.exports = router;