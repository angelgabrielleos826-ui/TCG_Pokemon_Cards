    const express = require("express");
    const Card = require("../models/Card");

    const router = express.Router();

    // Ver todas las cartas
    router.get(
        "/",
        async(req, res) => {
            const cards = await Card.find();
            res.json(cards);
        }
    );

    module.exports = router;