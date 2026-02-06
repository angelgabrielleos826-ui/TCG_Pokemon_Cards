// Lógica para procesar los errores
    module.exports = function errorHandler(err, req, res, next) {
        if(err?.name =="casterror") {
        return res.status(400).json({error: "id Invalido"})

    }

    return res.status(500).json({errro: "Error interno del servidor"})
}