const express = require("express");
const router = express.Router();

const { getTipoCambio } = require("../controllers/tipoCambio.controller");

router.get("/", getTipoCambio);

module.exports = router;