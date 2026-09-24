const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
require("dotenv").config();

// ✏️ غيّر القيم هنا
const ADMIN_USERNAME = "admin";
const ADMIN_EMAIL = "admin@shopverse.com";
const ADMIN_PASSWORD = "admin123";

(async () => {
  try {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    console.log(`🔐 Generated hash`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await conn.execute(
      `UPDATE admins SET password_hash = ?, email = ? WHERE username = ?`,
      [hash, ADMIN_EMAIL, ADMIN_USERNAME],
    );

    console.log("✅ Admin updated");
    await conn.end();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
