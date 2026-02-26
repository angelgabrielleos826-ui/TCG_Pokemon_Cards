const express = require("express");
const router = express.Router();

const { getCards, createCard } = require("../controllers/card.controller");

router.get("/", getCards);   
router.post("/createCard", createCard);

module.exports = router;

    // Ver todas las cartas
    router.get(
        "/",
        async(req, res) => {
            const cards = await Card.find();
            res.json(cards);
        }
    );

    router.post("/createCard", createCard);

    module.exports = router;