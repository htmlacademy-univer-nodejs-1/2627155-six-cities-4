import { Schema, model, Document } from 'mongoose';
import { UserType } from '../../types/index.js';

export interface UserDocument extends Document {
  name: string;
  email: string;
  profilePicture?: string;
  password: string;
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  password: { type: String, required: true },
  type: { type: String, enum: ['ordinary', 'pro'], required: true }
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', userSchema);
