const express = require("express");

//  Middlewares
const { validate } = require("../middleware/validate");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

// Validators
const {
    createEventValidator,
    updateEventValidator,
    listEventValidator
} = require("../validators/event.validator");

// Controllers
const eventController = require("../controllers/event.controller");

const router = express.Router();

// Public routes
router.get(
    '/',
    auth,
    listEventValidator,
    validate,
    eventController.list
);

router.get(
    '/:id',
    auth,
    eventController.getById
);

// Protected routes
router.post(
    '/',
    auth,
    requireRole("admin"),
    createEventValidator,
    validate,
    eventController.create
);

router.put(
    '/:id',
    auth,
    requireRole("admin"),
    updateEventValidator,
    validate,
    eventController.update
);

router.delete(
    '/:id',
    auth,
    requireRole("admin"),
    eventController.remove
);

module.exports = router;