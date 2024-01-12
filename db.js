import mysql2 from "mysql2/promise";

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "milena.777",
  database: "online_shop",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error(`Error connecting to the database: ${err.message}`);
  } else {
    console.log("Database connected");
    connection.release();
  }
});

const addProduct = async (productInfo) => {
  try {
    const { name, description, price, picture, quantity, category, rating } = productInfo;

    const result = await pool.query(
      "INSERT INTO products (name, description, price, picture, quantity, category, rating) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, picture, quantity, category, rating]
    );

    return result;
  } catch (error) {
    throw error;
  }
};

export { addProduct };
export default pool
