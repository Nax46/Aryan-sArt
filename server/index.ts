// Trigger deploy - fix build issues
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';
import customOrdersRouter from './routes/custom_orders';
import authRouter from './routes/auth';
import paymentRouter from './routes/payment';

import connectDB from './lib/db';

import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://www.oncanvas.in',
  'https://oncanvas.in',
  'https://aryan-sart-production.up.railway.app'
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: any) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://www.oncanvas.in',
      'https://oncanvas.in',
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'ok', 
    timestamp: new Date(),
    message: "Server is healthy"
  });
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/custom-orders', customOrdersRouter);
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);

const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
