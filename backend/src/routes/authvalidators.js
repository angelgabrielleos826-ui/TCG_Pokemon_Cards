const { body } = require("express-validator")

const registerValidator = [
    body("email").isEmail().withMessage("Introduce un email valido"),
    body("password").isLength({ min: 4}).withMessage("Longitud minima, 4 caracteres")
];
const loginValidator = [
    body("email").isEmail().withMessage("Introduce un email valido"),
    body("password").notEmpty().withMessage("Introduce la contraseña")
];

module.exports = {registerValidator, loginValidator};
