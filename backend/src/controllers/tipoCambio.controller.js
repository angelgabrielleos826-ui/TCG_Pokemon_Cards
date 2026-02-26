const { obtenerTipoCambio } = require("../services/tipoCambio.service");

const getTipoCambio = async (req, res) => {
  try {
    const tasa = await obtenerTipoCambio();

    res.json({
      base: "MXN",
      USD: tasa
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTipoCambio
};