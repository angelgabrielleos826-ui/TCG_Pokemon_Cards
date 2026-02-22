const { body } = require("express-validator");

// Validador para registro de usuarios a eventos
const RegistrationValidator = [
    body("nombreCompleto").isString({ min: 3 }).withMessage("Nombre completo invalido"),
    body("fechaNacimiento").isISO8601().withMessage("Fecha de nacimiento invalida"),
    body("boletos").isInt({ min: 1 }).withMessage("Cantidad de boletos invalida"),
    body("tarjetaNumero").isNumeric().isLength({ min: 3, max: 3 }).withMessage("CVV invalido"),
    body("tarjetaVencimiento").matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage("Formato de vencimiento invalido (MM-YY)"),
    body("totalPagado").isFloat({ min: 0 }).withMessage("Total pagado invalido")
];

module.exports = { RegistrationValidator };