const express = require("express");
const router = express.Router();
const { createOrder, getOrderById } = require("../controllers/orderController");
const { optionalUserAuth } = require("../middleware/userAuth");

router.post("/", optionalUserAuth, createOrder);
router.get("/:id", getOrderById);

module.exports = router;
