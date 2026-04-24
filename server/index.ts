import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';
import customOrdersRouter from './routes/custom_orders';
import authRouter from './routes/auth';

dotenv.config();

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://anshuljangidindian_db_user:2SJZ4SIptp7FKucb@cluster01.dejvuao.mongodb.net/?appName=Cluster01';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();
const port = process.env.PORT || 5000;

// CORS config — origin:true mirrors any origin (fixes preflight redirect issue)
const corsOptions: cors.CorsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Must respond to OPTIONS preflight BEFORE any other middleware
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/custom-orders', customOrdersRouter);
app.use('/api/auth', authRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Listen on all network interfaces (0.0.0.0) — required for production servers
app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server running on port ${port} (all interfaces)`);
});
