import React from 'react';
import {
  Briefcase,
  Clock,
  Home,
  MapPin,
  Share2,
  Heart,
  Hourglass,
  Calendar,
  Building2,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { jobService } from '../../services/jobService';

export default function JobCard({ job, onSelect, onJobSavedToggle }) {
  const { isJobSaved, toggleLocalSaved } = useAuth();
  const { showToast } = useToast();
  const saved = isJobSaved(job._id);

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    try {
      toggleLocalSaved(job._id);
      const res = await jobService.toggleSaveJob(job._id);
      showToast(res.message, res.isSaved ? 'success' : 'info');
      if (onJobSavedToggle) onJobSavedToggle(job._id, res.isSaved);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`${window.location.origin}/jobs?id=${job._id}`);
    showToast('Listing link copied to clipboard!', 'info');
  };

  const postedDateFormatted = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently';

  // Compute remaining days
  const daysLeft =
    typeof job.daysLeft === 'number'
      ? job.daysLeft
      : job.deadline
      ? Math.max(0, Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
      : 7;

  // Display skills (up to 2, plus remaining count "+N")
  const visibleSkills = job.skills?.slice(0, 2) || [];
  const extraSkillsCount = (job.skills?.length || 0) - visibleSkills.length;

  return (
    <div
      onClick={() => onSelect(job)}
      className="group bg-[rgba(255,255,255,0.66)] border border-[rgba(255,255,255,0.85)] backdrop-blur-[20px] rounded-[26px] p-7 sm:p-8 shadow-[0_16px_40px_rgba(180,90,30,0.16)] hover:shadow-[0_20px_45px_rgba(180,90,30,0.22)] transition-all duration-200 cursor-pointer relative"
    >
      {/* Top Header: Title, Company, Logo */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-[#1E1B3A] group-hover:text-[#F26A21] transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-[#5B5568] mt-0.5 truncate">{job.companyName}</p>
        </div>

        {/* Company Logo Badge */}
        <div className="w-12 h-12 rounded-2xl border border-[rgba(255,255,255,0.85)] bg-white/70 overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-xs">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain rounded-lg" />
          ) : (
            <Building2 className="w-6 h-6 text-[#5B5568]/50" />
          )}
        </div>
      </div>

      {/* Metadata Row: Experience, Work Type, Work Mode */}
      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[#5B5568]">
        <div className="flex items-center gap-1.5 shrink-0">
          <Briefcase className="w-3.5 h-3.5 text-[#5B5568]/70" />
          <span>{job.experienceLevel || 'No prior experience required'}</span>
        </div>

        <span className="text-[#5B5568]/40">•</span>

        <div className="flex items-center gap-1.5 shrink-0">
          <Clock className="w-3.5 h-3.5 text-[#5B5568]/70" />
          <span>{job.employmentType || 'Full Time'}</span>
        </div>

        <span className="text-[#5B5568]/40">•</span>

        <div className="flex items-center gap-1.5 shrink-0">
          {job.workMode === 'Remote' || job.location?.includes('Home') ? (
            <Home className="w-3.5 h-3.5 text-[#5B5568]/70" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-[#5B5568]/70" />
          )}
          <span className="truncate max-w-[150px]">{job.location || job.workMode}</span>
        </div>
      </div>

      {/* Tags and Compensation Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3.5 border-t border-[rgba(30,27,58,0.1)]">
        {/* Skills Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleSkills.map((skill, index) => (
            <span
              key={index}
              className="text-[11px] font-semibold text-[#9A3412] bg-[rgba(242,106,33,0.13)] px-3 py-0.5 rounded-full"
            >
              {skill}
            </span>
          ))}
          {extraSkillsCount > 0 && (
            <span className="text-[11px] font-medium text-[#5B5568] bg-[rgba(30,27,58,0.07)] px-2.5 py-0.5 rounded-full">
              +{extraSkillsCount}
            </span>
          )}
        </div>

        {/* Green Stipend / Salary Badge matching reference */}
        {job.stipendOrSalary?.display && (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[rgba(34,197,94,0.16)] border border-[rgba(34,197,94,0.35)] text-[#166534]">
            <span>{job.stipendOrSalary.display}</span>
            <span>💸</span>
          </div>
        )}
      </div>

      {/* Footer: Date Posted, Days Left, Actions */}
      <div className="flex items-center justify-between mt-3 text-xs text-[#5B5568] pt-3 border-t border-[rgba(30,27,58,0.1)]">
        <div className="flex items-center gap-3">
          <span>Posted {postedDateFormatted}</span>
          <div className="flex items-center gap-1 text-[#9A3412] font-semibold">
            <Hourglass className="w-3.5 h-3.5 text-[#F26A21]" />
            <span>{daysLeft} days left</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="p-2 text-[#5B5568] hover:text-[#9A3412] bg-white/60 hover:bg-white rounded-full transition-colors border border-[rgba(255,255,255,0.85)] shadow-xs"
            title="Share Opportunity"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleSaveToggle}
            className={`p-2 rounded-full transition-colors border border-[rgba(255,255,255,0.85)] shadow-xs ${
              saved
                ? 'text-rose-500 bg-rose-50/80 hover:bg-rose-100'
                : 'text-[#5B5568] hover:text-rose-500 bg-white/60 hover:bg-white'
            }`}
            title={saved ? 'Unsave Job' : 'Save Job'}
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
