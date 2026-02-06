const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User= require("../models/User");

const router =express.Router()
//CRUD - CRATE (post), READ (get), UPDATE (update,put), DELETE (delete)

router.post("/register", async(req, res) => {
    const{ email, password}=req.body;

    //Validacion de argumentos
    if (!email || !password){
        return res.status(400).json({error: "email y pasword son requeridos"});
        }

    //validacion de dato unico
        const exists = await User.findOne({email});
        if(exists)return res.status(409).json({error: "Usuario no encontrado"});

    // Registrar ambos aprametros, Password sera incriptado
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({email,passwordHash });

    //Respuesta de seguimiento -> OK!
        return res.status(201).json({id: user._id, email: user.email});
    });

    router.post("/login", async(req,res) => {
        const {email, password} =req.body;
    //Validar ambos argumentos
        if (!email || !password) {
            return res.status(400).json({error: "email y password son requeridos"});

        }
        // Validar que la contraseña sea correcta
        const ok = await bcrypt.compare(password,user.passwordHash);
        if(!ok) return res.status(401).json({error:"credenciales invalidas"});

        const token =jwt.sign(
            {sub: String}
        )

    });
    module.exports = router;

    
    

