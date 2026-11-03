import mongoose from 'mongoose';
import Job from '../models/Job.js';
import SavedJob from '../models/SavedJob.js';
import JobApplication from '../models/JobApplication.js';
import JobAlert from '../models/JobAlert.js';
import { initialJobs } from '../seed/mockData.js';

// Fallback in-memory state if MongoDB Atlas is not yet connected
let memoryJobs = [...initialJobs];
let memorySavedJobs = [];
let memoryApplications = [];
let memoryAlerts = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc Get all jobs with search, filtering, sorting, and pagination
 * @route GET /api/jobs
 * @access Public
 */
export const getJobs = async (req, res, next) => {
  try {
    const {
      search = '',
      category = '',
      employmentType = '',
      workMode = '',
      location = '',
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;

    if (isDbConnected()) {
      const query = { status: 'Active' };

      if (category && category !== 'All') {
        query.category = new RegExp(`^${category}$`, 'i');
      }

      if (employmentType && employmentType !== 'All') {
        query.employmentType = new RegExp(`^${employmentType}$`, 'i');
      }

      if (workMode && workMode !== 'All') {
        query.workMode = new RegExp(`^${workMode}$`, 'i');
      }

      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { skills: { $in: [new RegExp(search, 'i')] } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'oldest') sortOptions = { createdAt: 1 };
      if (sort === 'deadline') sortOptions = { deadline: 1 };
      if (sort === 'stipend_high') sortOptions = { 'stipendOrSalary.max': -1 };

      const total = await Job.countDocuments(query);
      const jobs = await Job.find(query)
        .sort(sortOptions)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        count: jobs.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        data: jobs,
      });
    }

    // In-memory fallback
    let filtered = [...memoryJobs];

    if (category && category !== 'All') {
      filtered = filtered.filter((j) => j.category?.toLowerCase() === category.toLowerCase());
    }

    if (employmentType && employmentType !== 'All') {
      filtered = filtered.filter((j) => j.employmentType?.toLowerCase() === employmentType.toLowerCase());
    }

    if (workMode && workMode !== 'All') {
      filtered = filtered.filter((j) => j.workMode?.toLowerCase() === workMode.toLowerCase());
    }

    if (location) {
      filtered = filtered.filter((j) => j.location?.toLowerCase().includes(location.toLowerCase()));
    }

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(term) ||
          j.companyName.toLowerCase().includes(term) ||
          j.skills?.some((s) => s.toLowerCase().includes(term)) ||
          j.description?.toLowerCase().includes(term)
      );
    }

    // Sorting
    if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'oldest') filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === 'deadline') filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    if (sort === 'stipend_high') filtered.sort((a, b) => (b.stipendOrSalary?.max || 0) - (a.stipendOrSalary?.max || 0));

    const total = filtered.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      count: paginated.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: paginated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single job by ID
 * @route GET /api/jobs/:id
 * @access Public
 */
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job listing not found' });
      }
      return res.status(200).json({ success: true, data: job });
    }

    const job = memoryJobs.find((j) => j._id === id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job listing not found' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new job listing
 * @route POST /api/jobs
 * @access Recruiter / Admin only
 */
export const createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user?.id || 'recruiter_default_1',
      postedByRecruiter: {
        name: req.user?.name || req.body.postedByRecruiter?.name || 'Recruiter',
        email: req.user?.email || req.body.postedByRecruiter?.email || 'careers@company.com',
        company: req.body.companyName || '',
      },
    };

    if (isDbConnected()) {
      const newJob = await Job.create(jobData);
      return res.status(201).json({ success: true, message: 'Job listing created successfully', data: newJob });
    }

    const newJob = {
      ...jobData,
      _id: 'mem_job_' + Date.now(),
      createdAt: new Date(),
      status: 'Active',
      daysLeft: 14,
    };
    memoryJobs.unshift(newJob);

    res.status(201).json({ success: true, message: 'Job listing created successfully', data: newJob });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update job listing
 * @route PUT /api/jobs/:id
 * @access Recruiter / Admin only
 */
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

      const updated = await Job.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      return res.status(200).json({ success: true, message: 'Job updated', data: updated });
    }

    const index = memoryJobs.findIndex((j) => j._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Job not found' });

    memoryJobs[index] = { ...memoryJobs[index], ...req.body };
    res.status(200).json({ success: true, message: 'Job updated', data: memoryJobs[index] });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete job listing
 * @route DELETE /api/jobs/:id
 * @access Recruiter / Admin only
 */
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

      await Job.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Job listing deleted successfully' });
    }

    memoryJobs = memoryJobs.filter((j) => j._id !== id);
    res.status(200).json({ success: true, message: 'Job listing deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Toggle Save / Unsave a job for student
 * @route POST /api/jobs/:id/save
 * @access Student / Authenticated
 */
export const toggleSaveJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    if (isDbConnected()) {
      const existing = await SavedJob.findOne({ userId, jobId });
      if (existing) {
        await SavedJob.deleteOne({ _id: existing._id });
        return res.status(200).json({ success: true, isSaved: false, message: 'Job removed from saved list' });
      } else {
        await SavedJob.create({ userId, jobId });
        return res.status(200).json({ success: true, isSaved: true, message: 'Job saved successfully' });
      }
    }

    const index = memorySavedJobs.findIndex((s) => s.userId === userId && s.jobId === jobId);
    if (index !== -1) {
      memorySavedJobs.splice(index, 1);
      return res.status(200).json({ success: true, isSaved: false, message: 'Job removed from saved list' });
    } else {
      memorySavedJobs.push({ userId, jobId, savedAt: new Date() });
      return res.status(200).json({ success: true, isSaved: true, message: 'Job saved successfully' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all saved jobs for current student
 * @route GET /api/jobs/saved
 * @access Student / Authenticated
 */
export const getSavedJobs = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (isDbConnected()) {
      const savedDocs = await SavedJob.find({ userId }).populate('jobId').sort({ createdAt: -1 });
      const jobs = savedDocs.map((s) => s.jobId).filter(Boolean);
      return res.status(200).json({ success: true, count: jobs.length, data: jobs });
    }

    const userSavedIds = memorySavedJobs.filter((s) => s.userId === userId).map((s) => s.jobId);
    const jobs = memoryJobs.filter((j) => userSavedIds.includes(j._id));

    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Submit application for job (Duplicate prevention enforced)
 * @route POST /api/jobs/:id/apply
 * @access Student / Authenticated
 */
export const applyForJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    const { fullName, email, phone, resumeUrl, coverLetter, portfolioUrl } = req.body;

    if (!fullName || !email || !phone || !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, phone number, and resume are required to apply',
      });
    }

    if (isDbConnected()) {
      // Duplicate prevention
      const existingApp = await JobApplication.findOne({ userId, jobId });
      if (existingApp) {
        return res.status(409).json({
          success: false,
          message: 'You have already applied for this position. Check your Application History for updates.',
        });
      }

      const application = await JobApplication.create({
        userId,
        jobId,
        fullName,
        email,
        phone,
        resumeUrl,
        coverLetter: coverLetter || '',
        portfolioUrl: portfolioUrl || '',
        status: 'Applied',
      });

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully!',
        data: application,
      });
    }

    // In-memory check
    const existing = memoryApplications.find((a) => a.userId === userId && a.jobId === jobId);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this position. Check your Application History for updates.',
      });
    }

    const newApp = {
      _id: 'app_' + Date.now(),
      userId,
      jobId,
      fullName,
      email,
      phone,
      resumeUrl,
      coverLetter: coverLetter || '',
      portfolioUrl: portfolioUrl || '',
      status: 'Applied',
      appliedAt: new Date(),
    };
    memoryApplications.push(newApp);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: newApp,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get application history for current student
 * @route GET /api/jobs/applications
 * @access Student / Authenticated
 */
export const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (isDbConnected()) {
      const applications = await JobApplication.find({ userId })
        .populate('jobId')
        .sort({ appliedAt: -1 });

      return res.status(200).json({
        success: true,
        count: applications.length,
        data: applications,
      });
    }

    const userApps = memoryApplications
      .filter((a) => a.userId === userId)
      .map((a) => {
        const job = memoryJobs.find((j) => j._id === a.jobId);
        return { ...a, jobId: job || null };
      });

    res.status(200).json({
      success: true,
      count: userApps.length,
      data: userApps,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get user job alerts
 * @route GET /api/jobs/alerts
 * @access Student / Authenticated
 */
export const getJobAlerts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (isDbConnected()) {
      const alerts = await JobAlert.find({ userId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: alerts });
    }

    const userAlerts = memoryAlerts.filter((a) => a.userId === userId);
    res.status(200).json({ success: true, data: userAlerts });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create a new job alert
 * @route POST /api/jobs/alerts
 * @access Student / Authenticated
 */
export const createJobAlert = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, role, category, location, workMode, employmentType, skills, minStipend } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Alert title is required' });
    }

    const alertData = {
      userId,
      title,
      role: role || '',
      category: category || '',
      location: location || '',
      workMode: workMode || '',
      employmentType: employmentType || '',
      skills: Array.isArray(skills) ? skills : [],
      minStipend: minStipend || 0,
      isActive: true,
    };

    if (isDbConnected()) {
      const alert = await JobAlert.create(alertData);
      return res.status(201).json({ success: true, message: 'Job alert set successfully', data: alert });
    }

    const newAlert = {
      ...alertData,
      _id: 'alert_' + Date.now(),
      createdAt: new Date(),
    };
    memoryAlerts.push(newAlert);

    res.status(201).json({ success: true, message: 'Job alert set successfully', data: newAlert });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a job alert
 * @route DELETE /api/jobs/alerts/:id
 * @access Student / Authenticated
 */
export const deleteJobAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isDbConnected()) {
      await JobAlert.deleteOne({ _id: id, userId });
      return res.status(200).json({ success: true, message: 'Alert deleted' });
    }

    memoryAlerts = memoryAlerts.filter((a) => !(a._id === id && a.userId === userId));
    res.status(200).json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    next(error);
  }
};
