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
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ 
        success: false, 
        message: "Database connection unavailable. Please check your MONGO_URI configuration." 
      });
    }
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
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ 
        success: false, 
        message: "Database connection unavailable. Please ensure your MongoDB Atlas IP whitelist allows Vercel (0.0.0.0/0)." 
      });
    }
    
    let { loginId, mobileNumber: mNum, password: pWord } = req.body;
    const loginIdentifier = (loginId || mNum || '').trim();
    const password = (pWord || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ success: false, message: "Please provide mobile/email and password" });
    }

    const user = loginIdentifier.includes('@')
      ? await User.findOne({ email: loginIdentifier.toLowerCase() })
      : await User.findOne({ mobileNumber: loginIdentifier.replace(/\D/g, '').slice(-10) });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid mobile or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid mobile or password" });
    }

    const token = generateToken(user._id);

    // Remove password from response
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

const formatUserResponse = (user: any) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  return {
    ...userObj,
    id: userObj._id?.toString() || userObj.id,
  };
};

// @route GET /api/auth/me
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: formatUserResponse(user),
      message: "User profile fetched"
    });
  } catch (error: any) {
    console.error('Fetch Me Error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PATCH /api/auth/profile
router.patch('/profile', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email, profile } = req.body;

    if (name?.trim()) user.name = name.trim();
    if (email !== undefined) {
      const trimmedEmail = email?.trim().toLowerCase() || '';
      if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
      }
      if (trimmedEmail) {
        const emailTaken = await User.findOne({ email: trimmedEmail, _id: { $ne: user._id } });
        if (emailTaken) {
          return res.status(409).json({ success: false, message: 'Email already in use' });
        }
      }
      user.email = trimmedEmail;
    }

    if (profile) {
      if (profile.avatar !== undefined) user.profile.avatar = profile.avatar;
      if (profile.address !== undefined) user.profile.address = profile.address.trim();
      if (profile.city !== undefined) user.profile.city = profile.city.trim();
      if (profile.state !== undefined) user.profile.state = profile.state.trim();
      if (profile.pincode !== undefined) {
        const pin = profile.pincode.replace(/\D/g, '').slice(0, 6);
        if (pin && pin.length !== 6) {
          return res.status(400).json({ success: false, message: 'Pincode must be 6 digits' });
        }
        user.profile.pincode = pin;
      }
      if (profile.landmark !== undefined) user.profile.landmark = profile.landmark.trim();
    }

    await user.save();

    res.json({
      success: true,
      data: formatUserResponse(user),
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

// @route PUT /api/auth/password
router.put('/password', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

export default router;
