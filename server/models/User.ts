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
    pincode?: string;
  };
  createdAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  mobileNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number']
  },
  email: { type: String, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  profile: {
    avatar: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    pincode: { type: String, default: '' }
  }
}, { timestamps: true });

// Pre-save hook to hash password
UserSchema.pre('save', async function(this: any) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password!, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password!);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
