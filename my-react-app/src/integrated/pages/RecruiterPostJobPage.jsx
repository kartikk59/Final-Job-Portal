import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Building2, Briefcase, Calendar, Check, Home, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { jobService } from '../services/jobService';

export default function RecruiterPostJobPage() {
  const { user, isRecruiter, switchRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    companyName: user?.company || '',
    companyLogo: '',
    category: 'Software Development',
    role: '',
    location: 'Work from Home',
    workMode: 'Remote',
    employmentType: 'Internship',
    experienceLevel: 'No prior experience required',
    stipendMin: '',
    stipendMax: '',
    stipendDisplay: '',
    skills: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    deadlineDays: 14,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.companyName.trim() || !formData.description.trim()) {
      showToast('Title, company name, and description are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Split skills, responsibilities, qualifications into arrays
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const respArray = formData.responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const qualArray = formData.qualifications
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean);

      const deadlineDate = new Date(Date.now() + Number(formData.deadlineDays) * 24 * 60 * 60 * 1000);

      const payload = {
        title: formData.title,
        companyName: formData.companyName,
        companyLogo: formData.companyLogo || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&h=100&fit=crop&q=80',
        category: formData.category,
        role: formData.role || formData.title,
        location: formData.location,
        workMode: formData.workMode,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
        stipendOrSalary: {
          min: Number(formData.stipendMin) || 0,
          max: Number(formData.stipendMax) || 0,
          currency: '₹',
          period: formData.employmentType === 'Internship' ? 'Month' : 'LPA',
          display: formData.stipendDisplay || (formData.stipendMin ? `₹ ${formData.stipendMin} / Mo` : 'Competitive'),
        },
        skills: skillsArray.length > 0 ? skillsArray : ['Communication', 'Problem Solving'],
        description: formData.description,
        responsibilities: respArray,
        qualifications: qualArray,
        deadline: deadlineDate,
      };

      const res = await jobService.createJob(payload);
      showToast(res.message || 'Job opening posted successfully!', 'success');
      navigate(formData.employmentType === 'Internship' ? '/internships' : '/jobs');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link to="/" className="flex items-center gap-1 hover:text-slate-800 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="font-semibold text-slate-800">Recruiter Portal</span>
      </div>

      {/* Recruiter Role Alert if in student mode */}
      {!isRecruiter && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              You are currently viewing as <strong>{user?.name} ({user?.role})</strong>. Switch to recruiter mode to test role authorization.
            </span>
          </div>
          <button
            onClick={() => switchRole('recruiter')}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors"
          >
            Switch to Recruiter
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-sm shadow-brand-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Post a Job or Internship</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Create verified campus hiring opportunities for college candidates.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
          {/* Section: Basic Info */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3 pb-1 border-b border-slate-100">
              Role & Company Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Position Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. AI Engineer Internship"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Trawel.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Mode</label>
                <select
                  value={formData.workMode}
                  onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location Details</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Work from Home or Delhi / NCR"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section: Category & Compensation */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3 pb-1 border-b border-slate-100">
              Compensation & Category
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="Software Development">Software Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Analysis">Data Analysis</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Content Writing">Content Writing</option>
                  <option value="Accounting">Accounting</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge Text (Displayed on Card)</label>
                <input
                  type="text"
                  value={formData.stipendDisplay}
                  onChange={(e) => setFormData({ ...formData, stipendDisplay: e.target.value })}
                  placeholder="e.g. ₹ 5 K - 12 K/Month"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
                <select
                  value={formData.deadlineDays}
                  onChange={(e) => setFormData({ ...formData, deadlineDays: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="5">5 Days Left</option>
                  <option value="7">7 Days Left</option>
                  <option value="14">14 Days Left</option>
                  <option value="30">30 Days Left</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-semibold text-slate-700 mb-1">
                Required Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g. React.js, Node.js, Python, Tailwind CSS"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Section: Description & Requirements */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3 pb-1 border-b border-slate-100">
              Role Description & Expectations
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the day-to-day mission, team culture, and objectives..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Key Responsibilities (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="Build responsive user interfaces&#10;Write unit tests&#10;Collaborate with design team"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Qualifications (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  placeholder="Enrolled in B.Tech / BCA / MCA&#10;Strong communication skills&#10;Problem-solving mindset"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/jobs"
              className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Publishing Opening...' : 'Publish Opening'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
