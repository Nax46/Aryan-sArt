import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = req.headers['x-admin-key'];
  const secretKey = process.env.ADMIN_SECRET_KEY;

  if (!secretKey) {
    res.status(500).json({ error: 'Server misconfiguration: missing admin secret' });
    return;
  }

  if (adminKey !== secretKey) {
    res.status(401).json({ error: 'Unauthorized: invalid or missing admin key' });
    return;
  }

  next();
};
