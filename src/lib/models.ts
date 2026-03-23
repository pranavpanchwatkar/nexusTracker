import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  teamName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ['coordinator', 'admin', 'viewer'], default: 'coordinator' }
});
export const User = models.User || model('User', UserSchema);

const SubmissionSchema = new Schema({
  teamName: { type: String, required: true },
  collegeName: { type: String, required: true },
  approachedCount: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
export const Submission = models.Submission || model('Submission', SubmissionSchema);

const ProcessedDataSchema = new Schema({
  teamId: { type: String, required: true },
  collegeName: { type: String, required: true },
  paymentStatus: { type: String, required: true },
});
export const ProcessedData = models.ProcessedData || model('ProcessedData', ProcessedDataSchema);
