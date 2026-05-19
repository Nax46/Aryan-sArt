import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  addedAt?: Date;
}

export interface IWishlistCollection extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  isDefault: boolean;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WishlistCollectionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    isDefault: { type: Boolean, default: false },
    items: { type: [WishlistItemSchema], default: [] },
  },
  { timestamps: true }
);

WishlistCollectionSchema.index({ userId: 1, name: 1 }, { unique: true });

const WishlistCollection: mongoose.Model<IWishlistCollection> =
  mongoose.models.WishlistCollection ||
  mongoose.model<IWishlistCollection>('WishlistCollection', WishlistCollectionSchema);

export default WishlistCollection;
