const express = require("express");
const router = express.Router();

const { getCards, createCard } = require("../controllers/card.controller");

router.get("/", getCards);   
router.post("/createCard", createCard);

module.exports = router;