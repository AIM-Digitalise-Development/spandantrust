import mongoose from 'mongoose';

const SupplySchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderRole: {
      type: String,
      enum: ['ADMIN', 'COORDINATOR', 'SUPERVISOR'],
      required: true,
    },
    receiverRole: {
      type: String,
      enum: ['COORDINATOR', 'SUPERVISOR', 'DIGITAL_OPD_AGENT'],
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    supplyDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

SupplySchema.index({ receiver: 1, supplyDate: -1 });

export default mongoose.models.Supply || mongoose.model('Supply', SupplySchema);
