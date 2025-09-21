
import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  faceImageUrl?: string;
  points: number;
  role?: 'Super Admin' | 'Department Head' | 'Staff' | 'Citizen';
  department?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  verified: { type: Boolean, default: false },
  faceImageUrl: { type: String, default: "" },
  points: { type: Number, default: 10000 },
  role: { type: String, enum: ['Super Admin', 'Department Head', 'Staff', 'Citizen'], default: 'Citizen' },
  department: String,
});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
