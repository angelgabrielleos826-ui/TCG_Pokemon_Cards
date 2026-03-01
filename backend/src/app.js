const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const cardsRoutes = require("./routes/cards.routes");
const orderRoutes = require("./routes/order.routes");
const ticketRoutes = require("./routes/ticket.routes");
const tipoCambioRoutes = require("./routes/tipoCambio.routes");
const errorHandler = require("./middleware/errorHandler");
const productRoutes = require("./routes/product.routes");
const eventRoutes = require("./routes/event.routes");
const registrationRoutes = require("./routes/registration.routes");
const communityRoutes = require("./routes/community.routes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, "../frontend/src/pages"), {
  index: false
}));

app.get("/", (req, res) => {
  res.redirect("http://localhost:5173/login");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/cards", cardsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/tipo-cambio", tipoCambioRoutes);
app.use("/api/community", communityRoutes);

app.use(errorHandler);

app.get("/health", (req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
});

module.exports = app;