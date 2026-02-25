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
async function createCard(req, res, ) {
    const { name, image, price, stock } = req.body;

    // Validamos los  campos obligatorios
    if (!name || !image || !price) {
        return res.status(400).json({ error: "name, image y price son requeridos" });
    }

    // Creacion de la carta
    const card = await Card.create({ name, image, price, stock });

    // Respuesta de seguimiento
    return res.status(201).json({
        id: card._id,
        name: card.name,
        price: card.price,
        stock: card.stock
    });
}


module.exports = { getCards, createCard };