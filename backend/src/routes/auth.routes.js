const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

router.post("/register"), async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: "email y password son requeridos"});
    }

    const exists = await User.findOne({email});
    if (exists) return res.status(409).json({error: "usuario no valido"});

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({email, passwordHash});

    return res.status(201).json({id: user._id, email: user.email});
};

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: "email y password son requeridos"});
    }
    
    const exists = await User.findOne({email});
    if (!exists) return res.status(401).json({error: "credenciales no validas"});

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({error: "credenciales invalidas"});

    const token = jwt.sign(
        {sub: String(user._id), email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: "2h"}
    );
});

module.exports = router;