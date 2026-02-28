const mongoose = require("mongoose");

const sesionSchema = new mongoose.Schema(
    {
        uderId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
            index: true 
        },
        revokedAt: {
            type: Date,
            default: null
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
        {
            timestramps: true
        }
);

sesionSchema.index({expiresAt: 1}, {expireAfterSeconds:0});
module.exports = mongoose.model("Session", sesionSchema);