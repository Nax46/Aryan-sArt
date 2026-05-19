import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  mobileNumber: string;
  email?: string;
  password?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  profile: {
    avatar?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
  };
  createdAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const isBcryptHash = (value: string) => /^\$2[aby]\$\d{2}\$/.test(value);

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number'],
    },
    email: { type: String, lowercase: true, sparse: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    profile: {
      avatar: { type: String, default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      landmark: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password') || !this.password) return;

  // Avoid double-hashing if value is already a bcrypt hash
  if (isBcryptHash(this.password)) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!candidatePassword || !this.password) return false;

  const stored = this.password;

  if (isBcryptHash(stored)) {
    try {
      return await bcrypt.compare(candidatePassword, stored);
    } catch {
      return false;
    }
  }

  // Legacy plain-text passwords (migrate on next successful login/change)
  return stored === candidatePassword;
};

const User: mongoose.Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
