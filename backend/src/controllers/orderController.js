const db = require("../config/db");
const { optionalUserAuth } = require("../middleware/userAuth");

// POST /api/orders
// Body: { customer_name, customer_email, customer_phone, customer_address, items: [{ product_id, quantity }] }
exports.createOrder = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      items,
    } = req.body;

    const userId = req.user?.id || null;

    // Validation
    if (
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      !customer_address
    ) {
      return res.status(400).json({
        success: false,
        message: "All customer fields are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // ابدأ Transaction
    await conn.beginTransaction();

    // 1) اجلب المنتجات وتأكد من المخزون + احسب الإجمالي
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const [rows] = await conn.query(
        "SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE",
        [item.product_id],
      );

      if (rows.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      const product = rows[0];
      const qty = Number(item.quantity);

      if (qty <= 0) throw new Error("Quantity must be positive");
      if (product.stock < qty) {
        throw new Error(`Not enough stock for "${product.name}"`);
      }

      total += Number(product.price) * qty;
      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: qty,
        price: product.price,
      });
    }

    // 2) أنشئ الطلب
    const [orderResult] = await conn.query(
      `INSERT INTO orders
        (user_id, customer_name, customer_email, customer_phone, customer_address, total, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userId,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        total,
      ],
    );

    const orderId = orderResult.insertId;

    // 3) أضف العناصر + اخصم المخزون
    for (const item of orderItems) {
      await conn.query(
        `INSERT INTO order_items
          (order_id, product_id, product_name, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.product_name,
          item.quantity,
          item.price,
        ],
      );

      await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
        item.quantity,
        item.product_id,
      ]);
    }

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { order_id: orderId, total },
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const [items] = await db.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [req.params.id],
    );

    res.json({
      success: true,
      data: { ...orders[0], items },
    });
  } catch (err) {
    next(err);
  }
};
