
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
  statusHistory: { status: string; date: Date }[];
  assignedTo?: string;
  resolvedAt?: Date;
  proofUrl?: string;
  proofHint?: string;
}

const IssueSchema: Schema<IIssue> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  location: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  status: { type: String, default: 'Pending' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  imageUrl: String,
  submittedBy: String,
  statusHistory: {
    type: [{
        status: String,
        date: Date
    }],
    default: function(this: IIssue) {
        if (this.isNew) {
            return [{ status: this.status, date: new Date() }];
        }
        return [];
    }
  },
  assignedTo: String,
  resolvedAt: Date,
  proofUrl: String,
  proofHint: String,
}, { timestamps: true });


// Avoid model re-compilation
const IssueModel: Model<IIssue> = mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);

export default IssueModel;
