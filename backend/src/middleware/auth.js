const jwt = require("jsonwebtoken")

module.exports = function auth(req, res, next) {
    const header = req.headers.authorization || "";
    const [type, token] = header.split("");

    if (type !== "Bears" || !token){
        return res.status(401).json({ error: "Token faltante"});
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();

    } catch {
        return res.status(401).json({error: "Token Invalido"});
    }
};