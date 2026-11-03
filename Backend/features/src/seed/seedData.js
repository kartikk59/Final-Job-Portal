import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';
import Resource from '../models/Resource.js';
import { initialJobs, initialResources } from './mockData.js';

dotenv.config();

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<username>')) {
      console.log('⚠️ Please specify a valid MONGODB_URI in server/.env to seed Atlas.');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('🌱 Connected to MongoDB Atlas. Seeding data...');

    await Job.deleteMany({});
    await Resource.deleteMany({});

    await Job.insertMany(initialJobs);
    await Resource.insertMany(initialResources);

    console.log('✅ Successfully seeded Jobs and Resources into MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
