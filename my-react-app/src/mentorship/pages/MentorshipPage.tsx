import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchExperts, type Expert } from "../services/api";
import { ExpertCard } from "../components/ExpertCard";
import { ExpertFilters, type FilterOptions } from "../components/ExpertFilters";

export function meta() {
  return [
    { title: "Find Industry Experts | CareerHub Expert Guidance" },
    {
      name: "description",
      content:
        "Book 1-on-1 mock interviews and career mentorship with vetted senior engineers and hiring managers at Google, Microsoft, Amazon, and top tech companies.",
    },
  ];
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    domain: "all",
    serviceType: "all",
    priceRange: "all",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadExperts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchExperts({
          search: filters.searchQuery,
          domain: filters.domain,
          serviceType: filters.serviceType,
          priceRange: filters.priceRange,
        });
        if (isMounted) {
          setExperts(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load experts from backend.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadExperts();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header Section */}
      <section className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/80 p-6 sm:p-10 shadow-[0_8px_30px_rgba(255,122,0,0.06)] relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-[#FFB066]/30 to-[#FF7A00]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top Action Row: Pill badge + Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7F0] border border-orange-200/80 text-xs font-bold text-[#FF7A00] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-pulse"></span>
              Expert Guidance & Mentorship
            </div>

            <div className="hidden">
              <Link
                to="/my-bookings"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-800 bg-white/90 border border-orange-100 rounded-full hover:bg-white hover:text-[#FF7A00] transition-all shadow-2xs hover:shadow-sm"
              >
                <svg className="w-4 h-4 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>My Bookings</span>
              </Link>
              <Link
                to="/become-a-member"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FF7A00] to-[#FF9029] hover:from-[#e66e00] hover:to-[#FF7A00] rounded-full transition-all shadow-md shadow-orange-500/20 active:scale-95"
              >
                <span>Become a Member</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Hero Typography */}
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937] tracking-tight leading-[1.2]">
              Find the right <span className="text-[#FF7A00]">expert</span> for your career.
            </h1>
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#6B7280] leading-relaxed font-normal max-w-2xl">
              Learn directly from experienced software engineers, product managers, and engineering leads at top tech companies. Book simulated interviews, resume teardowns, and actionable 1-on-1 career guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar Component */}
      <ExpertFilters
        filters={filters}
        onChange={setFilters}
        totalResults={experts.length}
      />

      {/* Main Experts Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 p-6 animate-pulse h-72 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100/60" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-orange-100/60 rounded-md w-3/4" />
                    <div className="h-3 bg-gray-200/60 rounded-md w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 my-4">
                  <div className="h-3 bg-gray-200/50 rounded-md w-full" />
                  <div className="h-3 bg-gray-200/50 rounded-md w-4/5" />
                </div>
                <div className="h-10 bg-orange-100/40 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50/80 backdrop-blur-md border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl mb-3">
              ⚠️
            </div>
            <h3 className="text-base font-bold text-red-900">Unable to load experts</h3>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            <button
              type="button"
              onClick={() => setFilters({ ...filters })}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold"
            >
              Retry Connection
            </button>
          </div>
        ) : experts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <ExpertCard key={expert._id || expert.id} expert={expert} />
            ))}
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF7F0] text-[#FF7A00] flex items-center justify-center text-2xl mb-4 border border-orange-100">
              🔍
            </div>
            <h3 className="text-lg font-bold text-gray-900">No experts found</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              We couldn&apos;t find any experts matching your search criteria. Try removing filters or searching for another keyword.
            </p>
            <button
              type="button"
              onClick={() =>
                setFilters({
                  searchQuery: "",
                  domain: "all",
                  serviceType: "all",
                  priceRange: "all",
                })
              }
              className="mt-6 px-5 py-2 text-xs font-semibold text-white bg-[#FF7A00] hover:bg-[#e66e00] rounded-full transition-colors shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Bottom Mentor Community Banner */}
      <section className="hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFF7F0] text-[#FF7A00] border border-orange-200/60 mb-2">
              Join Our Mentor Network
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
              Are you an experienced developer or tech leader?
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
              Help students transition into Tier-1 tech roles, conduct mock interviews on your schedule, and get compensated directly.
            </p>
          </div>
          <Link
            to="/become-a-member"
            className="px-6 py-3 text-sm font-bold text-white bg-[#FF7A00] hover:bg-[#e66e00] rounded-full transition-all shadow-md shadow-orange-500/20 shrink-0 active:scale-95"
          >
            Apply as a Mentor →
          </Link>
        </div>
      </section>
    </div>
  );
}
