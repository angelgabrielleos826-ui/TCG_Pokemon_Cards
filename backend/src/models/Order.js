const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    items: [
        {
            card:{
                type: mongoose.Types.ObjectId,
                ref: "Card",
            },
            quantity: {
                type: Number,
                min: 1
            },
            priceAtPurchase:{
                type: Number,
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ["MXN", "USD"],
        default: "MXN"
    },
    exchangeRate: {
        type: Number,
        default: 1
    },
    //Datos del envio
    shippingInfo:{
        fullName:{ type: String, required: true},
        phone: { type: String, required: true},
        address: { type: String, required: true},
        city: { type: String, required: true},
        zip: { type: String, required: true}
    },
    //Datos de la tarjeta 
    cardInfo:{
        cardHolder: {type: String, required: true},
        lastFour: {type: String, required: true},
        cardType: {type: String, required: true}
    },
    status:{
        type: String,
        enum:["Pendiente", "Pagado", "Cancelado"],
        default:"Pagado"
    }
}, {timestramps: true});

module.exports = mongoose.model("Order", orderSchema);
