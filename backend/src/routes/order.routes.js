const express = require("express")
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const router = express.Router();

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

        if (cart && cart.items.length > 0) { //Aqui tambien en esta linea utilice IA pqno sabia como usar el carrito del backend
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
        }else if (total && total > 0) {
            // ✅ CAMBIO: si no hay carrito, usar solo el total // esto tmb es con IA para resolver un error
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

        await Cart.findOneAndDelete({ user: req.user.sub });
        res.status(201).json({mensaje: "Compra realizada con exito", order});

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