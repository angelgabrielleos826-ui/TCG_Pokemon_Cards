const { body } = require("express-validator");

const registerValidator = [
    body("email")
        .notEmpty().withMessage("El email es requerido")
        .isEmail().withMessage("El email no tiene formato válido"),
    body("password")
        .notEmpty().withMessage("El password es requerido")
];

const loginValidator = [
    body("email")
        .notEmpty().withMessage("El email es requerido"),
    body("password")
        .notEmpty().withMessage("El password es requerido")
];

module.exports = { registerValidator, loginValidator };