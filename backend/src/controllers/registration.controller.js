const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event");

// POST /api/registrations
async function create(req, res) {
    try {

        const {
            evento,
            nombreCompleto,
            fechaNacimiento,
            boletos,
            lastFour,
            tarjetaVencimiento,
            totalPagado
        } = req.body;

        const event = await Event.findById(evento);
        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" });
        }

        const registration = await EventRegistration.create({
            evento,
            nombreCompleto,
            fechaNacimiento,
            boletos,
            lastFour,
            tarjetaVencimiento,
            totalPagado,
            usuario: req.user.id
        });

        return res.status(201).json(registration);

        // Utilizacion del catch para visualizar errores (ayuda de la IA)
    } catch (error) {
        console.error("ERROR REAL:", error);
        return res.status(500).json({ error: error.message });
    }
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

    const registration = await EventRegistration.findByIdAndDelete(id);

    if (!registration) {
        res.status(404);
        return next(new Error("Registro no encontrado"));
    }

    res.json({ ok: true });
}

module.exports = { create, list, getById, remove };
