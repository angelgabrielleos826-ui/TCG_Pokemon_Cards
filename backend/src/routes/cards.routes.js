    const express = require("express");
    const Card = require("../models/Card");

    const router = express.Router();
    const { getCards, createCard } = require("../controllers/card.controller");//agregue getCards

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