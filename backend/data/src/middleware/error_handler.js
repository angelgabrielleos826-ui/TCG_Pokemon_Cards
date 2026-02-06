//Logica para procesar los errores
module.exports = function errorHandler(err, req, res, next) {
    console.error(err);

    if (err?.name == "CastError") {
        return res.status(400).json({ error: "id invalido"})
    }

    return res.status(500).json({error: "Error interno del servidor"})

}