import { api } from "../../api";

export interface Service {
  _id?: string;
  name: string;
  durationMinutes: number;
  priceINR: number;
  description: string;
  agenda?: string[];
}

export interface AvailableSlot {
  date: string;
  times: string[];
}

export interface Review {
  studentName: string;
  studentRole: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Expert {
  _id: string;
  id?: string;
  name: string;
  designation: string;
  company: string;
  avatarUrl: string;
  avatarBg?: string;
  experienceYears: number;
  domain: string;
  skills: string[];
  bio: string;
  about?: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  isApproved?: boolean;
  isActive?: boolean;
  services: Service[];
  availableSlots: AvailableSlot[];
  reviews?: Review[];
}

export interface Booking {
  _id: string;
  id?: string;
  bookingReference: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  targetRole: string;
  notes?: string;
  expert: string;
  expertName: string;
  expertCompany: string;
  expertDesignation: string;
  expertAvatarUrl?: string;
  serviceType: string;
  date: string;
  time: string;
  durationMinutes: number;
  priceINR: number;
  status: "confirmed" | "completed" | "cancelled" | "rescheduled";
  paymentStatus: string;
  transactionRef: string;
  paymentMethod: string;
  meetingLink: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  expertId: string;
  serviceType: string;
  date: string;
  time: string;
  targetRole: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  notes?: string;
  paymentMethod?: string;
  transactionRef?: string;
}

export async function fetchExperts(filters?: {
  search?: string;
  domain?: string;
  serviceType?: string;
  priceRange?: string;
}): Promise<Expert[]> {
  const query = new URLSearchParams();
  if (filters?.search) query.set("search", filters.search);
  if (filters?.domain && filters.domain !== "all") query.set("domain", filters.domain);
  if (filters?.serviceType && filters.serviceType !== "all") query.set("serviceType", filters.serviceType);
  if (filters?.priceRange && filters.priceRange !== "all") query.set("priceRange", filters.priceRange);
  const suffix = query.size ? `?${query.toString()}` : "";
  const response = await api(`/api/experts${suffix}`);
  return response.data;
}

export async function fetchExpertById(id: string): Promise<Expert> {
  const response = await api(`/api/experts/${encodeURIComponent(id)}`);
  return response.data;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const response = await api("/api/bookings", {
    method: "POST",
    body: payload,
  });
  return response.data;
}
