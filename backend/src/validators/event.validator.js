const { body, query } = require("express-validator");

// Validador para creacion de eventos
const createEventValidator = [
    body("nombre").isString().notEmpty().withMessage("El nombre del evento es requerido"),
    // Formato unico para representacion de fechas y horas ISO8601 (AAAA-MM-DD)
    body("fecha").isISO8601().notEmpty().withMessage("Fecha invalida, formato YYYY-MM-DD requerido"),
    // Validaciones de formato 24hrs con .matches (HH:MM) con ayuda de la IA descubrimos esta operacion
    body("horaInicio").matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora de inicio invalida, formato HH:MM"),
    body("horaFin").matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora de fin invalida, formato HH:MM"),
    body("lugar").isString().notEmpty().withMessage("El lugar es requerido"),
    body("entrada").isFloat({ min: 0 }).withMessage("La entrada debe ser mayor o igual a 0"),
    body("descripcion").isString().notEmpty().withMessage("La descripcion es requerida"),
    body("activo").optional().isBoolean().withMessage("Valor invalido")
];

// Validador para la actualizacion de eventos
const updateEventValidator = [
    body("nombre").optional().isString().notEmpty().withMessage("Nombre invalido"),
    // Formato unico para representacion de fechas y horas ISO8601 (AAAA-MM-DD)
    body("fecha").optional().isISO8601().notEmpty().withMessage("Fecha invalida"),
    // Validaciones de formato 24hrs con .matches (HH:MM) con ayuda de la IA descubrimos esta operacion
    body("horaInicio").optional().matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora de inicio invalida"),
    body("horaFin").optional().matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora de fin invalida"),
    body("lugar").optional().isString().notEmpty().withMessage("Lugar invalido"),
    body("entrada").optional().isFloat({ min: 0 }).withMessage("Entrada invalida"),
    body("descripcion").optional().isString().notEmpty().withMessage("Descripcion invalida"),
    body("activo").optional().optional().isBoolean().withMessage("Valor invalido")
];

// Validador para la visualizacion de eventos
const listEventValidator = [
    query("page").optional().isInt({ min: 1 }).withMessage("Pagina invalida"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limite invalido"),
    query("search").optional().isString().withMessage("Busqueda invalida"),
    query("sort").optional().isString().withMessage("Ordenamiento invalido"),
    query("activo").optional().isBoolean().withMessage("Filtro invalido")
];

module.exports = {
    createEventValidator,
    updateEventValidator,
    listEventValidator
};