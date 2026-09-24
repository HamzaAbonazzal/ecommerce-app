const db = require("../config/db");

// GET /api/products
// Query params: ?category=slug&search=text&sort=price_asc|price_desc|newest
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;

    let sql = `
      SELECT p.id, p.name, p.description, p.price, p.stock,
             p.image_url, p.category_id, p.created_at,
             c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      sql += " AND c.slug = ?";
      params.push(category);
    }

    if (search) {
      sql += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // ترتيب
    const sortMap = {
      price_asc: "p.price ASC",
      price_desc: "p.price DESC",
      newest: "p.created_at DESC",
      name_asc: "p.name ASC",
    };
    sql += ` ORDER BY ${sortMap[sort] || "p.created_at DESC"}`;

    const [rows] = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};
