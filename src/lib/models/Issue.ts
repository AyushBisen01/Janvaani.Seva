
import mongoose, { Document, Schema, Model } from 'mongoose';

interface IIssue extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  imageUrl: string;
  submittedBy: string;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: { status: string; date: Date, notes?: string }[];
  assignedTo?: string;
  resolvedAt?: Date;
  proofUrl?: string;
  proofHint?: string;
  greenFlags: number;
  redFlags: number;
}

const IssueSchema: Schema<IIssue> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  location: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  status: { type: String, default: 'pending' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  imageUrl: String,
  submittedBy: String,
  statusHistory: {
    type: [{
        status: String,
        date: Date,
        notes: String,
    }],
    default: []
  },
  assignedTo: String,
  resolvedAt: Date,
  proofUrl: String,
  proofHint: String,
  greenFlags: { type: Number, default: 0 },
  redFlags: { type: Number, default: 0 },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Avoid model re-compilation
const IssueModel: Model<IIssue> = mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);

export default IssueModel;

    
