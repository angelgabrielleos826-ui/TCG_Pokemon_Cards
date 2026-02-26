const express = require("express")
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Ticket = require("../models/Ticket");
const { obtenerTipoCambio } = require("../services/tipoCambio.service");

const router = express.Router();

function round2(value) {
    return Number((Number(value) || 0).toFixed(2));
}

function buildTicketFromOrder(order, paymentMethod = "Tarjeta") {
    const currency = order.currency || "MXN";

    const productos = order.items.map((item) => {
        const precio = round2(item.priceAtPurchase || item.card?.price || 0);
        const cantidad = item.quantity || 1;

        return {
            card: item.card?._id || item.card,
            nombre: item.card?.name || "Producto",
            precio,
            cantidad,
            subtotal: round2(precio * cantidad)
        };
    });

    return {
        order: order._id,
        user: order.user,
        numeroOrden: `PKM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productos,
        total: round2(order.total),
        currency,
        exchangeRate: order.exchangeRate || 1,
        metodoPago: paymentMethod,
    };
}

//POST - FINALIZAR COMPRA
router.post("/checkout", auth, async(req, res) => {
    try {
        const { shippingInfo, cardInfo, items, total, currency } = req.body;

        if(!shippingInfo || !cardInfo){
            return res.status(400).json({error: "Faltan datos de envio o tarjeta"});
        }

        const selectedCurrency = currency === "USD" ? "USD" : "MXN";
        let exchangeRate = 1;

        if (selectedCurrency === "USD") {
            exchangeRate = await obtenerTipoCambio();
        }

        // Usar items del frontend si el carrito del backend está vacío
        let orderItems = [];
        let orderTotal = 0;

        const cart = await Cart.findOne({user: req.user.sub}).populate("items.card");

        if (cart && cart.items.length > 0) {
            // Usar carrito del backend
            cart.items.forEach(item => {
                const basePrice = Number(item.card.price || 0);
                const price = selectedCurrency === "USD" ? basePrice * exchangeRate : basePrice;
                const priceAtPurchase = round2(price);

                orderTotal += priceAtPurchase * item.quantity;
                orderItems.push({
                    card: item.card._id,
                    quantity: item.quantity,
                    priceAtPurchase
                });
            });

            orderTotal = round2(orderTotal);
        } else if (items && items.length > 0) {
            orderItems = items.map((item) => ({
                card: item.card || item.cardId,
                quantity: item.quantity || 1,
                priceAtPurchase: round2(item.priceAtPurchase || item.price || 0),
            }));

            orderTotal = round2(orderItems.reduce(
                (acc, item) => acc + item.priceAtPurchase * item.quantity,
                0
            ));
        } else if (total && Number(total) > 0) {
            orderTotal = round2(total);
        } else {
            return res.status(400).json({error: "El carrito esta vacio"});
        }

        if (!Number.isFinite(orderTotal) || orderTotal <= 0) {
            return res.status(400).json({ error: "Total inválido" });
        }

        const lastFour = cardInfo.cardNumber.slice(-4);

        const order = await Order.create({
            user: req.user.sub,
            items: orderItems,
            total: orderTotal,
            currency: selectedCurrency,
            exchangeRate: selectedCurrency === "USD" ? exchangeRate : 1,
            shippingInfo,
            cardInfo:{
                cardHolder: cardInfo.cardHolder,
                lastFour,
                cardType: cardInfo.cardType
            }
        });

        const orderWithCards = await Order.findById(order._id).populate("items.card", "name price image");

        const ticketPayload = buildTicketFromOrder(orderWithCards, cardInfo.cardType || "Tarjeta");
        const ticket = await Ticket.create(ticketPayload);

        await Cart.findOneAndDelete({ user: req.user.sub });
        res.status(201).json({mensaje: "Compra realizada con exito", order: orderWithCards, ticket});

    } catch (error) {
        console.error("Error en el checkout:", error);
        res.status(500).json({error: "Error al procesar la compra"});
    }
});

//Ver historial de compras del usuario 
router.get("/my-orders", auth, async (req, res) =>{
    try{
        const orders = await Order.find({user: req.user.sub})
        .populate("items.card")
        .sort({createdAt: -1});

        res.json(orders);
    } catch (error){
        res.status(500).json({error: "Error al obtener ordenes"});
    }
});

module.exports = router;
