const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    numeroOrden: {
      type: String,
      required: true,
      unique: true,
    },
    productos: [
      {
        card: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Card",
        },
        nombre: {
          type: String,
          required: true,
        },
        precio: {
          type: Number,
          required: true,
          min: 0,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ["MXN", "USD"],
      default: "MXN",
    },
    exchangeRate: {
      type: Number,
      default: 1,
    },
    metodoPago: {
      type: String,
      default: "Tarjeta",
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
