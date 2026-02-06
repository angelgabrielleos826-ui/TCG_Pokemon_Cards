const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
        type: String,
        requiered: true, 
        unique: true,
        trim: true,
        lowercase: true 
        },
        passwordHash: {
        type: String,
        requiered: true
    
        },
    },
    {timestamps: true}


);

module.exports = mongoose.model("User", UserSchema);