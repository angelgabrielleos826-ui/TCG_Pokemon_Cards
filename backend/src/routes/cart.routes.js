const express = require("express");
const auth = require("../middleware/auth");
const Card = require("../models/Card");
const Cart = require("../models/Cart");

const router = express.Router();

router.get("/", auth, async(req, res) => {
    const cart = await Cart.findOne({user: req.user.sub}).populate("items.card");
    if(!cart) {
        return res.json({ items: [] });
    }
    let total = 0;
    cart.items.forEach(item => {
        total += item.card.price * item.quantity;
    });
    res.json({cart, total});
});

router.post("/add", auth, async(req, res) => {
    const { cardId, quantity } = req.body;
    if (!cardId) {
        return res.status(400).json({error: "Id de carta requerido"});
    }
    let cart = await Cart.findOne({ user: req.user.sub });
    if (!cart) {
        cart = await Cart.create({ user: req.user.sub, items: [] });
    }
    const index = cart.items.findIndex(item => item.card.toString() === cardId);
    if (index >= 0) {
        cart.items[index].quantity += quantity || 1;
        if (cart.items[index].quantity <= 0) {
            cart.items.splice(index, 1);
        }
    } else {
        cart.items.push({ card: cardId, quantity: quantity || 1 });
    }
    await cart.save();
    res.json(cart);
});

router.delete("/remove/:id", auth, async(req, res) => {
    const cardId = req.params.id;
    const cart = await Cart.findOne({user: req.user.sub});
    if (!cart) {
        return res.status(404).json({error: "Carrito vacío"});
    }
    cart.items = cart.items.filter(item => item.card.toString() !== cardId);
    await cart.save();
    res.json(cart);
});

router.delete("/clear", auth, async(req, res) => {
    await Cart.findOneAndDelete({user: req.user.sub});
    res.json({message: "Carrito vaciado"});
});

module.exports = router;