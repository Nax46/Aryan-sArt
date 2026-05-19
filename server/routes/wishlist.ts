import { Router, Response } from 'express';
import mongoose from 'mongoose';
import WishlistCollection from '../models/Wishlist';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';
import connectDB from '../lib/db';

const router = Router();

const ensureDefaultCollection = async (userId: string) => {
  let defaultList = await WishlistCollection.findOne({ userId, isDefault: true });
  if (!defaultList) {
    defaultList = await WishlistCollection.create({
      userId,
      name: 'My List',
      isDefault: true,
      items: [],
    });
  }
  return defaultList;
};

// GET /api/wishlists — fetch all collections for user
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    await ensureDefaultCollection(req.user.id);
    const collections = await WishlistCollection.find({ userId: req.user.id }).sort({
      isDefault: -1,
      createdAt: 1,
    });

    res.json({ success: true, data: collections });
  } catch (error: any) {
    console.error('Fetch wishlists error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

// POST /api/wishlists — create new collection
router.post('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'Wishlist name is required' });
    }

    const trimmedName = name.trim().slice(0, 50);
    const existing = await WishlistCollection.findOne({ userId: req.user.id, name: trimmedName });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A wishlist with this name already exists' });
    }

    const collection = await WishlistCollection.create({
      userId: req.user.id,
      name: trimmedName,
      isDefault: false,
      items: [],
    });

    res.status(201).json({ success: true, data: collection, message: 'Wishlist created' });
  } catch (error: any) {
    console.error('Create wishlist error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

// PATCH /api/wishlists/:id — rename collection
router.patch('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: 'Wishlist name is required' });
    }

    const collection = await WishlistCollection.findOne({ _id: req.params.id, userId: req.user.id });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    collection.name = name.trim().slice(0, 50);
    await collection.save();

    res.json({ success: true, data: collection, message: 'Wishlist renamed' });
  } catch (error: any) {
    console.error('Rename wishlist error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

// DELETE /api/wishlists/:id — delete collection
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const collection = await WishlistCollection.findOne({ _id: req.params.id, userId: req.user.id });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    if (collection.isDefault) {
      return res.status(400).json({ success: false, message: 'Cannot delete default wishlist' });
    }

    await collection.deleteOne();
    res.json({ success: true, message: 'Wishlist deleted' });
  } catch (error: any) {
    console.error('Delete wishlist error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

// POST /api/wishlists/:id/items — add item to collection
router.post('/:id/items', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const { productId, name, price, image } = req.body;
    if (!productId || !name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required item fields' });
    }

    const collection = await WishlistCollection.findOne({ _id: req.params.id, userId: req.user.id });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    const exists = collection.items.some((item) => item.productId === String(productId));
    if (exists) {
      return res.status(409).json({ success: false, message: 'Item already in this wishlist' });
    }

    collection.items.push({
      productId: String(productId),
      name,
      price,
      image: image || '',
      addedAt: new Date(),
    });
    await collection.save();

    res.status(201).json({ success: true, data: collection, message: 'Item added to wishlist' });
  } catch (error: any) {
    console.error('Add wishlist item error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

// DELETE /api/wishlists/:id/items/:productId — remove item from collection
router.delete('/:id/items/:productId', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const collection = await WishlistCollection.findOne({ _id: req.params.id, userId: req.user.id });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    collection.items = collection.items.filter((item) => item.productId !== req.params.productId);
    await collection.save();

    res.json({ success: true, data: collection, message: 'Item removed from wishlist' });
  } catch (error: any) {
    console.error('Remove wishlist item error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

// POST /api/wishlists/sync — merge guest localStorage data on login
router.post('/sync', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await connectDB();
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const { collections: guestCollections } = req.body;
    if (!Array.isArray(guestCollections)) {
      return res.status(400).json({ success: false, message: 'Invalid sync data' });
    }

    await ensureDefaultCollection(req.user.id);

    for (const guest of guestCollections) {
      if (!guest.name || !Array.isArray(guest.items)) continue;

      let target = await WishlistCollection.findOne({
        userId: req.user.id,
        name: guest.name.trim().slice(0, 50),
      });

      if (!target && guest.isDefault) {
        target = await WishlistCollection.findOne({ userId: req.user.id, isDefault: true });
      }

      if (!target) {
        target = await WishlistCollection.create({
          userId: req.user.id,
          name: guest.name.trim().slice(0, 50),
          isDefault: !!guest.isDefault,
          items: [],
        });
      }

      for (const item of guest.items) {
        if (!item.productId) continue;
        const exists = target.items.some((i) => i.productId === String(item.productId));
        if (!exists) {
          target.items.push({
            productId: String(item.productId),
            name: item.name,
            price: item.price,
            image: item.image || '',
            addedAt: new Date(),
          });
        }
      }
      await target.save();
    }

    const collections = await WishlistCollection.find({ userId: req.user.id }).sort({
      isDefault: -1,
      createdAt: 1,
    });

    res.json({ success: true, data: collections, message: 'Wishlists synced' });
  } catch (error: any) {
    console.error('Sync wishlists error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

export default router;
