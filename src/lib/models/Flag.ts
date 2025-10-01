
import mongoose, { Document, Schema, Model } from 'mongoose';

interface IFlag extends Document {
  issueId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  type: 'green' | 'red';
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

const FlagSchema: Schema<IFlag> = new Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['green', 'red'], required: true },
  reason: { type: String },
}, { timestamps: true });

const FlagModel: Model<IFlag> = mongoose.models.Flag || mongoose.model<IFlag>('Flag', FlagSchema);

export default FlagModel;

    