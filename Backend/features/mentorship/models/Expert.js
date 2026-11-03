import mongoose from 'mongoose';

const ExpertServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      enum: [
        'Mock Interview',
        'Career Guidance',
        'Resume Review',
        'Advanced Technical Interview',
      ],
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Session duration in minutes is required'],
      min: 15,
      max: 180,
    },
    priceINR: {
      type: Number,
      required: [true, 'Session price in INR is required'],
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: [{ type: String }],
  },
  { _id: true }
);

const AvailableSlotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
    },
    times: [
      {
        type: String, // e.g. '10:00 AM', '02:30 PM'
        required: true,
      },
    ],
  },
  { _id: false }
);

const ReviewSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentRole: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, required: true },
  },
  { _id: true, timestamps: true }
);

const ExpertSchema = new mongoose.Schema(
  {
    // Coordinated User reference: References teammate's shared 'User' model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for seeded directory experts
    },
    name: {
      type: String,
      required: [true, 'Expert name is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    },
    avatarBg: {
      type: String,
      default: 'bg-orange-500',
    },
    experienceYears: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0,
    },
    domain: {
      type: String,
      required: [true, 'Domain expertise is required'],
      enum: [
        'Software Engineering',
        'Cloud & DevOps',
        'AI & Machine Learning',
        'Product Management',
        'UI/UX Design',
      ],
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    bio: {
      type: String,
      required: [true, 'Short bio is required'],
      trim: true,
    },
    about: [{ type: String }],
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true, // Only approved experts are listed in directory
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    services: [ExpertServiceSchema],
    availableSlots: [AvailableSlotSchema],
    reviews: [ReviewSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for fast searching and filtering
ExpertSchema.index({ name: 'text', company: 'text', designation: 'text', skills: 'text' });
ExpertSchema.index({ domain: 1, isApproved: 1, isActive: 1 });

export const Expert = mongoose.models.Expert || mongoose.model('Expert', ExpertSchema);
