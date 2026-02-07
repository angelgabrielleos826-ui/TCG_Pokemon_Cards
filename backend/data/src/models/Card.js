const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Card", CardSchema);
