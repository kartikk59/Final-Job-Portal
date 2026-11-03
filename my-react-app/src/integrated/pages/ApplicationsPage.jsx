import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Home,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { jobService } from '../services/jobService';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        const res = await jobService.getMyApplications();
        setApplications(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link to="/" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="font-semibold text-slate-800">My Submissions</span>
      </div>

      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-brand-500" />
            <span>Application History ({applications.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time candidate review progress, resume verification, and recruiter updates.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
          <p className="text-xs font-medium">Loading your submissions...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">No applications yet</h3>
          <p className="text-xs text-slate-500 mt-1.5 mb-6 leading-relaxed">
            You haven't submitted any job or internship applications yet. Browse the portal and apply directly.
          </p>
          <Link
            to="/internships"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all hover:scale-105"
          >
            <span>Browse Internships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                  {app.jobId?.companyLogo ? (
                    <img src={app.jobId.companyLogo} alt="" className="w-full h-full object-contain rounded" />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {app.jobId?.title || 'Applied Position'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {app.jobId?.companyName || 'Verified Employer'} • Applied on{' '}
                    {new Date(app.appliedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                    <span>
                      Applicant: <strong className="text-slate-800">{app.fullName}</strong>
                    </span>
                    <span>•</span>
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-600 hover:underline font-semibold"
                    >
                      <span>View Submitted Resume</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center sm:self-center shrink-0">
                {getStatusBadge(app.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
