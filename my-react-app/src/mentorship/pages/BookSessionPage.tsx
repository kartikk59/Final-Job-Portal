import { useState, useEffect } from "react";
import { useLocation, useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  fetchExpertById,
  createBooking,
  type Expert,
  type Booking,
} from "../services/api";
import { AvailabilityCalendar } from "../components/AvailabilityCalendar";
import { TimeSlotPicker } from "../components/TimeSlotPicker";
import { PaymentModal, type PaymentSuccessResult } from "../components/PaymentModal";
import { useAuth } from "../../context/AuthContext";

export function meta() {
  return [
    { title: "Book a 1-on-1 Session | CareerHub" },
    { name: "description", content: "Complete your session booking with an industry expert." },
  ];
}

export default function BookSessionPage() {
  const { pathname } = useLocation();
  const id = pathname.split("/")[2];
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedServiceName, setSelectedServiceName] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Form inputs
  const [studentName, setStudentName] = useState(user?.name || "");
  const [studentEmail, setStudentEmail] = useState(user?.email || "");
  const [studentPhone, setStudentPhone] = useState(user?.phone || "");
  const [targetRole, setTargetRole] = useState("");
  const [notes, setNotes] = useState("");

  // Validation & modal states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchExpertById(id);
        if (isMounted) {
          setExpert(data);
          const paramService = searchParams.get("service");
          const defaultService =
            data.services.find((s) => s.name === paramService) || data.services[0];
          setSelectedServiceName(defaultService?.name || "Mock Interview");

          const paramDate = searchParams.get("date");
          const defaultDate = paramDate || data.availableSlots[0]?.date || "";
          setSelectedDate(defaultDate);

          const paramTime = searchParams.get("time");
          const slotObj = data.availableSlots.find((s) => s.date === defaultDate);
          const defaultTime = paramTime || slotObj?.times[0] || "";
          setSelectedTime(defaultTime);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load expert for booking.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id, searchParams]);

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="h-8 bg-white/50 backdrop-blur-md rounded-xl w-48 animate-pulse" />
        <div className="h-64 bg-white/60 backdrop-blur-md rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl border border-white/90 p-8 text-center shadow-lg">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 text-[#FF7A00] flex items-center justify-center text-2xl mb-4 border border-orange-200">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-gray-950">Expert Not Found</h2>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            {error || `Cannot book a session because expert ID "${id}" does not exist.`}
          </p>
          <Link
            to="/mentorship"
            className="mt-6 inline-block px-5 py-2.5 text-xs font-semibold text-white bg-[#FF7A00] hover:bg-[#e66e00] rounded-full transition-colors shadow-xs"
          >
            ← Back to Experts
          </Link>
        </div>
      </div>
    );
  }

  const services = expert.services || [];
  const selectedService =
    services.find((s) => s.name === selectedServiceName) ||
    services[0] || { name: "Mock Interview", priceINR: 299, durationMinutes: 60 };

  const availableDates = expert.availableSlots?.map((s) => s.date) || [];
  const activeSlotObj = expert.availableSlots?.find((s) => s.date === selectedDate);
  const timesForDate = activeSlotObj ? activeSlotObj.times : [];

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    const slotObj = expert.availableSlots?.find((s) => s.date === date);
    if (slotObj && slotObj.times.length > 0) {
      setSelectedTime(slotObj.times[0]);
    } else {
      setSelectedTime("");
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!studentName.trim()) errs.studentName = "Please enter your full name.";
    if (!studentEmail.trim()) {
      errs.studentEmail = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      errs.studentEmail = "Please enter a valid email address.";
    }
    if (!studentPhone.trim()) errs.studentPhone = "Please enter your phone number.";
    if (!targetRole.trim()) {
      errs.targetRole = "Please specify your target job role (e.g. SDE-1, APM, Cloud Engineer).";
    }
    if (!selectedDate) errs.selectedDate = "Please choose a session date.";
    if (!selectedTime) errs.selectedTime = "Please pick a time slot.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentResult: PaymentSuccessResult) => {
    try {
      setSubmittingBooking(true);
      const payload = {
        expertId: expert._id || expert.id || "",
        serviceType: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        targetRole: targetRole.trim(),
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim(),
        studentPhone: studentPhone.trim(),
        notes: notes.trim(),
        paymentMethod: paymentResult.method,
        transactionRef: paymentResult.txnId,
      };

      const created = await createBooking(payload);
      setIsPaymentModalOpen(false);
      setConfirmedBooking(created);
    } catch (err: any) {
      alert(`Booking creation failed: ${err.message}`);
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 w-fit">
        <Link to="/mentorship" className="hover:text-[#FF7A00] transition-colors">Mentors</Link>
        <span>/</span>
        <span>{expert.name}</span>
        <span>/</span>
        <span className="text-gray-900 font-semibold">Book Session</span>
      </div>

      <form onSubmit={handleProceedToPayment}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Expert Banner */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/90 p-5 sm:p-6 shadow-[0_8px_30px_rgba(255,122,0,0.06)] flex items-center gap-4">
              <img
                src={expert.avatarUrl}
                alt={expert.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-orange-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-950 truncate">{expert.name}</h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFF7F0] text-[#FF7A00] border border-orange-100">
                    {expert.company}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{expert.designation}</p>
                <p className="text-xs text-[#FF7A00] font-medium mt-1">
                  ★ {expert.rating?.toFixed(2) || "4.95"} ({expert.reviewCount || 0} reviews)
                </p>
              </div>
              <Link
                to="/mentorship"
                className="text-xs font-semibold text-gray-600 hover:text-[#FF7A00] underline shrink-0 hidden sm:block transition-colors"
              >
                Change Mentor
              </Link>
            </div>

            {/* Step 1: Session Type Selection */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/90 p-6 shadow-[0_8px_30px_rgba(255,122,0,0.06)] space-y-4">
              <h3 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#FFB066] text-white text-xs flex items-center justify-center font-bold shadow-2xs">
                  1
                </span>
                Choose Session Type
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {services.map((srv) => {
                  const isSelected = selectedServiceName === srv.name;
                  return (
                    <div
                      key={srv.name}
                      onClick={() => setSelectedServiceName(srv.name)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FFF7F0] border-[#FF7A00] ring-2 ring-orange-500/20 shadow-xs"
                          : "bg-white/70 border-gray-200/80 hover:border-orange-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-bold text-gray-950">{srv.name}</div>
                          <span className="text-xs text-gray-500">{srv.durationMinutes} mins</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-gray-950">
                            ₹{srv.priceINR.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                        {srv.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date and Time Schedule */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/90 p-6 shadow-[0_8px_30px_rgba(255,122,0,0.06)] space-y-5">
              <h3 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#FFB066] text-white text-xs flex items-center justify-center font-bold shadow-2xs">
                  2
                </span>
                Choose Date & Time Slot
              </h3>

              <AvailabilityCalendar
                availableDates={availableDates}
                selectedDate={selectedDate}
                onSelectDate={handleDateChange}
              />
              {errors.selectedDate && (
                <p className="text-xs text-red-600 font-medium">{errors.selectedDate}</p>
              )}

              <TimeSlotPicker
                slots={timesForDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
              />
              {errors.selectedTime && (
                <p className="text-xs text-red-600 font-medium">{errors.selectedTime}</p>
              )}
            </div>

            {/* Step 3: Target Role and Student Prep Notes */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/90 p-6 shadow-[0_8px_30px_rgba(255,122,0,0.06)] space-y-4">
              <h3 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#FFB066] text-white text-xs flex items-center justify-center font-bold shadow-2xs">
                  3
                </span>
                Interview Goals & Candidate Details
              </h3>

              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Target Job Role / Company Goal <span className="text-[#FF7A00]">*</span>
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. SDE-1 at Amazon, Backend Engineer, APM"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] bg-white/90"
                  />
                  {errors.targetRole && (
                    <p className="text-xs text-red-600 font-medium mt-1">{errors.targetRole}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Specific Focus Topics or Agenda (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. 'I want to focus on System Design for high-throughput messaging, or mock interview for my upcoming round.'"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] resize-none bg-white/90"
                  />
                </div>

                {/* Student Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Name <span className="text-[#FF7A00]">*</span>
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] bg-white/90"
                    />
                    {errors.studentName && (
                      <p className="text-xs text-red-600 font-medium mt-1">{errors.studentName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Student Email <span className="text-[#FF7A00]">*</span>
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] bg-white/90"
                    />
                    {errors.studentEmail && (
                      <p className="text-xs text-red-600 font-medium mt-1">{errors.studentEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number <span className="text-[#FF7A00]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] bg-white/90"
                    />
                    {errors.studentPhone && (
                      <p className="text-xs text-red-600 font-medium mt-1">{errors.studentPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Order Summary & Trigger */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white/85 backdrop-blur-xl rounded-3xl border border-white/90 p-6 shadow-[0_12px_40px_rgba(255,122,0,0.08)] space-y-6">
              <h3 className="text-base font-bold text-gray-950 pb-3 border-b border-orange-100/60">
                Booking Summary
              </h3>

              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Expert:</span>
                  <span className="font-bold text-gray-900">{expert.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Company:</span>
                  <span className="font-medium text-gray-900">{expert.company}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-semibold text-[#FF7A00]">{selectedService.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium text-gray-900">{selectedService.durationMinutes} mins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-semibold text-gray-900">{selectedDate || "Not chosen"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-semibold text-gray-900">{selectedTime || "Not chosen"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-orange-100/60 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Base Fee</span>
                  <span>₹{selectedService.priceINR.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Platform Fee</span>
                  <span>₹0 (Waived)</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-orange-100/60 text-base font-extrabold text-gray-950">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#FF7A00]">
                    ₹{selectedService.priceINR.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF7A00] to-[#FF9029] hover:from-[#e66e00] hover:to-[#FF7A00] text-white font-bold text-sm rounded-full transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Continue to Payment →</span>
              </button>

              <div className="bg-[#FFF7F0] rounded-2xl p-3 border border-orange-100 text-[11px] text-gray-600 space-y-1">
                <p className="font-semibold text-gray-900">CareerHub Guarantee:</p>
                <p>• Verified Google Meet invitation link</p>
                <p>• Free reschedule up to 6 hours prior</p>
                <p>• Scored rubric evaluation feedback</p>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Simulated Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        details={{
          expertName: expert.name,
          expertCompany: expert.company,
          serviceName: selectedService.name,
          durationMinutes: selectedService.durationMinutes,
          date: selectedDate,
          time: selectedTime,
          amountINR: selectedService.priceINR,
        }}
        onSuccess={handlePaymentSuccess}
      />

      {/* Confirmation Success Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-150 animate-in fade-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-4 shadow-sm">
              ✓
            </div>

            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Payment Successful • Booking Confirmed!
              </span>
              <h2 className="text-2xl font-black text-gray-950 mt-1">
                Your Session is Scheduled
              </h2>
              <p className="text-xs text-gray-500 mt-2">
                A calendar invitation and payment receipt have been prepared for <strong className="text-gray-800">{confirmedBooking.studentEmail}</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="mt-6 bg-gray-50/80 rounded-2xl p-4 border border-gray-200 text-xs space-y-2 text-gray-700">
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500">Booking Reference:</span>
                <span className="font-mono font-bold text-gray-900">{confirmedBooking.bookingReference || confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono font-bold text-emerald-700">{confirmedBooking.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {confirmedBooking.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mentor:</span>
                <span className="font-bold text-gray-900">{confirmedBooking.expertName} ({confirmedBooking.expertCompany})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Session Type:</span>
                <span className="font-semibold text-[#FF7A00]">{confirmedBooking.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Scheduled:</span>
                <span className="font-semibold text-gray-900">
                  {confirmedBooking.date} at {confirmedBooking.time}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200/60 pt-2 font-bold text-gray-900">
                <span>Amount Paid:</span>
                <span className="text-[#FF7A00]">₹{confirmedBooking.priceINR}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 py-3 px-4 text-xs font-bold text-white bg-[#FF7A00] hover:bg-[#e66e00] rounded-full transition-colors text-center cursor-pointer shadow-xs"
              >
                Return to My Profile →
              </button>
              <button
                type="button"
                onClick={() => navigate("/mentorship")}
                className="flex-1 py-3 px-4 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-center cursor-pointer"
              >
                Browse More Experts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
