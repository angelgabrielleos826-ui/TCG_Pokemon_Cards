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
    tarjetaNumero: {
        type: String,
        required: true
    },
    tarjetaCVV: {
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
}, {timeseries: true});

// Encryptacion - Informacion sensible hasheada
EventRegistrationSchema.pre('save', async function(next){

    if (this.isModified('tarjetaNumero')) {
        this.tarjetaNumero = await bcrypt.hash(this.tarjetaNumero, 10);
    }
    
    if (this.isModified('tarjetaCVV')) {
        this.tarjetaCVV = await bcrypt.hash(this.tarjetaCVV, 10);
    }

    if (this.isModified('tarjetaVencimiento')) {
        this.tarjetaVencimiento = await bcrypt.hash(this.tarjetaVencimiento);
    }

    next();
});

module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);