const mongoose = require("mongoose")

const communitySchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    precio:{
        type: Number,
        required: true,
        min: 1 
    }, 

    cantidad: {
        type: Number,
        required: true,
        min: 1

    },
    contacto:{
        type: String,
        required: true,
        trim: true
    },

    image:{
        type: String,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model("community", communitySchema);