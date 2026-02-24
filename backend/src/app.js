const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const cardsRoutes = require("./routes/cards.routes");
const orderRoutes = require("./routes/order.routes");
const ticketRoutes = require("./routes/ticket.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cards", cardsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tickets", ticketRoutes);

app.use(errorHandler);

app.get("/health", (req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
});

module.exports = app;
