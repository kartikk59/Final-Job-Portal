import mongoose from 'mongoose';

const jobAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Alert name or title is required'],
      trim: true,
    },
    role: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    workMode: {
      type: String,
      enum: ['', 'Remote', 'Hybrid', 'On-site', 'Work from Home'],
      default: '',
    },
    employmentType: {
      type: String,
      enum: ['', 'Internship', 'Full-time', 'Part-time'],
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    minStipend: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

jobAlertSchema.index({ userId: 1, createdAt: -1 });

const JobAlert = mongoose.models.JobAlert || mongoose.model('JobAlert', jobAlertSchema);
export default JobAlert;
