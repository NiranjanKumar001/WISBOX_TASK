const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// GET /api/orders
router.get("/", orderController.getOrders);

// POST /api/orders
router.post("/", orderController.createOrder);

// PATCH /api/orders/:id/status
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
