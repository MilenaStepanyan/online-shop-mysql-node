import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './productRoutes.js';
import adminAuthRoutes from './adminAuthRoutes.js';
import userRoutes from './userRouter.js';
const app = express();
dotenv.config();

app.use(express.json());

app.use('/admin', adminAuthRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
