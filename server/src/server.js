const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const storeRoutes = require("./routes/storeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");
const setupSocketHandlers = require("./socket/socketHandler");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

const PORT = process.env.PORT || 5000;

// Share io instance with express app handlers
app.set("io", io);

app.use(cors());
app.use(express.json());

// REST API Routers
app.use("/api/stores", storeRoutes);
app.use("/api/orders", orderRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Setup Socket.IO Room Handlers
setupSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
