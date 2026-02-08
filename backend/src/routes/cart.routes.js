const express = require("express");
const auth = require("../middleware/auth");
const Card = require("../models/Card");
const Cart = require("../models/Cart");

const router = express.Router();

// Leer el carrito
router.get(
    "/",
    auth, async(req, res) => {
        
        const cart = await Cart.findOne({user: req.user.sub})
        .populate("items.card");

        if(!cart) {
            return res.json({ items: [] });
        }

        // Calcular el total dentro del carrito (Extra para get)
        // Aqui tuvimos un error la IA nos ayudo para este extra
        let total = 0;

        cart.items.forEach(item => {
            total += item.card.price * item.quantity;
        });

        res.json({cart, total});
    }
);

// Agregar cartas al carrito (si encuentra una lo actualiza)
router.post(
    "/add",
    auth, async(req, res) => {
        
        const { cardId, quantity } = req.body;

        if (!cardId) {
            return res.status(400).json({error: "Id de carta requerido"});
        }

        let cart = await Cart.findOne({ user: req.user.sub });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.sub,
                items: []
            });
        }

        const index = cart.items.findIndex(
            item => item.card.toString() === cardId
        );

        if (index >= 0) {
            cart.items[index].quantity += quantity || 1;
        } else {
            cart.items.push({
                card: cardId,
                quantity: quantity || 1
            });
        }

        await cart.save();

        res.json(cart);
    }
);

// Eliminar carta del carrito
router.delete(
    // Se realizo con /id pero genero problemas asi que se acudio a la IA que recomendo usar /remove/:id para evitar confusiones con express
    "/remove/:id",
    auth, async(req, res) => {
        
        const cardId = req.params.id;

        const cart = await Cart.findOne({user: req.user.sub});

        if (!cart) {
            return res.status(404).json({error: "Carrito vacío"});
        }

        cart.items = cart.items.filter(
            item => item.card.toString() !== cardId
        );

        await cart.save();

        res.json(cart);
    }
);

// Extra Delete para vaciar el carrito completo
router.delete(
    "/clear",
    auth, async(req, res) => {
        await Cart.findOneAndDelete({user: req.user.sub});

        res.json({message: "Carrito vaciado"});
    }
);

module.exports = router;