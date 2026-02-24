const express = require("express");
const auth = require("../middleware/auth");
const Ticket = require("../models/Ticket");

const router = express.Router();

router.get("/my-tickets", auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.sub })
      .sort({ fecha: -1 })
      .populate("order", "total status")
      .populate("productos.card", "name image");

    res.json(tickets);
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    res.status(500).json({ error: "Error al obtener tickets" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("order", "total status")
      .populate("productos.card", "name image");

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    if (String(ticket.user) !== req.user.sub) {
      return res.status(403).json({ error: "No autorizado" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error al obtener ticket:", error);
    res.status(500).json({ error: "Error al obtener ticket" });
  }
});

module.exports = router;
