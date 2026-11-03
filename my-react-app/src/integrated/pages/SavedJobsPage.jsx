import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Heart, Home, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import JobCard from '../features/jobs/JobCard';
import JobDetailModal from '../features/jobs/JobDetailModal';
import ApplyModal from '../features/jobs/ApplyModal';
import { jobService } from '../services/jobService';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await jobService.getSavedJobs();
      setSavedJobs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleSavedToggle = (jobId, isSaved) => {
    if (!isSaved) {
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link to="/" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="font-semibold text-slate-800">Saved Opportunities</span>
      </div>

      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Saved Jobs & Internships ({savedJobs.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Positions you have bookmarked for easy application before their deadline expires.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
          <p className="text-xs font-medium">Loading your bookmarked jobs...</p>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">No saved opportunities yet</h3>
          <p className="text-xs text-slate-500 mt-1.5 mb-6 leading-relaxed">
            While exploring jobs and internships, click the heart icon on any card to save it here for later.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all hover:scale-105"
          >
            <span>Explore Openings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onSelect={(j) => setSelectedJob(j)}
              onJobSavedToggle={handleSavedToggle}
            />
          ))}
        </div>
      )}

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
        />
      )}
    </div>
  );
}
