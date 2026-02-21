//Muestra las cartas que estan en Mongo db
const Card = require("../models/Card");

const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: "Error al cargar cartas" });
  }
};

module.exports = { getCards };