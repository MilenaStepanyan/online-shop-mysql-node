import express from 'express';
import jwt from 'jsonwebtoken';
import { addAdmin, findAdminByUsername, comparePassword } from './adminStore.js';

const router = express.Router();

const defaultAdmin = addAdmin('admin', 'admin123');
console.log('Default Admin:', defaultAdmin);

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = findAdminByUsername(username);
    console.log('Found Admin:', admin);

    if (!admin || !comparePassword(password, admin.password)) {
      console.log('Comparison Result:', false);
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: admin.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '10h' }, (err, token) => {
      if (err) throw err;
      console.log('Generated Token:', token);
      res.json({ token });
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
