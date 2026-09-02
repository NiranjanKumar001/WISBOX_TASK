const prisma = require("../config/prisma");

// 1. Get all available stores
async function getStores(req, res) {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { createdAt: "asc" }
    });
    return res.json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    return res.status(500).json({ error: "Failed to fetch stores" });
  }
}

// 2. Create a new store dynamically
async function createStore(req, res) {
  const { name, location } = req.body;
  const io = req.app.get("io");

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Store name is required" });
  }

  try {
    const count = await prisma.store.count();
    const storeNumber = count + 1;
    const storeId = `store_0${storeNumber}`;

    const newStore = await prisma.store.create({
      data: {
        storeId: storeId,
        name: name.trim(),
        location: location && location.trim() ? location.trim() : "Main Branch"
      }
    });

    if (io) {
      io.emit("store_created", newStore);
    }

    return res.status(201).json(newStore);
  } catch (error) {
    console.error("Error creating store:", error);
    return res.status(500).json({ error: "Failed to create store" });
  }
}

// 3. Delete a store dynamically
async function deleteStore(req, res) {
  const storeIdParam = req.params.storeId;
  const io = req.app.get("io");

  try {
    const existingStore = await prisma.store.findUnique({
      where: { storeId: storeIdParam }
    });

    if (!existingStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    await prisma.store.delete({
      where: { storeId: storeIdParam }
    });

    if (io) {
      io.emit("store_deleted", { storeId: storeIdParam });
    }

    return res.json({ message: "Store deleted successfully", storeId: storeIdParam });
  } catch (error) {
    console.error("Error deleting store:", error);
    return res.status(500).json({ error: "Failed to delete store" });
  }
}

module.exports = {
  getStores,
  createStore,
  deleteStore
};
