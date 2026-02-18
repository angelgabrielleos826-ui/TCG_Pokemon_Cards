const User = require("../models/User");
const Session = require("../models/Sessions");

async function deleteUser(req, res, next) {
    const { id } = req.params;

    const user = await User.findById(id);
    if(!user) {
        res.status(404);
        return  next(new Error("Usuario no encontrado"));
    }

    await Session.updateMany({ userId: user._id, revokedAt: null}, { revokedAt: new Date()});
    await User.deleteOne({_id: user._id });
    res.json({ ok: true});
}
module.exports = { delateuser };