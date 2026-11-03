import { Link } from "react-router-dom";
import type { Expert } from "../services/api";

interface ExpertCardProps {
  expert: Expert;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  const expertId = expert._id || expert.id;
  const services = expert.services || [];
  const cheapestService =
    [...services].sort((a, b) => a.priceINR - b.priceINR)[0] || services[0] || { priceINR: 299, durationMinutes: 60 };
  const minPrice = cheapestService.priceINR;

  return (
    <div className="group bg-white/80 backdrop-blur-lg rounded-2xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(255,122,0,0.12)] hover:border-orange-200/80 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Top Header: Avatar, Name, Company, Rating */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={expert.avatarUrl}
              alt={expert.name}
              className="w-15 h-15 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-orange-100"
              loading="lazy"
            />
            {expert.featured && (
              <span
                title="Featured Top Mentor"
                className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-[#FF7A00] to-[#FFB066] text-white p-1 rounded-full text-[10px] shadow-xs"
              >
                ★
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-950 truncate group-hover:text-[#FF7A00] transition-colors">
                {expert.name}
              </h3>
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-800 bg-orange-50/90 px-2.5 py-0.5 rounded-full border border-orange-200/60 shrink-0">
                <span className="text-[#FF7A00] text-sm leading-none">★</span>
                <span>{expert.rating?.toFixed(1) || "4.9"}</span>
                <span className="text-gray-400 font-normal">({expert.reviewCount || 0})</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mt-0.5">
              {expert.designation}
            </p>

            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {expert.company}
              </span>
              <span>•</span>
              <span className="bg-gray-100/80 text-gray-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                {expert.experienceYears}+ yrs exp
              </span>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <p className="mt-4 text-xs text-gray-600 leading-relaxed line-clamp-2">
          {expert.bio}
        </p>

        {/* Skills Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {expert.skills?.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium bg-white/90 text-gray-700 px-2.5 py-0.5 rounded-md border border-orange-100/80 shadow-2xs"
            >
              {skill}
            </span>
          ))}
          {expert.skills?.length > 4 && (
            <span className="text-[11px] font-medium text-gray-400 px-1 py-0.5">
              +{expert.skills.length - 4} more
            </span>
          )}
        </div>

        {/* Services Offered preview badges */}
        <div className="mt-4 pt-3 border-t border-orange-100/50 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
          <span className="font-medium text-gray-700 mr-1">Services:</span>
          {services.map((srv) => (
            <span
              key={srv._id || srv.name}
              className="inline-flex items-center gap-1 bg-[#FFF7F0] text-[#FF7A00] px-2 py-0.5 rounded-md font-medium border border-orange-100"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]"></span>
              {srv.name}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Pricing & CTAs */}
      <div className="bg-white/60 border-t border-white/80 px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Starts at
          </div>
          <div className="text-base font-extrabold text-gray-950">
            ₹{minPrice.toLocaleString("en-IN")}
            <span className="text-xs font-normal text-gray-500 ml-1">
              / {cheapestService.durationMinutes}m
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/mentorship/${expertId}/book`}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-[#FF7A00] hover:bg-[#e66e00] rounded-full transition-all shadow-xs shadow-orange-500/20 active:scale-95"
          >
            <span>Book</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
