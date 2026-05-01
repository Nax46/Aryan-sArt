import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = Router();

// Initialize Razorpay instance with a check
let razorpay: any;
try {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_id || !key_secret) {
    console.warn('Razorpay keys are missing. Payment routes will not work correctly.');
  }
  
  razorpay = new Razorpay({
    key_id: key_id || 'dummy_id',
    key_secret: key_secret || 'dummy_secret'
  });
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
}

// Endpoint to create a Razorpay order
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Invalid amount. Minimum amount is 100 paise.' });
    }

    const options = {
      amount, // amount in the smallest currency unit (paise)
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ error: 'Failed to create order with Razorpay' });
    }

    res.status(201).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Endpoint to verify payment signature
router.post('/verify-payment', async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required Razorpay parameters' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || '';

    // Create the expected signature
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    // Compare signatures
    if (generatedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
