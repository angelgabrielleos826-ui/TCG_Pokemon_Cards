// Logica para procesar los errores

module.exports = function errorHandler(err, req, res, next) {
    console.error(err);

    if(err?.name == "CastError") {
        return res.status(400).json({error: "id invalido"});
    }

    const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    return res.status(status).json({error: err.message || "Error interno del servidor"});
};