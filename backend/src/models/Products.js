const mongoose = require("mongoose");

const productSchema = new mongoose.Schema (
    {
        name:
        {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        category:
        {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        price:
        {
            type: Number,
            required: true,
            min: 0
        },
        stock:
        {
            type: Number,
            required: true,
            min: 0
        },
        description:
        {
            type: String,
            default: ""
        },
        isActive:
        {
            type:Boolean,
            default: true
        }
    }
)

module.exports = mongoose.model("Cart", productSchema);