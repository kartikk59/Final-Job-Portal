import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, BookOpen, Sparkles, ArrowRight, CheckCircle, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-16rem)]">
      {/* Hero Section matching Reference Page 1 */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Student Placement Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Your next opportunity could be <span className="text-brand-500">waiting.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore top companies and discover roles that match your skills and career goals.
          Access verified internships, interview preparation materials, and community study notes.
        </p>

        {/* Action Buttons matching Page 1 */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/jobs"
            className="px-7 py-3 rounded-full text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all hover:scale-105"
          >
            Explore Jobs
          </Link>
          <Link
            to="/internships"
            className="px-7 py-3 rounded-full text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all hover:scale-105"
          >
            Browse Internships
          </Link>
          <Link
            to="/resources"
            className="px-6 py-3 rounded-full text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all"
          >
            Prep Zone
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-500 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Job & Internship Portal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curated openings for undergraduate and postgraduate students. Filter by Work from Home, Remote, Hybrid, or On-site with clear stipend disclosures.
            </p>
            <Link
              to="/internships"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 mt-4 hover:gap-2 transition-all"
            >
              Browse Openings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Prep Zone & Resources</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Striver SDE sheets, core CS handwritten notes, system design primers, and past company Online Assessment questions all in one place.
            </p>
            <Link
              to="/resources"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-4 hover:gap-2 transition-all"
            >
              Explore Library <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Student Application Tracker</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bookmark dream companies, track live submission statuses from Applied to Under Review, and set automated alerts for new role releases.
            </p>
            <Link
              to="/applications"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4 hover:gap-2 transition-all"
            >
              Track Submissions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
