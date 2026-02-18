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
        expresAt: {
             type: Date,
            required: true,
            index: true
        },
    },
        {
            timestramps: true

        }
);

sesionSchema.index({expresAt: 1}, {expireAfterSeconds:0});
module.exports = mongoose.model("Session", sesionSchema);
module.exports = mongoose.model("Session", sesionSchema);
