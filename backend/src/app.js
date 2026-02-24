const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Routes
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middleware/errorHandler");
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");
const registrationRoutes = require("./routes/registration.routes");

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

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