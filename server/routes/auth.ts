import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_make_it_secure';

// Basic Sign Up
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: newUser._id,
        email: newUser.email,
        user_metadata: { full_name: newUser.name }
      },
      session: { access_token: token }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Log In
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
        user: {
          id: user._id,
          email: user.email,
          user_metadata: { full_name: user.name }
        },
        session: { access_token: token },
        wishlist: user.wishlist || []
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile
router.put('/profile', async (req: Request, res: Response) => {
   try {
     const { id, name, phone, address } = req.body;
     const user = await User.findById(id);
     if (!user) return res.status(404).json({ error: "User not found" });

     if (name) user.name = name;
     // if phone and address exist in your schema, add them. I will just save name for now
     // user.phone = phone;
     // user.address = address;
     
     await user.save();
     
     res.json({ id: user._id, name: user.name, email: user.email });
   } catch(error: any) {
      res.status(500).json({ error: error.message });
   }
});

// Wishlist - Toggle
router.post('/wishlist/toggle', async (req: Request, res: Response) => {
   try {
     const { user_id, product_id } = req.body;
     if (!user_id) return res.status(401).json({ error: "Unauthorized" });

     const user = await User.findById(user_id);
     if (!user) return res.status(404).json({ error: "User not found" });

     const index = user.wishlist.indexOf(product_id);
     if (index > -1) {
        // remove
        user.wishlist.splice(index, 1);
        await user.save();
        res.json({ action: 'removed', product_id });
     } else {
        // add
        user.wishlist.push(product_id);
        await user.save();
        res.json({ action: 'added', product_id });
     }
   } catch (error: any) {
     res.status(500).json({ error: error.message });
   }
});

export default router;
