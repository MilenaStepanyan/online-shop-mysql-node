import express from "express";
import { isAdmin } from "./isAdmin.js";
import { addProduct } from "./db.js";

const router = express.Router();

router.post("/add", isAdmin, async (req, res) => {
  try {
    const { name, description, price, picture, quantity, category, rating } = req.body;

    const productAdded = await addProduct({
      name,
      description,
      price,
      picture,
      quantity,
      category,
      rating,
    });

    res.status(201).json({ message: "Product added successfully", productAdded });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
