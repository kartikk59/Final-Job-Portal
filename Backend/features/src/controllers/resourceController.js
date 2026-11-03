import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Resource, { RESOURCE_CATEGORIES } from '../models/Resource.js';
import { initialResources } from '../seed/mockData.js';

let memoryResources = [...initialResources];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc Get all resources with search, filtering, and sorting
 * @route GET /api/resources
 * @access Public
 */
export const getResources = async (req, res, next) => {
  try {
    const {
      search = '',
      category = '',
      resourceType = '',
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;

    if (isDbConnected()) {
      const query = { status: 'Approved' };

      if (category && category !== 'All') {
        query.category = category;
      }

      if (resourceType && resourceType !== 'All') {
        query.resourceType = resourceType;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
          { contributorName: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'popular') sortOptions = { downloadsCount: -1, likesCount: -1 };
      if (sort === 'oldest') sortOptions = { createdAt: 1 };

      const total = await Resource.countDocuments(query);
      const resources = await Resource.find(query)
        .sort(sortOptions)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        count: resources.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        categories: RESOURCE_CATEGORIES,
        data: resources,
      });
    }

    // In-memory fallback
    let filtered = [...memoryResources];

    if (category && category !== 'All') {
      filtered = filtered.filter((r) => r.category?.toLowerCase() === category.toLowerCase());
    }

    if (resourceType && resourceType !== 'All') {
      filtered = filtered.filter((r) => r.resourceType === resourceType);
    }

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term) ||
          r.tags?.some((t) => t.toLowerCase().includes(term)) ||
          r.contributorName?.toLowerCase().includes(term)
      );
    }

    if (sort === 'popular') {
      filtered.sort((a, b) => (b.downloadsCount || 0) + (b.likesCount || 0) - ((a.downloadsCount || 0) + (a.likesCount || 0)));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = filtered.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      count: paginated.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      categories: RESOURCE_CATEGORIES,
      data: paginated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single resource by ID
 * @route GET /api/resources/:id
 * @access Public
 */
export const getResourceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
      return res.status(200).json({ success: true, data: resource });
    }

    const resource = memoryResources.find((r) => r._id === id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create/Share a new resource (supports link or local file upload)
 * @route POST /api/resources
 * @access Authenticated
 */
export const createResource = async (req, res, next) => {
  try {
    const { title, description, category, tags, resourceType, externalUrl } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Title, description, and category are required' });
    }

    let parsedTags = [];
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    let fileUrl = '';
    let fileName = '';
    let fileSize = '';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      const sizeMB = (req.file.size / (1024 * 1024)).toFixed(1);
      fileSize = `${sizeMB} MB`;
    }

    const newResourceData = {
      title,
      description,
      category,
      tags: parsedTags,
      resourceType: req.file ? 'pdf' : resourceType || 'external_link',
      externalUrl: externalUrl || '',
      fileUrl,
      fileName,
      fileSize,
      contributorId: req.user?.id || 'student_dev_1',
      contributorName: req.user?.name || 'Student Contributor',
      badge: 'Community',
      downloadsCount: 0,
      likesCount: 0,
      status: 'Approved',
    };

    if (isDbConnected()) {
      const resource = await Resource.create(newResourceData);
      return res.status(201).json({ success: true, message: 'Resource shared successfully', data: resource });
    }

    const inMemoryDoc = {
      ...newResourceData,
      _id: 'res_' + Date.now(),
      createdAt: new Date(),
    };
    memoryResources.unshift(inMemoryDoc);

    res.status(201).json({ success: true, message: 'Resource shared successfully', data: inMemoryDoc });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a resource
 * @route DELETE /api/resources/:id
 * @access Authenticated (Owner or Admin)
 */
export const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (isDbConnected()) {
      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

      // Permission check (Allow if admin or owner)
      if (req.user?.role !== 'admin' && resource.contributorId !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this resource' });
      }

      await Resource.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Resource removed successfully' });
    }

    const index = memoryResources.findIndex((r) => r._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Resource not found' });

    memoryResources.splice(index, 1);
    res.status(200).json({ success: true, message: 'Resource removed successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Toggle like / helpful for a resource
 * @route POST /api/resources/:id/like
 * @access Authenticated
 */
export const toggleLikeResource = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

      resource.likesCount = (resource.likesCount || 0) + 1;
      await resource.save();

      return res.status(200).json({ success: true, likesCount: resource.likesCount });
    }

    const resource = memoryResources.find((r) => r._id === id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    resource.likesCount = (resource.likesCount || 0) + 1;
    res.status(200).json({ success: true, likesCount: resource.likesCount });
  } catch (error) {
    next(error);
  }
};
