import {
  getExpertByIdStore,
  checkBookingConflict,
  createBookingStore,
  getBookingsStore,
  getBookingByIdStore,
  updateBookingStore,
} from '../services/dataStore.js';

/**
 * @desc    Create a new booking with simulated payment details
 * @route   POST /api/bookings
 * @access  Protected (Student)
 */
export async function createBooking(req, res, next) {
  try {
    const {
      expertId,
      serviceType,
      date,
      time,
      targetRole,
      studentName,
      studentEmail,
      studentPhone,
      notes,
      paymentMethod,
      transactionRef,
    } = req.body;

    if (!expertId || !serviceType || !date || !time || !targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Please provide expertId, serviceType, date, time, and targetRole.',
      });
    }

    const expert = await getExpertByIdStore(expertId);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: `Expert not found with ID ${expertId}`,
      });
    }

    const service = expert.services?.find((s) => s.name === serviceType);
    if (!service) {
      return res.status(400).json({
        success: false,
        message: `Expert does not offer the "${serviceType}" service.`,
      });
    }

    const dateSlots = expert.availableSlots?.find((slot) => slot.date === date.trim());
    if (!dateSlots?.times.includes(time.trim())) {
      return res.status(400).json({
        success: false,
        message: 'That session time is not available. Please choose one of the listed slots.',
      });
    }
    if (!studentPhone?.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a phone number for the booking.' });
    }

    const existingConflict = await checkBookingConflict(expertId, date, time);
    if (existingConflict) {
      return res.status(409).json({
        success: false,
        message: `Conflict: This time slot (${date} at ${time}) is already booked for ${expert.name}. Please select an alternate date or time slot.`,
      });
    }

    const authenticatedStudentId = req.user ? req.user._id : null;
    const bookingPayload = {
      student: authenticatedStudentId,
      studentName: req.user.name,
      studentEmail: req.user.email.toLowerCase(),
      studentPhone: studentPhone.trim(),
      targetRole: targetRole.trim(),
      notes: notes?.trim() || '',
      expert: expert._id,
      expertName: expert.name,
      expertCompany: expert.company,
      expertDesignation: expert.designation,
      expertAvatarUrl: expert.avatarUrl,
      serviceType: service.name,
      date: date.trim(),
      time: time.trim(),
      durationMinutes: service.durationMinutes,
      priceINR: service.priceINR,
      status: 'confirmed',
      paymentStatus: 'Paid (Demo)',
      transactionRef: transactionRef || `TXN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: paymentMethod || 'UPI (Demo)',
      meetingLink: 'https://meet.google.com/demo-hub-live',
    };

    const newBooking = await createBookingStore(bookingPayload);

    res.status(201).json({
      success: true,
      message: 'Booking confirmed and simulated payment verified.',
      data: newBooking,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get bookings for the currently authenticated student
 * @route   GET /api/bookings/my
 * @access  Protected (Student)
 */
export async function getMyBookings(req, res, next) {
  try {
    const studentId = req.user?._id;
    const studentEmail = req.user?.email;

    const filter = {};
    if (studentId || studentEmail) {
      filter.$or = [
        ...(studentId ? [{ student: studentId }] : []),
        ...(studentEmail ? [{ studentEmail: studentEmail.toLowerCase() }] : []),
      ];
    }

    const bookings = await getBookingsStore(filter);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Cancel an existing booking
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Protected (Owner student or Admin)
 */
export async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await getBookingByIdStore(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    const updated = await updateBookingStore(id, {
      status: 'cancelled',
      paymentStatus: 'Refunded (Demo)',
    });

    res.status(200).json({
      success: true,
      message: 'Booking successfully cancelled.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Reschedule a booking to a new date and time
 * @route   PATCH /api/bookings/:id/reschedule
 * @access  Protected (Owner student or Admin)
 */
export async function rescheduleBooking(req, res, next) {
  try {
    const { id } = req.params;
    const { newDate, newTime } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide newDate and newTime.',
      });
    }

    const booking = await getBookingByIdStore(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Check conflict for new slot
    const conflict = await checkBookingConflict(booking.expert, newDate, newTime);
    if (conflict && String(conflict._id) !== String(booking._id)) {
      return res.status(409).json({
        success: false,
        message: `Conflict: Slot ${newDate} at ${newTime} is already booked. Please choose another time.`,
      });
    }

    const updated = await updateBookingStore(id, {
      date: newDate.trim(),
      time: newTime.trim(),
      status: 'rescheduled',
    });

    res.status(200).json({
      success: true,
      message: 'Booking rescheduled successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}
