import mongoose from 'mongoose';

export const RESOURCE_CATEGORIES = [
  'DSA Sheets',
  'Study Notes',
  'Interview Preparation PDFs',
  'Learning Roadmaps',
  'YouTube Playlists',
  'Previous OA Questions',
];

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      maxlength: [140, 'Title cannot exceed 140 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: RESOURCE_CATEGORIES,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    resourceType: {
      type: String,
      enum: ['external_link', 'pdf', 'document', 'youtube_playlist'],
      default: 'external_link',
    },
    externalUrl: {
      type: String,
      trim: true,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    fileSize: {
      type: String,
      default: '',
    },
    contributorId: {
      type: String,
      default: 'student_dev_1',
    },
    contributorName: {
      type: String,
      default: 'Community Contributor',
    },
    badge: {
      type: String,
      default: 'Verified',
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Rejected'],
      default: 'Approved',
    },
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ category: 1, createdAt: -1 });

const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
export default Resource;
