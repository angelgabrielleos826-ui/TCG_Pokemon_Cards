const express = require("express");
const cors= require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./data/src/routes/auth.routes");
const tareasRoutes = require("./data/src/routes/tareas.routes");
const errorHandler = require("./data/src/middleware/error_handler");

const app = express();

app.use(cors());
app.use(express.json());

//health check 
app.get("/health", (req, res) => {
    res.json({ ok: true, ts: new Date().toISOString});
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/tareas", tareasRoutes);



//Empty Error
app.use((req, res) =>{
    res.status(404).json({ error: "Not found "});
});

//Error Handelr
app.use(errorHandler);


async function start() {
    const port = process.env.PORT || 3000

    if (!process.env.MONGO_URI) throw new Error ("MONGO_URI no esta configurado");
    if (!process.env.JWT_SECRET) throw new Error ("JWT_SECREST no configurado");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo conectado");

    app.listen(port, ()=> console.log(`API exitosamente ejecutada http://localhost:${port}`));

};

start().catch((err)=>{
    console.error("Error al iniciar", err.message);
    process.exit(1);
});

