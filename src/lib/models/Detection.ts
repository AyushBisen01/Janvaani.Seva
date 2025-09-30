
import mongoose, { Document, Schema, Model } from 'mongoose';

interface IDetection extends Document {
  issueId: mongoose.Schema.Types.ObjectId;
  annotatedImageUrl: string;
  detections: {
    class: string;
    confidence: number;
    bbox: number[];
    severity: string;
    priority: string;
  }[];
  createdAt: Date;
}

const DetectionSchema: Schema<IDetection> = new Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
  annotatedImageUrl: String,
  detections: [{
    class: String,
    confidence: Number,
    bbox: [Number],
    severity: String,
    priority: String,
  }],
}, { timestamps: true });

const DetectionModel: Model<IDetection> = mongoose.models.Detection || mongoose.model<IDetection>('Detection', DetectionSchema);

export default DetectionModel;
