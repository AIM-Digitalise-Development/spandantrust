import mongoose from 'mongoose';

const PasswordResetTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // MongoDB TTL index to auto-delete expired documents
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PasswordResetToken || mongoose.model('PasswordResetToken', PasswordResetTokenSchema);
