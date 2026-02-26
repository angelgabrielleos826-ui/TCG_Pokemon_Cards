const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EventRegistrationSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    nombreCompleto: {
        type: String,
        required: true
    },
    fechaNacimiento: {
        type: Date,
        required: true
    },
    boletos: {
        type: Number,
        required: true
    },
    lastFour: {
        type: String,
        required: true
    },
    tarjetaVencimiento: {
        type: String,
        required: true
    },
    totalPagado: {
        type: Number,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);