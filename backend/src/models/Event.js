const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    horaInicio: {
        type: String,
        required: true
    },
    horaFin: {
        type: String,
        required: true
    },
    lugar: {
        type: String,
        required: true
    },
    entrada: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true});

module.exports = mongoose.model('Event', EventSchema);