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

//Crear carta que se subira a la base de datos
const createCard = async (req, res) => {
  try {
    const {name, image, price, stock } = req.body;

    if (!name || !image || !price) {
      return res.status(400).json({
        message: "No se han llenado los campos obligatorios"
      });
    }
    const card = new Card({
      name: name,
      image: image,
      price: price,
      stock: stock
    });

    await card.save();

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la carta"})
  }

};

module.exports = { getCards, createCard };