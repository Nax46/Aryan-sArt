import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';
import connectDB from '../lib/db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'canvas_aryan_art_secret_2024_secure';

const generateToken = (userId: any) => {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is missing!');
  }
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// @route POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    await connectDB();
    let { name, mobileNumber, password, email } = req.body;

    // Validation
    if (!name || !mobileNumber || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    mobileNumber = mobileNumber.trim();
    password = password.trim();

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      return res.status(400).json({ success: false, message: "Please provide a valid 10-digit Indian mobile number" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Mobile number already registered" });
    }

    const user = new User({
      name,
      mobileNumber,
      password,
      email
    });

    await user.save();

    const token = generateToken(user._id);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      data: {
        user: userObj,
        token
      },
      message: "Registration successful"
    });
  } catch (error: any) {
    console.error('Signup Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error" 
    });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    await connectDB();
    let { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({ success: false, message: "Please provide mobile number and password" });
    }

    mobileNumber = mobileNumber.trim();
    password = password.trim();

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid mobile or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid mobile or password" });
    }

    const token = generateToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      data: {
        user: userObj,
        token
      },
      message: "Login successful"
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error" 
    });
  }
});

// @route GET /api/auth/me
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "User profile fetched"
    });
  } catch (error: any) {
    console.error('Fetch Me Error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
