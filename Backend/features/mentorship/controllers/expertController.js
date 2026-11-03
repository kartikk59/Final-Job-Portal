import { getExpertsStore, getExpertByIdStore } from '../services/dataStore.js';

/**
 * @desc    Get all experts with search, domain, service type, and price filtering
 * @route   GET /api/experts
 * @access  Public
 */
export async function getExperts(req, res, next) {
  try {
    const { search, domain, serviceType, priceRange } = req.query;

    const experts = await getExpertsStore({
      search,
      domain,
      serviceType,
      priceRange,
    });

    res.status(200).json({
      success: true,
      count: experts.length,
      data: experts,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get single expert by MongoDB _id or custom ID
 * @route   GET /api/experts/:id
 * @access  Public
 */
export async function getExpertById(req, res, next) {
  try {
    const { id } = req.params;
    const expert = await getExpertByIdStore(id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: `Expert profile not found with ID "${id}".`,
      });
    }

    res.status(200).json({
      success: true,
      data: expert,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get expert available time slots
 * @route   GET /api/experts/:id/availability
 * @access  Public
 */
export async function getExpertAvailability(req, res, next) {
  try {
    const { id } = req.params;
    const expert = await getExpertByIdStore(id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expert.availableSlots || [],
    });
  } catch (error) {
    next(error);
  }
}
