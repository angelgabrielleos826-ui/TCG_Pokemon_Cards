const Card = require("../models/Card");
const { obtenerTipoCambio } = require("../services/tipoCambio.service");

const getCards = async (req, res) => {
  try {

    console.log("GETCARDS EJECUTADO");

    const cards = await Card.find();

    const tipoCambio = await obtenerTipoCambio();

    console.log("Tipo de cambio:", tipoCambio);

    const cardsConvertidas = cards.map(card => {
      const precioMXN = card.price;
      const precioUSD = precioMXN * tipoCambio;

      return {
        ...card.toObject(),
        precioMXN,
        precioUSD: Number(precioUSD.toFixed(2))
      };
    });

    res.json(cardsConvertidas);

  } catch (error) {
    console.error("Error en getCards:", error.message);
    res.status(500).json({ message: "Error al cargar cartas" });
  }
};


async function createCard(req, res) {
  const { name, image, price, stock } = req.body;

  if (!name || !image || !price) {
    return res.status(400).json({ error: "name, image y price son requeridos" });
  }

  const card = await Card.create({ name, image, price, stock });

  return res.status(201).json({
    id: card._id,
    name: card.name,
    price: card.price,
    stock: card.stock
  });
}

module.exports = { getCards, createCard };