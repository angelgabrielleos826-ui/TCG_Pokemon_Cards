const { get } = require("mongoose");
const Event = require("../models/Event");

// POST /api/events
async function create(req, res, next) {
    const {
        nombre,
        fecha,
        horaInicio,
        horaFin,
        lugar,
        entrada,
        descripcion,
        activo = true
    } = req.body;

    const event = await Event.create({
        nombre,
        fecha,
        horaInicio,
        horaFin,
        lugar,
        entrada,
        descripcion,
        activo
    });

    res.status(201).json(event);
}

// GET /api/events?
async function list(req, res, next) {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").trim();
    const sort = (req.query.sort || "-fecha").trim();

    const filter = {};

    if (search) {
        filter.nombre = { $regex: search, $options: "i"};
    }

    // Mostrar solo eventos activos
    filter.activo = true

    const [items, total] = await Promise.all([
        Event.find(filter).sort(sort).skip(skip).limit(limit),
        Event.countDocuments(filter)
    ]);

    res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items
    });
}

// GET /api/events/:id
async function getById(req, res, nex) {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
        res.status(404);
        return next(new Error("Evento no encontrado"));
    }

    res.json(event);
}

// PUT /api/events/:id
async function update(req, res, next) {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true}
    );

    if (!event) {
        res.status(404);
        return next(new Error("Evento no encontrado"));
    }

    res.json(event);
}

// DELETE /api/events/:id
async function remove(req, res, next) {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
        res.status(404);
        return next(new Error("Evento no encontrado"));
    }

    res.json({ ok: true });
}

module.exports = { create, list, getById, update, remove };