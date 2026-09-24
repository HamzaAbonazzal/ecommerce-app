const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");
const { userAuth } = require("../middleware/userAuth");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/me", userAuth, userCtrl.getMe);
router.put("/me", userAuth, userCtrl.updateMe);
router.delete("/me", userAuth, userCtrl.deleteMe);
router.get("/stats", userAuth, userCtrl.getMyStats);
router.get("/orders", userAuth, userCtrl.getMyOrders);
router.get("/orders/:id", userAuth, userCtrl.getMyOrderById);

module.exports = router;
