const express = require("express");

// Middlewares
const { validate } = require("../middleware/validate");
const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

// Validators
const { RegistrationValidator } = require("../validators/registration.validator");

// Controllers
const registrationController = require("../controllers/registration.controller");

const router = express.Router();

// Public routes (registro de usuario)
router.post(
    '/',
    auth,
    requireRole("user"),
    RegistrationValidator,
    validate,
    registrationController.create
);

// Protected routes
router.get(
    '/',
    auth,
    requireRole("admin"),
    registrationController.list
);

router.get(
    '/:id',
    auth,
    requireRole("admin"),
    registrationController.getById
);

router.delete(
    '/:id',
    auth,
    requireRole("admin"),
    registrationController.remove
);

module.exports = router;