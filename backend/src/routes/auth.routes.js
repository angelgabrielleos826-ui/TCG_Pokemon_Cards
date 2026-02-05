const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// CRUD - CREATE (post), READ (get), UPDATE (put), DELETE (delete)
router.post("/register", async (req, res) => {
    const {email, password} = req.body;

    // Validacion de argumentos
    if (!email || !password) {
        return res.status(400).json({error: "email y password son requeridos"});
    }

    // Validacion de dato unico
    const exists = await User.findOne({email});
    if (exists) return res.status(409).json({error: "usuario no valido"});

    // Registrar ambos parametros, password sera encriptada
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({email, passwordHash});

    // Respuesta de seguimiento --> OK
    return res.status(201).json({id: user._id, email: user.email});
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    // Validar ambos argumentos
    if (!email || !password) {
        return res.status(400).json({error: "email y password son requeridos"});
    }

    // Validar que exista el email registrado
    const user = await User.findOne({email});
    if (!user) return res.status(401).json({error: "credenciales no validas"});

    // Validar que la contraseña sea correcta
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({error: "credenciales invalidas"});

    const token = jwt.sign(
        {sub: String(user._id), email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: "2h"}
    );

    return res.status(201).json({jwt_token: token});
});

module.exports = router;