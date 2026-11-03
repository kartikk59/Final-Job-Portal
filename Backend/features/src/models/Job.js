import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    role: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site', 'Work from Home'],
      default: 'Remote',
    },
    employmentType: {
      type: String,
      enum: ['Internship', 'Full-time', 'Part-time', 'Contract'],
      default: 'Internship',
      index: true,
    },
    experienceLevel: {
      type: String,
      default: 'No prior experience required',
    },
    stipendOrSalary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: '₹' },
      period: { type: String, default: 'Month' },
      display: { type: String, default: '' },
    },
    skills: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: [String],
      default: ['Undergraduate', 'Postgraduate'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000), // 14 days ahead
    },
    postedBy: {
      type: String,
      default: 'recruiter_default_1',
    },
    postedByRecruiter: {
      name: { type: String, default: 'Hiring Team' },
      email: { type: String, default: 'careers@company.com' },
      company: { type: String, default: '' },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating days left until deadline
jobSchema.virtual('daysLeft').get(function () {
  if (!this.deadline) return 0;
  const diffTime = new Date(this.deadline).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Compound index for search and fast filtering
jobSchema.index({ title: 'text', companyName: 'text', skills: 'text', description: 'text' });
jobSchema.index({ employmentType: 1, workMode: 1, category: 1, createdAt: -1 });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
