const mongoose = require("mongoose");

async function connectDB() {
     if (!process.env.MONGO_URI) throw new Error ("MONGO_URI no esta configurado");

     await mongoose.connect(process.env.MONGO_URI);
         console.log("Mongo conectado");
}

module.exports = { connectDB }
