const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminCtrl = require("../controllers/adminController");

// عام
router.post("/login", adminCtrl.login);

// محمي بـ JWT
router.get("/me", auth, adminCtrl.getMe);

router.get("/products", auth, adminCtrl.getAllProducts);
router.post("/products", auth, adminCtrl.createProduct);
router.put("/products/:id", auth, adminCtrl.updateProduct);
router.delete("/products/:id", auth, adminCtrl.deleteProduct);

router.get("/orders", auth, adminCtrl.getAllOrders);
router.get("/orders/:id", auth, adminCtrl.getOrderById);
router.patch("/orders/:id/status", auth, adminCtrl.updateOrderStatus);

router.get("/stats", auth, adminCtrl.getStats);

module.exports = router;
