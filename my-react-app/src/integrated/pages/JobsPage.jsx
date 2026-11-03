import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Home,
  ChevronRight,
  Bell,
  Sparkles,
  Loader2,
  AlertCircle,
  Briefcase,
  Heart,
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Building2,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import CategoryPills from '../components/common/CategoryPills';
import FilterBar from '../components/common/FilterBar';
import JobCard from '../features/jobs/JobCard';
import JobDetailModal from '../features/jobs/JobDetailModal';
import ApplyModal from '../features/jobs/ApplyModal';
import JobAlertModal from '../features/jobs/JobAlertModal';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';

const JOB_CATEGORIES = [
  { name: 'Content Writing', icon: '📝' },
  { name: 'Digital Marketing', icon: '📢' },
  { name: 'Data Science', icon: '📈' },
  { name: 'Accounting', icon: '📊' },
  { name: 'Software Development', icon: '💻' },
  { name: 'Data Analysis', icon: '⚡' },
];

export default function JobsPage() {
  const { user, isRecruiter, setSavedIdsList } = useAuth();
  const recruiterActive = isRecruiter || user?.role === 'recruiter';

  // Tab State: 'all' | 'saved' | 'applications'
  const [activeTab, setActiveTab] = useState('all');

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    workMode: '',
    employmentType: '',
    location: '',
    sort: 'newest',
  });

  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // Fetch initial saved jobs and applications
  const fetchSavedAndApplications = () => {
    jobService
      .getSavedJobs()
      .then((res) => {
        if (res.data) {
          setSavedJobs(res.data);
          setSavedIdsList(res.data.map((j) => j._id));
        }
      })
      .catch(() => {});

    jobService
      .getMyApplications()
      .then((res) => {
        if (res.data) {
          setApplications(res.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSavedAndApplications();
  }, []);

  // Fetch jobs whenever search or filters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          search,
          ...filters,
        };
        const res = await jobService.getJobs(queryParams);
        setJobs(res.data || []);
        setTotalCount(res.total || res.data?.length || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchJobs();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      workMode: '',
      employmentType: '',
      location: '',
      sort: 'newest',
    });
    setSearch('');
  };

  const handleSavedToggle = (jobId, isSaved) => {
    if (!isSaved) {
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    } else {
      fetchSavedAndApplications();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Shortlisted
          </span>
        );
      case 'Interview':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCircle2 className="w-3 h-3" />
            Interview Scheduled
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Not Selected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <FileCheck2 className="w-3 h-3" />
            Application Submitted
          </span>
        );
    }
  };

  const activeFilterCount =
    Object.values(filters).filter((val) => val && val !== 'newest').length + (search ? 1 : 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-1.5 text-xs text-[#5B5568]">
          <span className="text-[#5B5568]/70">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#5B5568]/50" />
          <span className="font-semibold text-[#1E1B3A]">Jobs</span>
        </div>

        {activeTab === 'all' && (
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-[#5B5568]/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Jobs by role, tech stack, or employer..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.62)] backdrop-blur-[18px] text-xs font-medium text-[#1E1B3A] placeholder:text-[#5B5568]/60 focus:outline-none focus:ring-2 focus:ring-[#F47B2A]/30 shadow-[0_10px_28px_rgba(180,90,30,0.1)]"
            />
          </div>
        )}
      </div>

      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(242,106,33,0.13)] border border-[rgba(242,106,33,0.3)] text-[#9A3412] text-[11px] font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Student Career & Job Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B3A] tracking-tight">
            {activeTab === 'all' && (
              <>
                {totalCount} Jobs for <span className="text-[#F26A21]">Students</span>
              </>
            )}
            {activeTab === 'saved' && (
              <>
                Saved <span className="text-[#F26A21]">Jobs</span> ({savedJobs.length})
              </>
            )}
            {activeTab === 'applications' && (
              <>
                My <span className="text-[#F26A21]">Applications</span> ({applications.length})
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B5568] mt-1">
            {activeTab === 'all' && 'Find the latest job openings for students.'}
            {activeTab === 'saved' && 'Your bookmarked positions for easy application before deadlines.'}
            {activeTab === 'applications' && 'Track your submitted applications and interview updates.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Recruiter direct Post button */}
          {recruiterActive && (
            <Link
              to="/recruiter/jobs/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white shadow-[0_10px_22px_rgba(217,72,15,0.3)] hover:opacity-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Post Job</span>
            </Link>
          )}

          {activeTab === 'all' && (
            <button
              onClick={() => setAlertModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[rgba(242,106,33,0.45)] bg-[rgba(255,255,255,0.7)] hover:bg-white text-xs font-semibold text-[#9A3412] shadow-xs transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-[#E8590C]" />
              <span>Set Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Integrated Navigation Tabs: All Jobs | Saved Jobs | My Applications */}
      <div className="flex items-center gap-2 border-b border-[rgba(30,27,58,0.1)] pb-3 mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white shadow-[0_10px_22px_rgba(217,72,15,0.3)]'
              : 'bg-[rgba(255,255,255,0.62)] hover:bg-white/80 text-[#C2410C] border border-[rgba(255,255,255,0.85)] backdrop-blur-[14px]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>All Jobs</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'all'
                ? 'bg-[rgba(255,255,255,0.28)] text-white'
                : 'bg-[rgba(30,27,58,0.07)] text-[#5B5568]'
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'saved'
              ? 'bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white shadow-[0_10px_22px_rgba(217,72,15,0.3)]'
              : 'bg-[rgba(255,255,255,0.62)] hover:bg-white/80 text-[#C2410C] border border-[rgba(255,255,255,0.85)] backdrop-blur-[14px]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Saved Jobs</span>
          {savedJobs.length > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'saved'
                  ? 'bg-[rgba(255,255,255,0.28)] text-white'
                  : 'bg-[rgba(30,27,58,0.07)] text-[#5B5568]'
              }`}
            >
              {savedJobs.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'applications'
              ? 'bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white shadow-[0_10px_22px_rgba(217,72,15,0.3)]'
              : 'bg-[rgba(255,255,255,0.62)] hover:bg-white/80 text-[#C2410C] border border-[rgba(255,255,255,0.85)] backdrop-blur-[14px]'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>My Applications</span>
          {applications.length > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'applications'
                  ? 'bg-[rgba(255,255,255,0.28)] text-white'
                  : 'bg-[rgba(30,27,58,0.07)] text-[#5B5568]'
              }`}
            >
              {applications.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ALL JOBS */}
      {activeTab === 'all' && (
        <>
          {/* Quick Category Pills */}
          <div className="mb-4">
            <CategoryPills
              categories={JOB_CATEGORIES}
              selectedCategory={filters.category}
              onSelectCategory={(cat) => handleFilterChange('category', cat)}
            />
          </div>

          {/* Filter and Sort Controls Bar */}
          <FilterBar
            filters={filters}
            onChangeFilter={handleFilterChange}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
            showEmploymentTypeFilter={true}
          />

          {/* Job Cards List */}
          <div className="space-y-4 mt-2">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
                <p className="text-xs font-medium">Loading opportunities...</p>
              </div>
            ) : error ? (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <p className="font-bold">Failed to load listings</p>
                  <p className="text-[11px] mt-0.5">{error}</p>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-[rgba(255,255,255,0.66)] backdrop-blur-[20px] rounded-[26px] border border-[rgba(255,255,255,0.85)] p-12 text-center shadow-[0_16px_40px_rgba(180,90,30,0.16)]">
                <div className="w-12 h-12 rounded-full bg-[rgba(30,27,58,0.07)] flex items-center justify-center mx-auto text-[#5B5568] mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#1E1B3A]">No jobs matched your filters</h3>
                <p className="text-xs text-[#5B5568] max-w-sm mx-auto mt-1 mb-4">
                  Try clearing some filters or searching with a broader keyword.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white text-xs font-semibold shadow-[0_10px_22px_rgba(217,72,15,0.3)] hover:opacity-95 transition-opacity"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onSelect={(j) => setSelectedJob(j)}
                  onJobSavedToggle={handleSavedToggle}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* TAB 2: SAVED JOBS */}
      {activeTab === 'saved' && (
        <div className="space-y-4 mt-2">
          {savedJobs.length === 0 ? (
            <div className="bg-[rgba(255,255,255,0.66)] backdrop-blur-[20px] rounded-[26px] border border-[rgba(255,255,255,0.85)] p-12 text-center max-w-md mx-auto my-8 shadow-[0_16px_40px_rgba(180,90,30,0.16)]">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(242,106,33,0.13)] text-[#9A3412] flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-[#1E1B3A]">No saved jobs yet</h3>
              <p className="text-xs text-[#5B5568] mt-1.5 mb-6 leading-relaxed">
                Click the heart icon on any job card to save it here for quick reference.
              </p>
              <button
                onClick={() => setActiveTab('all')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white shadow-[0_10px_22px_rgba(217,72,15,0.3)] hover:opacity-95 transition-all hover:scale-105"
              >
                <span>Browse Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            savedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onSelect={(j) => setSelectedJob(j)}
                onJobSavedToggle={handleSavedToggle}
              />
            ))
          )}
        </div>
      )}

      {/* TAB 3: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4 mt-2">
          {applications.length === 0 ? (
            <div className="bg-[rgba(255,255,255,0.66)] backdrop-blur-[20px] rounded-[26px] border border-[rgba(255,255,255,0.85)] p-12 text-center max-w-md mx-auto my-8 shadow-[0_16px_40px_rgba(180,90,30,0.16)]">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(242,106,33,0.13)] text-[#9A3412] flex items-center justify-center mx-auto mb-4">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-[#1E1B3A]">No applications submitted yet</h3>
              <p className="text-xs text-[#5B5568] mt-1.5 mb-6 leading-relaxed">
                Explore the job openings and submit your application to track its progress here.
              </p>
              <button
                onClick={() => setActiveTab('all')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white shadow-[0_10px_22px_rgba(217,72,15,0.3)] hover:opacity-95 transition-all hover:scale-105"
              >
                <span>Browse Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="bg-[rgba(255,255,255,0.66)] backdrop-blur-[20px] rounded-[26px] border border-[rgba(255,255,255,0.85)] p-6 shadow-[0_16px_40px_rgba(180,90,30,0.16)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/80 border border-[rgba(255,255,255,0.9)] overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                    {app.jobId?.companyLogo ? (
                      <img
                        src={app.jobId.companyLogo}
                        alt=""
                        className="w-full h-full object-contain rounded"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-[#5B5568]" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#1E1B3A]">
                      {app.jobId?.title || 'Applied Position'}
                    </h3>
                    <p className="text-xs font-semibold text-[#5B5568] mt-0.5">
                      {app.jobId?.companyName || 'Verified Employer'} • Applied on{' '}
                      {new Date(app.appliedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#5B5568]">
                      <span>
                        Applicant: <strong className="text-[#1E1B3A]">{app.fullName}</strong>
                      </span>
                      <span>•</span>
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#9A3412] hover:underline font-semibold"
                      >
                        <span>View Resume</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:self-center shrink-0">
                  {getStatusBadge(app.status)}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApplyClick={(j) => setApplyJob(j)}
          onJobSavedToggle={handleSavedToggle}
        />
      )}

      {applyJob && (
        <ApplyModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onAppliedSuccess={() => fetchSavedAndApplications()}
        />
      )}

      {alertModalOpen && <JobAlertModal onClose={() => setAlertModalOpen(false)} />}
    </div>
  );
}
