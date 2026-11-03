import mongoose from 'mongoose';
import { Expert } from '../models/Expert.js';
import { Booking } from '../models/Booking.js';
import { MembershipApplication } from '../models/MembershipApplication.js';
import {
  INITIAL_EXPERTS,
  INITIAL_BOOKINGS,
  INITIAL_APPLICATIONS,
} from '../data/initialData.js';

// In-memory fallback stores populated with initial data
let memoryExperts = JSON.parse(JSON.stringify(INITIAL_EXPERTS));
let memoryBookings = JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
let memoryApplications = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));

export const isDbConnected = () => mongoose.connection.readyState === 1;

/* =========================================================================
   EXPERTS DATA ACCESS
   ========================================================================= */

export async function getExpertsStore({ search, domain, serviceType, priceRange }) {
  if (isDbConnected()) {
    try {
      // Auto-seed if database is empty
      const totalDocs = await Expert.countDocuments();
      if (totalDocs === 0) {
        console.log('[DataStore] Database is empty. Auto-seeding 6 initial experts...');
        try {
          await Expert.insertMany(INITIAL_EXPERTS);
        } catch (seedErr) {
          console.warn('[DataStore] Auto-seeding error:', seedErr.message);
        }
      }

      const query = { isApproved: true, isActive: true };
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { name: searchRegex },
          { company: searchRegex },
          { designation: searchRegex },
          { skills: searchRegex },
        ];
      }
      if (domain && domain !== 'all') query.domain = domain;
      if (serviceType && serviceType !== 'all') query['services.name'] = serviceType;

      let experts = await Expert.find(query).sort({ featured: -1, rating: -1 });
      if (priceRange && priceRange !== 'all') {
        experts = experts.filter((expert) => {
          const minPrice = Math.min(...expert.services.map((s) => s.priceINR));
          if (priceRange === 'under-200') return minPrice <= 200;
          if (priceRange === '200-300') return minPrice >= 200 && minPrice <= 300;
          if (priceRange === 'above-300') return minPrice >= 300;
          return true;
        });
      }

      if (experts && experts.length > 0) {
        return experts;
      }
    } catch (err) {
      console.warn('[DataStore] Mongo query failed, falling back to memory store:', err.message);
    }
  }

  // Memory fallback
  let list = memoryExperts.filter((e) => e.isApproved && e.isActive);
  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.skills.some((sk) => sk.toLowerCase().includes(q))
    );
  }
  if (domain && domain !== 'all') {
    list = list.filter((e) => e.domain.toLowerCase() === domain.toLowerCase());
  }
  if (serviceType && serviceType !== 'all') {
    list = list.filter((e) => e.services.some((s) => s.name === serviceType));
  }
  if (priceRange && priceRange !== 'all') {
    list = list.filter((e) => {
      const minPrice = Math.min(...e.services.map((s) => s.priceINR));
      if (priceRange === 'under-200') return minPrice <= 200;
      if (priceRange === '200-300') return minPrice >= 200 && minPrice <= 300;
      if (priceRange === 'above-300') return minPrice >= 300;
      return true;
    });
  }
  return list;
}

export async function getExpertByIdStore(id) {
  if (isDbConnected()) {
    try {
      let expert;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        expert = await Expert.findById(id);
      } else {
        expert = await Expert.findOne({ $or: [{ _id: id }, { userId: id }] });
      }
      if (expert) return expert;
    } catch (err) {
      console.warn('[DataStore] Mongo getExpertById failed, fallback to memory:', err.message);
    }
  }

  return (
    memoryExperts.find((e) => e._id === id || e.id === id || String(e._id) === String(id)) || null
  );
}

export async function createExpertFromApplicationStore(app) {
  const defaultServices = (app.servicesOffered || ['Mock Interview', 'Career Guidance']).map((srv) => {
    let name = srv;
    let durationMinutes = 60;
    let priceINR = app.sessionFeeExpectation || 299;
    let description = `${name} session with ${app.fullName} (${app.designation} at ${app.company}).`;

    if (srv === 'Career Guidance') {
      durationMinutes = 45;
      priceINR = Math.max(149, Math.round(priceINR * 0.7));
    } else if (srv === 'Resume Review') {
      durationMinutes = 30;
      priceINR = Math.max(99, Math.round(priceINR * 0.5));
    } else if (srv === 'Advanced Technical Interview') {
      durationMinutes = 60;
      priceINR = Math.round(priceINR * 1.3);
    }

    return {
      name,
      durationMinutes,
      priceINR,
      description,
      agenda: ['Introduction & Calibration', 'Main Evaluation / Problem Solving', 'Actionable Feedback & Roadmap'],
    };
  });

  const avatarGradients = ['bg-orange-500', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-rose-500', 'bg-amber-600'];
  const randomBg = avatarGradients[Math.floor(Math.random() * avatarGradients.length)];

  const upcomingSlots = [
    { date: '2026-11-06', times: ['10:00 AM', '03:00 PM', '07:00 PM'] },
    { date: '2026-11-07', times: ['11:30 AM', '04:00 PM', '08:00 PM'] },
    { date: '2026-11-08', times: ['02:00 PM', '06:30 PM'] },
  ];

  const expertData = {
    userId: app.applicant || undefined,
    name: app.fullName,
    designation: app.designation,
    company: app.company,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.fullName)}&background=FF7A00&color=fff&size=256`,
    avatarBg: randomBg,
    experienceYears: app.experienceYears || 2,
    domain: app.domain || 'Software Engineering',
    skills: [app.domain, app.designation, '1:1 Mentorship', 'Interview Prep'],
    bio: app.motivation || `${app.designation} at ${app.company} with ${app.experienceYears}+ years of experience.`,
    about: [
      `Professional ${app.designation} at ${app.company}. Verified mentor on CareerHub.`,
      app.motivation,
    ],
    rating: 5.0,
    reviewCount: 0,
    featured: false,
    isApproved: true,
    isActive: true,
    services: defaultServices,
    availableSlots: upcomingSlots,
    reviews: [],
  };

  if (isDbConnected()) {
    try {
      const existing = await Expert.findOne({ name: app.fullName, company: app.company });
      if (existing) {
        existing.isApproved = true;
        existing.isActive = true;
        existing.services = defaultServices;
        await existing.save();
        console.log(`[DataStore] Updated existing expert profile in MongoDB for ${app.fullName}`);
        return existing;
      }
      const newExpert = await Expert.create(expertData);
      console.log(`[DataStore] Created new approved expert profile in MongoDB for ${app.fullName} (ID: ${newExpert._id})`);
      return newExpert;
    } catch (err) {
      console.warn('[DataStore] Mongo createExpertFromApplication failed, fallback to memory:', err.message);
    }
  }

  // Memory fallback
  const memoryDoc = {
    _id: `exp-${Date.now()}`,
    ...expertData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryExperts.unshift(memoryDoc);
  return memoryDoc;
}

/* =========================================================================
   BOOKINGS DATA ACCESS
   ========================================================================= */

export async function checkBookingConflict(expertId, date, time) {
  if (isDbConnected()) {
    try {
      const conflict = await Booking.findOne({
        expert: expertId,
        date: date.trim(),
        time: time.trim(),
        status: { $in: ['confirmed', 'rescheduled'] },
      });
      return conflict;
    } catch (err) {
      console.warn('[DataStore] Mongo conflict check fallback:', err.message);
    }
  }

  return memoryBookings.find(
    (b) =>
      String(b.expert) === String(expertId) &&
      b.date === date.trim() &&
      b.time === time.trim() &&
      ['confirmed', 'rescheduled'].includes(b.status)
  );
}

export async function createBookingStore(bookingData) {
  if (isDbConnected()) {
    try {
      const newBooking = await Booking.create(bookingData);
      return newBooking;
    } catch (err) {
      console.warn('[DataStore] Mongo createBooking failed, fallback to memory:', err.message);
    }
  }

  const newDoc = {
    _id: `mem-${Date.now()}`,
    bookingReference: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    ...bookingData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryBookings.unshift(newDoc);
  return newDoc;
}

export async function getBookingsStore(filter = {}) {
  if (isDbConnected()) {
    try {
      const bookings = await Booking.find(filter).sort({ createdAt: -1 });
      return bookings;
    } catch (err) {
      console.warn('[DataStore] Mongo getBookingsStore failed, fallback to memory:', err.message);
    }
  }

  return [...memoryBookings];
}

export async function getBookingByIdStore(id) {
  if (isDbConnected()) {
    try {
      const booking = await Booking.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bookingReference: id }],
      });
      if (booking) return booking;
    } catch (err) {
      console.warn('[DataStore] Mongo getBookingByIdStore fallback:', err.message);
    }
  }

  return (
    memoryBookings.find(
      (b) => String(b._id) === String(id) || b.bookingReference === id || b.id === id
    ) || null
  );
}

export async function updateBookingStore(id, updates) {
  if (isDbConnected()) {
    try {
      const booking = await Booking.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bookingReference: id }] },
        { $set: updates },
        { new: true }
      );
      if (booking) return booking;
    } catch (err) {
      console.warn('[DataStore] Mongo updateBookingStore fallback:', err.message);
    }
  }

  const idx = memoryBookings.findIndex(
    (b) => String(b._id) === String(id) || b.bookingReference === id || b.id === id
  );
  if (idx !== -1) {
    memoryBookings[idx] = { ...memoryBookings[idx], ...updates, updatedAt: new Date() };
    return memoryBookings[idx];
  }
  return null;
}

/* =========================================================================
   MEMBERSHIP APPLICATIONS DATA ACCESS
   ========================================================================= */

export async function createApplicationStore(appData) {
  if (isDbConnected()) {
    try {
      const app = await MembershipApplication.create(appData);
      return app;
    } catch (err) {
      console.warn('[DataStore] Mongo createApplicationStore fallback:', err.message);
    }
  }

  const newDoc = {
    _id: `app-${Date.now()}`,
    applicationReference: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    ...appData,
    status: 'Pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryApplications.unshift(newDoc);
  return newDoc;
}

export async function getApplicationsStore({ status, search } = {}) {
  if (isDbConnected()) {
    try {
      const query = {};
      if (status && status !== 'all') query.status = status;
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { fullName: searchRegex },
          { email: searchRegex },
          { company: searchRegex },
          { domain: searchRegex },
        ];
      }
      const applications = await MembershipApplication.find(query).sort({ createdAt: -1 });
      const pendingCount = await MembershipApplication.countDocuments({ status: 'Pending' });
      const approvedCount = await MembershipApplication.countDocuments({ status: 'Approved' });
      const rejectedCount = await MembershipApplication.countDocuments({ status: 'Rejected' });

      return {
        applications,
        metrics: {
          total: applications.length,
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
        },
      };
    } catch (err) {
      console.warn('[DataStore] Mongo getApplicationsStore fallback:', err.message);
    }
  }

  let list = [...memoryApplications];
  if (status && status !== 'all') {
    list = list.filter((a) => a.status.toLowerCase() === status.toLowerCase());
  }
  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.domain.toLowerCase().includes(q)
    );
  }

  return {
    applications: list,
    metrics: {
      total: memoryApplications.length,
      pending: memoryApplications.filter((a) => a.status === 'Pending').length,
      approved: memoryApplications.filter((a) => a.status === 'Approved').length,
      rejected: memoryApplications.filter((a) => a.status === 'Rejected').length,
    },
  };
}

export async function getApplicationByIdStore(id) {
  if (isDbConnected()) {
    try {
      const app = await MembershipApplication.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { applicationReference: id }],
      });
      if (app) return app;
    } catch (err) {
      console.warn('[DataStore] Mongo getApplicationByIdStore fallback:', err.message);
    }
  }

  return (
    memoryApplications.find(
      (a) => String(a._id) === String(id) || a.applicationReference === id || a.id === id
    ) || null
  );
}

export async function updateApplicationStore(id, updates) {
  if (isDbConnected()) {
    try {
      const app = await MembershipApplication.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { applicationReference: id }] },
        { $set: updates },
        { new: true }
      );
      if (app) return app;
    } catch (err) {
      console.warn('[DataStore] Mongo updateApplicationStore fallback:', err.message);
    }
  }

  const idx = memoryApplications.findIndex(
    (a) => String(a._id) === String(id) || a.applicationReference === id || a.id === id
  );
  if (idx !== -1) {
    memoryApplications[idx] = { ...memoryApplications[idx], ...updates, updatedAt: new Date() };
    return memoryApplications[idx];
  }
  return null;
}
