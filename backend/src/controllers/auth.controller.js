const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Session = require("../models/Session")

function cookieOptions () {
    return {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"  
    }
}

// CRUD = Create Reade Update Delete
async function register (req, res, next) { 
    const {email, password, role} = req.body;

    //validar ambos argumentos
    if (!email || !password) {
        return res.status(400).json({error: "email y password son requeridos"});
    }

    //Validacion dato unico
    const exists = await User.findOne({ email});
    if (exists) return res.status(409).json({error: "usuario no valido"})

    //Registrar ambos parametros, password capa encriptada
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create ({ email, passwordHash, role: role});

    //Respuesta de seguimiento -> OK
    return res.status(201).json(
        {
            id: user._id, 
            email: user.email, 
            role: user.role 
        }
    );
};

async function login (req, res)  {
    const {email, password} = req.body;

    //validar ambos argumentos
    if (!email || !password) {
        return res.status(400).json({error: "email y password son requeridos"});
    }

    //Validar que exista el email registrado
     const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error : "Usuario no valido"});

    //Validar que la contraseña sea correcta
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(401).json({error: "credenciales invalidas"});
    
    const expiredMinutes = 10;
    const expiresAt = new Date(Date.now()+expiredMinutes* 60 * 1000);
    
    const session = await Session.create(
        {
            userId: user._id,
            expiresAt
        }
    );

    const token = jwt.sign(
        {
            sub: String(user._id),
            email: user.email,
            role: user.role,
            sid: String(session._id)
        },
        process.env.JWT_SECRET,
        { expiresIn: `${expiredMinutes}m` }
    );

    //return res.status(201).json({jwt_token: token});
    res
    .cookie("access_token", token, cookieOptions())
    .cookie("session_id", String(session._id), cookieOptions())
    .json({ ok:true });
};

async function logout(req, res, next) {
    const sessionId = req.cookies?.session_id;
    if(sessionId) {
        await Session.findByIdAndUpdate(sessionId,{ revokedAt: new Date() });
    }

    res
    .clearCookie("access_token", cookieOptions())
    .clearCookie("session_id", cookieOptions())
    .json({ ok: true });
}
async function me (req, res) {
    res.json(req.user);
}

module.exports = { register, login, logout, me };