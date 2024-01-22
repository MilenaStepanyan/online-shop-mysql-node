import express from 'express';
import { authMiddleware } from './authMiddleware.js';
import pool from './db.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ msg: 'Please provide name, description, and price' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [name, description, price]
    );

    const newProductId = result[0].insertId;

    const newProduct = {
      id: newProductId,
      name,
      description,
      price,
    };

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.get("/:id", async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, description, price } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
      [name, description, price, productId]
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const updatedProduct = {
      id: productId,
      name,
      description,
      price,
    };

    res.json({ msg: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const result = await pool.query('DELETE FROM products WHERE id = ?', [productId]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product deleted successfully", product: { id: productId } });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

export default router;
