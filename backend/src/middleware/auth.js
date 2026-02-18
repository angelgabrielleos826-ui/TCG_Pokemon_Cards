const jwt = require("jsonwebtoken")
const Session = require("../models/Session");
const User = require("../models/User");

async function auth(req, res, next) {
    const token = req.cookies?.access_token;
    const session_id = req.cookies?.session_id;
    
    if(!token || !session_id){
        res.status(401);
        return next(new Error("Error de autenticacion"));
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        res.status(401);
        return next(new Error("Token expirado o invalido"));
    }

    const user = await User.findById(payload.sub).select("email role");
    if (!user){
        res.status(401);
        return next(new Error("Usuario no existente"));
    }

    req.user = {
        id: String(user._id),
        email: user.email,
        role: user.role
    };

    req.session = {
        id: String(session._id)
    };

    next();
}

module.exports = { auth };

//module.exports = function auth(req, res, next) {
  //  const header = req.headers.authorization || "";
   
  //const [type, token] = header.split(" ");

    //if (type !== "Bearer" || !token){
  ///      return res.status(401).json({ error: "Token faltante"});
  ///  }

   /// try {
  ///      const payload = jwt.verify(token, process.env.JWT_SECRET);
     ///   req.user = payload;
        ///next();
///
///    } catch {
 //       return res.status(401).json({error: "Token Invalido"});
///    }
///};