import mongoose from 'mongoose';

const MembershipApplicationSchema = new mongoose.Schema(
  {
    applicationReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    },

    // Coordinated User reference: References teammate's shared 'User' model
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Work or professional email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Current job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Current company or organization is required'],
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0,
    },
    domain: {
      type: String,
      required: [true, 'Primary domain is required'],
      enum: [
        'Software Engineering',
        'Cloud & DevOps',
        'AI & Machine Learning',
        'Product Management',
        'UI/UX Design',
      ],
    },
    servicesOffered: [
      {
        type: String,
      },
    ],
    linkedinUrl: {
      type: String,
      required: [true, 'LinkedIn URL is required for mentor verification'],
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    sessionFeeExpectation: {
      type: Number,
      default: 299,
      min: 0,
    },

    // Multer upload file storage (path or relative URL, NOT binary in DB)
    resumePath: {
      type: String,
      trim: true,
    },
    resumeOriginalName: {
      type: String,
      trim: true,
    },

    motivation: {
      type: String,
      required: [true, 'Motivation statement is required'],
      trim: true,
    },

    // Lifecycle Status: Stays 'Pending' until admin approves or rejects
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },

    // Admin Review Audit
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

MembershipApplicationSchema.index({ email: 1, status: 1 });
MembershipApplicationSchema.index({ status: 1, createdAt: -1 });

export const MembershipApplication =
  mongoose.models.MembershipApplication ||
  mongoose.model('MembershipApplication', MembershipApplicationSchema);
