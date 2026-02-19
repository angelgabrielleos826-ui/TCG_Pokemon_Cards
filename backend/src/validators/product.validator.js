const { body, query } = require("express-validator");

const createProductValidator = [
    body("name").isString().notEmpty().withMessage("Nombre del producto requerido"),
    body("category").isString().notEmpty().withMessage("Categoria del producto requerida"),
    body("price").isFloat({ min:0 }).withMessage("El precio debe ser mayor a 0"),
    body("stock").optional().isInt({ min:0 }).withMessage("Introduce la cantidad de stock"),
    body("description").optional().isString().withMessage("Introduce descripcion"),
    body("isActive").optional().isBoolean().withMessage("Introduce valor valido")
];

const updateProductValidator = [
    body("name").optional().isString().notEmpty().withMessage("Nombre invalido"),
    body("category").optional().isString().notEmpty().withMessage("Categoria invalida"),
    body("price").optional().isFloat({ min:0 }).withMessage("Precio invalido"),
    body("stock").optional().isInt({ min:0 }).withMessage("Stock invalido"),
    body("description").optional().isString().withMessage("Descripcion invalida"),
    body("isActive").optional().isBoolean().withMessage("Valor invalido")
];

const listProductValidator = [
    query("page").optional().isInt({ min: 1 }).withMessage("Pagina invalida"),
    query("limit").optional().isInt({ min: 1, max: 300 }).withMessage("Limite invalido"),
    query("search").optional().isString().withMessage("Busqueda invalida"),
    query("category").optional().isString().withMessage("Categoria invalida"),
    query("sort").optional().isString().withMessage("Ordenamiento invalido")
];

module.exports = { 
    createProductValidator, 
    updateProductValidator, 
    listProductValidator
};