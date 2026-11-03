import React from 'react';
import { SlidersHorizontal, ArrowUpDown, X, ChevronDown } from 'lucide-react';

export default function FilterBar({
  filters,
  onChangeFilter,
  onResetFilters,
  activeFilterCount,
  showEmploymentTypeFilter = true,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-4">
      {/* Filters Left */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Filters Badge Button */}
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white shadow-[0_10px_22px_rgba(217,72,15,0.3)]">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[rgba(255,255,255,0.28)] text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>

        {/* Work Mode Dropdown */}
        <div className="relative">
          <select
            value={filters.workMode || ''}
            onChange={(e) => onChangeFilter('workMode', e.target.value)}
            className="appearance-none bg-[rgba(255,255,255,0.62)] border border-[rgba(255,255,255,0.85)] backdrop-blur-[14px] text-[#C2410C] text-xs font-semibold rounded-full pl-3.5 pr-8 py-2 hover:bg-white/80 focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="">Work Mode</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#E8590C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Employment Type Dropdown (if enabled) */}
        {showEmploymentTypeFilter && (
          <div className="relative">
            <select
              value={filters.employmentType || ''}
              onChange={(e) => onChangeFilter('employmentType', e.target.value)}
              className="appearance-none bg-[rgba(255,255,255,0.62)] border border-[rgba(255,255,255,0.85)] backdrop-blur-[14px] text-[#C2410C] text-xs font-semibold rounded-full pl-3.5 pr-8 py-2 hover:bg-white/80 focus:outline-none cursor-pointer shadow-xs"
            >
              <option value="">Type</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#E8590C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Location Dropdown */}
        <div className="relative">
          <select
            value={filters.location || ''}
            onChange={(e) => onChangeFilter('location', e.target.value)}
            className="appearance-none bg-[rgba(255,255,255,0.62)] border border-[rgba(255,255,255,0.85)] backdrop-blur-[14px] text-[#C2410C] text-xs font-semibold rounded-full pl-3.5 pr-8 py-2 hover:bg-white/80 focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="">Location</option>
            <option value="Work from Home">Work from Home</option>
            <option value="Delhi">Delhi / NCR</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Remote">Remote</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#E8590C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-[#9A3412] hover:text-[#F26A21] font-semibold px-3 py-1.5 rounded-full hover:bg-[rgba(242,106,33,0.13)] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* Sort By Right */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#E8590C] absolute left-3.5 pointer-events-none" />
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => onChangeFilter('sort', e.target.value)}
            className="appearance-none bg-[rgba(255,255,255,0.62)] border border-[rgba(255,255,255,0.85)] backdrop-blur-[14px] text-[#C2410C] text-xs font-semibold rounded-full pl-9 pr-8 py-2 hover:bg-white/80 focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="newest">Sort By: Newest</option>
            <option value="deadline">Approaching Deadline</option>
            <option value="stipend_high">Highest Compensation</option>
            <option value="oldest">Oldest First</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#E8590C] absolute right-2.5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
