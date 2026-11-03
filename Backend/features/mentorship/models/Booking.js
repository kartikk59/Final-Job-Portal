import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    },

    // Coordinated User reference: References teammate's shared 'User' model
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional during standalone testing or when guest booking
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      lowercase: true,
      trim: true,
    },
    studentPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    targetRole: {
      type: String,
      required: [true, 'Target job role is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },

    // Reference to the Expert being booked
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: [true, 'Expert ID reference is required'],
    },
    expertName: {
      type: String,
      required: true,
    },
    expertCompany: {
      type: String,
      required: true,
    },
    expertDesignation: {
      type: String,
      required: true,
    },
    expertAvatarUrl: {
      type: String,
    },

    // Session Details
    serviceType: {
      type: String,
      required: [true, 'Session type is required'],
      enum: [
        'Mock Interview',
        'Career Guidance',
        'Resume Review',
        'Advanced Technical Interview',
      ],
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: [true, 'Session date is required'],
    },
    time: {
      type: String, // e.g. '06:30 PM'
      required: [true, 'Session time slot is required'],
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    priceINR: {
      type: Number,
      required: true,
      min: 0,
    },

    // Lifecycle Status
    status: {
      type: String,
      enum: ['confirmed', 'completed', 'cancelled', 'rescheduled'],
      default: 'confirmed',
    },

    // Simulated Demo Payment (College Demo Mode)
    paymentStatus: {
      type: String,
      enum: ['Paid (Demo)', 'Pending', 'Refunded (Demo)', 'Failed (Demo)'],
      default: 'Paid (Demo)',
    },
    transactionRef: {
      type: String,
      trim: true,
      default: () => `TXN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
    },
    paymentMethod: {
      type: String,
      default: 'UPI (Demo)',
    },

    // Virtual Meeting URL
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/demo-hub-live',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes: prevent double-booking on same expert, date and time slot for active sessions
BookingSchema.index({ expert: 1, date: 1, time: 1, status: 1 });
BookingSchema.index({ studentEmail: 1, createdAt: -1 });
BookingSchema.index({ student: 1, createdAt: -1 });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
