-- ================================
-- E-commerce Database Schema
-- ================================

-- CREATE DATABASE IF NOT EXISTS ecommerce_db
--   CHARACTER SET utf8mb4
--   COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;

-- ---------- categories ----------
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS admins;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- products ----------
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- orders ----------
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  customer_address TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending','confirmed','shipped','delivered','cancelled')
    DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- order_items ----------
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  product_name VARCHAR(200) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- admins ----------
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;