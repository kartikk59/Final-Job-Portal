import React from 'react';
import {
  X,
  Briefcase,
  Clock,
  Home,
  MapPin,
  Heart,
  Share2,
  Calendar,
  Hourglass,
  CheckCircle2,
  Sparkles,
  Building2,
  Send,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { jobService } from '../../services/jobService';

export default function JobDetailModal({ job, onClose, onApplyClick, onJobSavedToggle }) {
  const { isJobSaved, toggleLocalSaved, isStudent } = useAuth();
  const { showToast } = useToast();

  if (!job) return null;

  const saved = isJobSaved(job._id);

  const handleSaveToggle = async () => {
    try {
      toggleLocalSaved(job._id);
      const res = await jobService.toggleSaveJob(job._id);
      showToast(res.message, res.isSaved ? 'success' : 'info');
      if (onJobSavedToggle) onJobSavedToggle(job._id, res.isSaved);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Listing URL copied to clipboard!', 'info');
  };

  const daysLeft =
    typeof job.daysLeft === 'number'
      ? job.daysLeft
      : job.deadline
      ? Math.max(0, Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
      : 7;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-2 shadow-xs">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain rounded-xl" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                  {job.category || 'Tech'}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  ID: #{job._id?.slice(-6) || 'JOB'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{job.title}</h2>
              <p className="text-sm font-medium text-slate-600">{job.companyName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Stipend / Salary</p>
              <p className="font-bold text-emerald-700 text-sm mt-0.5">
                {job.stipendOrSalary?.display || 'Undisclosed'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Experience</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{job.experienceLevel || 'Fresher'}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Work Mode</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{job.workMode || 'Remote'}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Time Left</p>
              <p className="font-bold text-amber-600 text-sm mt-0.5">{daysLeft} days remaining</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-base text-slate-900 mb-2">About the Opportunity</h4>
            <p className="leading-relaxed text-slate-600 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h4 className="font-bold text-base text-slate-900 mb-2.5">Key Responsibilities</h4>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Qualifications & Skills */}
          <div>
            <h4 className="font-bold text-base text-slate-900 mb-2.5">Required Skills & Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Qualifications list if present */}
          {job.qualifications && job.qualifications.length > 0 && (
            <div>
              <h4 className="font-bold text-base text-slate-900 mb-2.5">Candidate Qualifications</h4>
              <ul className="space-y-2">
                {job.qualifications.map((qual, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div>
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recruiter / Company Information */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs">
            <h5 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Recruiter & Company Information
            </h5>
            <p className="text-slate-600">
              Posted by {job.postedByRecruiter?.name || 'Talent Acquisition Team'} ({job.postedByRecruiter?.email || 'careers@company.com'}). Verified employer on CareerHub.
            </p>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-5 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                saved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{saved ? 'Saved' : 'Save Job'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onApplyClick(job);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              <span>Apply for Position</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
