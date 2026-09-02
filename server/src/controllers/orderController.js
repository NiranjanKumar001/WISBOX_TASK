const prisma = require("../config/prisma");
const { isValidTransition } = require("../utils/stateMachine");

// 1. Get orders for a specific store
async function getOrders(req, res) {
  const storeId = req.query.storeId;

  if (!storeId) {
    return res.status(400).json({ error: "storeId query parameter is required" });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { storeId: storeId },
      orderBy: { createdAt: "desc" }
    });
    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// 2. Create a new order
async function createOrder(req, res) {
  const { storeId, customerName, items } = req.body;
  const io = req.app.get("io");

  if (!storeId) {
    return res.status(400).json({ error: "storeId is required" });
  }

  if (!customerName) {
    return res.status(400).json({ error: "customerName is required" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "At least one item is required" });
  }

  try {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${randomNumber}`;

    const newOrder = await prisma.order.create({
      data: {
        orderId: orderId,
        storeId: storeId,
        customerName: customerName,
        items: items,
        status: "PLACED"
      }
    });

    if (io) {
      const roomName = `store:${storeId}`;
      io.to(roomName).emit("order_created", newOrder);
    }

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
}

// 3. Update order status
async function updateOrderStatus(req, res) {
  const orderIdParam = req.params.id;
  const { status: newStatus } = req.body;
  const io = req.app.get("io");

  if (!newStatus) {
    return res.status(400).json({ error: "status is required" });
  }

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderIdParam }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const transitionAllowed = isValidTransition(existingOrder.status, newStatus);
    if (!transitionAllowed) {
      return res.status(400).json({
        error: `Invalid transition from ${existingOrder.status} to ${newStatus}`
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderIdParam },
      data: { status: newStatus }
    });

    if (io) {
      const roomName = `store:${updatedOrder.storeId}`;
      io.to(roomName).emit("order_updated", updatedOrder);
    }

    return res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Failed to update order status" });
  }
}

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus
};
