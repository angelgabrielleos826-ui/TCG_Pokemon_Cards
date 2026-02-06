const jwt = require("jsonwebtoken")

module.exports = function auth(req, res, next){
    const Header = req.Headers.authorization || "";
    const [type, token] = Header.split("");
    if (type !== "Bearer"|| !token) {
        return res.status(401).json({error: "token faltante"});

    }
    try {
        const payload =jwt.verify(token,process.env.JWT_SECRET);

        req.user =payload;
        next();
    } catch {
        return res.status(401).json({error: "Token Invalido"})
    }
    
};