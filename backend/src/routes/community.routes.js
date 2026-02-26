const express = require("express");
const auth = require("../middleware/auth");
const {validate} = require("..//middleware/validate");
const {communityValidator} = require("../validators/community.validators");
const {create, getAll, getOne, update, remove} = require("../controllers/community.controller");

const router = express.Router();

//GET
router.get("/", getAll);
//Get
router.get("/:id", getOne);
//POST
router.post("/", auth, communityValidator, validate, create);
//PUT
router.put("/:id", auth, communityValidator, validate, update);
//DELETE
router.delete("/:id", auth, remove);

module.exports = router;

