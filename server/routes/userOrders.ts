import { Router, Response } from 'express';
import UserOrder from '../models/Order';
import User from '../models/User';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';
import connectDB from '../lib/db';

const router = Router();

const generateOrderNumber = () => {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `OC${ymd}${rand}`;
};

// POST /api/user-orders — place order (authenticated)
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const { items, paymentMethod, razorpayOrderId, razorpayPaymentId, shippingAddress } = req.body;

    if (!items?.length || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Items and payment method are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = user.profile || {};
    const address = shippingAddress || {
      name: user.name,
      mobile: user.mobileNumber,
      address: profile.address || '',
      city: profile.city || '',
      state: (profile as any).state || '',
      pincode: profile.pincode || '',
    };

    if (!address.address?.trim() || !address.pincode?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please add your delivery address in profile before placing an order',
      });
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const deliveryCharge = totalAmount >= 999 ? 0 : 99;
    const grandTotal = totalAmount + deliveryCharge;

    const isPaid = paymentMethod === 'online' && razorpayPaymentId;

    const order = await UserOrder.create({
      userId: req.user.id,
      orderNumber: generateOrderNumber(),
      items,
      totalAmount: grandTotal,
      status: paymentMethod === 'cod' ? 'confirmed' : isPaid ? 'confirmed' : 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : isPaid ? 'paid' : 'pending',
      razorpayOrderId,
      razorpayPaymentId,
      shippingAddress: address,
    });

    res.status(201).json({ success: true, data: order, message: 'Order placed successfully' });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

// GET /api/user-orders — list user's orders
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const orders = await UserOrder.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: orders });
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

// GET /api/user-orders/:id — single order detail
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const order = await UserOrder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

export default router;
