const express = require("express")
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Ticket = require("../models/Ticket");

const router = express.Router();

function buildTicketFromOrder(order, paymentMethod = "Tarjeta") {
    const productos = order.items.map((item) => {
        const precio = item.priceAtPurchase || item.card?.price || 0;
        const cantidad = item.quantity || 1;

        return {
            card: item.card?._id || item.card,
            nombre: item.card?.name || "Producto",
            precio,
            cantidad,
            subtotal: precio * cantidad
        };
    });

    return {
        order: order._id,
        user: order.user,
        numeroOrden: `PKM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productos,
        total: order.total,
        metodoPago: paymentMethod,
    };
}

//POST - FINALIZAR COMPRA
router.post("/checkout", auth, async(req, res) => {
    try {
        const { shippingInfo, cardInfo, items, total } = req.body;

        if(!shippingInfo || !cardInfo){
            return res.status(400).json({error: "Faltan datos de envio o tarjeta"});
        }

        // Usar items del frontend si el carrito del backend está vacío
        let orderItems = [];
        let orderTotal = 0;

        const cart = await Cart.findOne({user: req.user.sub}).populate("items.card");

        if (cart && cart.items.length > 0) {
            // Usar carrito del backend
            cart.items.forEach(item => {
                const price = item.card.price;
                orderTotal += price * item.quantity;
                orderItems.push({
                    card: item.card._id,
                    quantity: item.quantity,
                    priceAtPurchase: price
                });
            });
        }else if (items && items.length > 0) {
            orderItems = items.map((item) => ({
                card: item.card || item.cardId,
                quantity: item.quantity || 1,
                priceAtPurchase: item.priceAtPurchase || item.price || 0,
            }));

            orderTotal = orderItems.reduce(
                (acc, item) => acc + item.priceAtPurchase * item.quantity,
                0
            );
        }else if (total && total > 0) {
            orderTotal = total; 
        } else {
            return res.status(400).json({error: "El carrito esta vacio"});
        }

        const lastFour = cardInfo.cardNumber.slice(-4);

        const order = await Order.create({
            user: req.user.sub,
            items: orderItems,
            total: orderTotal,
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
