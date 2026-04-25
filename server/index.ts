import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';
import customOrdersRouter from './routes/custom_orders';
import authRouter from './routes/auth';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://anshuljangidindian_db_user:2SJZ4SIptp7FKucb@cluster01.dejvuao.mongodb.net/?appName=Cluster01';
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://www.oncanvas.in',
    'https://oncanvas.in'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

// Start server
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} (all interfaces)`);
});
