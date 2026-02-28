const {body} = require("express-validator");

const communityValidator = [
    body("nombre")
    .notEmpty().withMessage("El nombre es requerido")
    .isString().withMessage("El nombre debe ser texto")
    .trim(),

    body("description")
    .notEmpty().withMessage("La descripcion es requerida")
    .isString().withMessage("La descripcion debe ser texto")
    .trim(),

    body("precio")
    .notEmpty().withMessage("El precio es requerido")
    .isNumeric().withMessage("El precio debe ser un numero")
    .custom(value => value > 0). withMessage("El precio debe ser mayor a 0"),

    body("cantidad")
    .notEmpty().withMessage("La cantidad es requerida")
    .isInt({min:1}).withMessage("La cantidas debe ser un numero entero mayor a 0"),

    body("contacto")
    .notEmpty().withMessage("El contacto es requerido")
    .isString().withMessage("El contacto debe ser texto")
    .trim()
];
module.exports = { communityValidator };