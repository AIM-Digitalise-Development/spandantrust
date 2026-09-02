import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    dobOrAge: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    patientDetails: {
      type: String,
      default: '',
      trim: true,
    },
    visitDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    opdDetails: {
      type: String,
      default: '',
      trim: true,
    },
    extraData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
