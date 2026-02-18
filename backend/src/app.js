const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Routes
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middleware/errorHandler");


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)
// Error Handler
app.use(errorHandler);

//Health check
app.get("/health", (req, res) => {
    res.json (
        {
            ok: true,
            ts: new Date().toISOString()
        }
    );
});


module.exports = app;