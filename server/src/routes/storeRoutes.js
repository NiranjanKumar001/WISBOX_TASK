const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

// GET /api/stores
router.get("/", storeController.getStores);

// POST /api/stores
router.post("/", storeController.createStore);

// DELETE /api/stores/:storeId
router.delete("/:storeId", storeController.deleteStore);

module.exports = router;
