export interface FilterOptions {
  searchQuery?: string;
  domain?: string;
  serviceType?: string;
  priceRange?: string;
}

interface ExpertFiltersProps {
  filters: FilterOptions;
  onChange: (updated: FilterOptions) => void;
  totalResults: number;
}

export function ExpertFilters({ filters, onChange, totalResults }: ExpertFiltersProps) {
  const domains = [
    { label: "All Domains", value: "all" },
    { label: "Software Engineering", value: "Software Engineering" },
    { label: "Cloud & DevOps", value: "Cloud & DevOps" },
    { label: "AI & Machine Learning", value: "AI & Machine Learning" },
    { label: "Product Management", value: "Product Management" },
    { label: "UI/UX Design", value: "UI/UX Design" },
  ];

  const sessionTypes = [
    { label: "All Sessions", value: "all" },
    { label: "Mock Interviews (₹299)", value: "Mock Interview" },
    { label: "Career Guidance (₹199)", value: "Career Guidance" },
    { label: "Resume Review (₹149)", value: "Resume Review" },
    { label: "Advanced Tech (₹399)", value: "Advanced Technical Interview" },
  ];

  const priceRanges = [
    { label: "Any Price", value: "all" },
    { label: "Under ₹200", value: "under-200" },
    { label: "₹200 - ₹300", value: "200-300" },
    { label: "Above ₹300", value: "above-300" },
  ];

  const hasActiveFilters = Boolean(
    (filters.searchQuery && filters.searchQuery.trim() !== "") ||
      (filters.domain && filters.domain !== "all") ||
      (filters.serviceType && filters.serviceType !== "all") ||
      (filters.priceRange && filters.priceRange !== "all")
  );

  const resetFilters = () => {
    onChange({
      searchQuery: "",
      domain: "all",
      serviceType: "all",
      priceRange: "all",
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/80 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <svg className="w-5 h-5 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={filters.searchQuery || ""}
          onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          placeholder="Search by mentor name, company (e.g. Google, Microsoft), designation, or skill (e.g. System Design)..."
          className="w-full pl-11 pr-12 py-3 bg-white/90 border border-orange-100 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] transition-all shadow-2xs"
        />
        {filters.searchQuery && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, searchQuery: "" })}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-medium text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Row: Domain, Session Type, Price Range */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-orange-100/50">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Domain Dropdown */}
          <div className="relative">
            <select
              value={filters.domain || "all"}
              onChange={(e) => onChange({ ...filters, domain: e.target.value })}
              className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-medium py-2 pl-3.5 pr-8 rounded-full focus:outline-hidden focus:border-[#FF7A00] hover:bg-gray-50 cursor-pointer shadow-2xs"
            >
              {domains.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Session Type Pill Buttons */}
          <div className="flex items-center bg-gray-100/80 p-0.5 rounded-full border border-gray-200/50 overflow-x-auto max-w-full">
            {sessionTypes.map((st) => {
              const active = (filters.serviceType || "all") === st.value;
              return (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => onChange({ ...filters, serviceType: st.value })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-white text-[#FF7A00] shadow-xs font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          {/* Price Range Dropdown */}
          <div className="relative">
            <select
              value={filters.priceRange || "all"}
              onChange={(e) => onChange({ ...filters, priceRange: e.target.value })}
              className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-medium py-2 pl-3.5 pr-8 rounded-full focus:outline-hidden focus:border-[#FF7A00] hover:bg-gray-50 cursor-pointer shadow-2xs"
            >
              {priceRanges.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Counter and Reset button */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs font-medium text-gray-500">
            Showing <strong className="text-gray-900 font-bold">{totalResults}</strong>{" "}
            {totalResults === 1 ? "expert" : "experts"}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#FF7A00] hover:text-[#e66e00] underline underline-offset-2 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
