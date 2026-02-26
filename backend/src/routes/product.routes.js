const express = require("express");

// middlewares
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const { validate } = require("../middleware/validate");

// validators
const {
    createProductValidator,
    updateProductValidator,
    listProductValidator
} = require("../validators/product.validator");

// controllers
const productController = require("../controllers/product.controller");


const router = express.Router();

// Public routes
router.get(
    "/",
    listProductValidator,
    validate, 
    productController.list
);

router.get(
    "/:id",
    productController.getById
);

// Protected routes - only authenticated
router.post(
    "/",
    auth,
    createProductValidator,
    validate,
    productController.create
);

router.put(
    "/:id",
    auth,
    updateProductValidator,
    validate,
    productController.update
);

// Role based routes

router.delete(
    "/:id",
    auth,
    requireRole("admin"),
    productController.remove
);

module.exports = router;