const db = require("../config/db");

// GET /api/categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.name, c.slug,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
       FROM categories c
       ORDER BY c.name ASC`,
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};
