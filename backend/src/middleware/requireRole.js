function requireRole (...roles) {
    return (req, res, next) => {
        if(!req.user) {
            res.status(401);
            return next(new Error("No Autenticado"))
        }
        if(!roles.includes(req.user.role)) {
            res.status(403);
            return next(new Error("No autorizado"))
        }
        next();
    };
}
module.exports = { requireRole };