const axios = require("axios");

async function obtenerTipoCambio() {
  try {
    const response = await axios.get(
      "https://open.er-api.com/v6/latest/MXN"
    );

    return response.data.rates.USD;

  } catch (error) {
    console.error("Error real:", error.response?.data || error.message);
    throw new Error("No se pudo obtener el tipo de cambio");
  }
}

module.exports = {
  obtenerTipoCambio
};