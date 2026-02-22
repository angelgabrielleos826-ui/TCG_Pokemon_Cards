const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event");

// POST /api/registrations
async function create(req, res, next) {
    const {
        evento,
        nombreCompleto,
        fechaNacimiento,
        boletos,
        tarjetaNumero,
        tarjetaCVV,
        tarjetaVencimiento,
        totalPagado
    } = req.body;

    // Verificacion de la existencia del evento
    const event = await Event.findById(evento);
    if (!event) {
        res.status(404);
        return next(new Error("Evento no encontrado"));
    }

    const registration = await EventRegistration.create({
        usuario: req.user._id,
        evento,
        nombreCompleto,
        fechaNacimiento,
        boletos,
        tarjetaNumero,
        tarjetaCVV,
        tarjetaVencimiento,
        totalPagado
    });

    res.status(201).json(registration);
}

// GET /api/registrations
async function list(req, res, next) {
    const registrations = await EventRegistration.find()
        .populate("evento")
        .populate("usuario", "email role");

    res.json(registrations);
}

// GET /api/registrations/:id
async function getById(req, res, next) {
    const { id } = req.params;

    const registration = await EventRegistration.findById(id)
        .populate("evento")
        .populate("usuario", "email");

    if (!registration) {
        res.status(404);
        return next(new Error("Registro no encontrado"));
    }

    res.json(registration);
}

// DELETE /api/registrations/:id
async function remove(req, res, next) {
    const { id } = req.params;

    const registration = await EventRegistration.findOneAndDelete(id);

    if (!registration) {
        res.status(404);
        return next(new Error("Registro no encontrado"));
    }

    res.json({ ok: true });
}

module.exports = { create, list, getById, remove };
