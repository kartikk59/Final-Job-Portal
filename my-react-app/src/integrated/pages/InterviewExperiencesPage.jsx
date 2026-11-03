import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Code2,
  Brain,
  BarChart3,
  Zap,
  FileText,
  Sparkles,
  X,
  ExternalLink,
  SlidersHorizontal,
  Heart,
  Share2,
  Hourglass,
  Bell,
  PlusCircle,
  Loader2,
  Search,
  Star,
  ThumbsUp,
  Banknote,
  Send,
  Copy,
  Download,
  Link as LinkIcon,
  HelpCircle,
  Lightbulb,
  MessageSquareText,
} from 'lucide-react';
import { interviewExperienceService } from '../services/interviewExperienceService';
import {
  initialCuratedResources,
  initialInterviewExperiences,
} from '../services/interviewExperiencesData';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';

const ROLES = ['All Roles', 'SDE', 'AI / ML', 'Analyst'];
const DIFFICULTIES = ['Any Difficulty', 'Easy', 'Medium', 'Hard'];

/**
 * Single Interview Experience Card
 */
function ExperienceCard({ experience, expanded, onToggle, upvoted, onUpvote, onSelectResource, onShare }) {
  if (!experience) return null;

  const companyColors = {
    Google: 'bg-blue-100/90 text-blue-800 border-blue-200/60',
    Amazon: 'bg-amber-100/90 text-amber-900 border-amber-200/60',
    Microsoft: 'bg-cyan-100/90 text-cyan-900 border-cyan-200/60',
    Flipkart: 'bg-yellow-100/90 text-yellow-900 border-yellow-200/60',
    Uber: 'bg-stone-900 text-white border-stone-700',
    'Goldman Sachs': 'bg-sky-100/90 text-sky-900 border-sky-200/60',
    Adobe: 'bg-rose-100/90 text-rose-800 border-rose-200/60',
    Ola: 'bg-purple-100/90 text-purple-900 border-purple-200/60',
    'TCS Digital': 'bg-indigo-100/90 text-indigo-900 border-indigo-200/60',
    Deloitte: 'bg-emerald-100/90 text-emerald-900 border-emerald-200/60',
    Atlassian: 'bg-blue-100/90 text-blue-900 border-blue-300/60',
  };

  const rounds = experience.rounds || [];

  const oaRound = rounds.find((r) => {
    const name = (r?.name || '').toLowerCase();
    return name.includes('online assessment') || name.includes('oa') || name.includes('nqt');
  });

  const techRounds = rounds.filter((r) => {
    const name = (r?.name || '').toLowerCase();
    return !name.includes('online assessment') && !name.includes('oa') && !name.includes('nqt');
  });

  const companyName = experience.company || 'Tech Company';
  const roleName = experience.role || 'SDE';

  return (
    <article className="article-hub-card group bg-white/75 backdrop-blur-xl border border-white/70 hover:border-white/90 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl hover:bg-white/85 transition-all duration-300 relative">
      {/* Top Header: Title, Company, Logo Badge & Stipend */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-base font-extrabold text-stone-900">{companyName}</span>

            {/* Role Badge */}
            <span className="rounded-full bg-white/80 border border-white/80 px-2.5 py-0.5 text-[11px] font-bold text-stone-700 shadow-2xs flex items-center gap-1">
              {roleName === 'SDE' && <Code2 className="w-3 h-3 text-emerald-600" />}
              {roleName.includes('AI') && <Brain className="w-3 h-3 text-purple-600" />}
              {roleName === 'Analyst' && <BarChart3 className="w-3 h-3 text-blue-600" />}
              <span>{roleName}</span>
            </span>

            {/* Difficulty Rating Badge */}
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-2xs flex items-center gap-1 ${
                experience.difficulty === 'Hard'
                  ? 'bg-rose-100/80 text-rose-800 border border-rose-200/60'
                  : experience.difficulty === 'Medium'
                  ? 'bg-amber-100/80 text-amber-900 border border-amber-200/60'
                  : 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/60'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>{experience.difficulty || 'Medium'}</span>
            </span>

            {/* Stipend / CTC Capsule Pill */}
            {experience.stipend && (
              <span className="rounded-full px-3 py-0.5 text-[11px] font-extrabold bg-emerald-100/90 text-emerald-900 border border-emerald-300/70 shadow-2xs flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5 text-emerald-700" />
                <span>{experience.stipend}</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#ea580c] group-hover:text-[#c2410c] transition-colors truncate tracking-tight">
            {experience.title}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-stone-600 mt-1 truncate">
            {experience.candidateProfile || 'Candidate'} • {experience.location || 'India'}
          </p>
        </div>

        {/* Company Logo Badge */}
        <div
          className={`w-14 h-14 rounded-2xl border text-xl font-extrabold flex items-center justify-center shadow-xs shrink-0 overflow-hidden ${
            companyColors[companyName] || 'bg-white/85 text-stone-700 border-white/80'
          }`}
        >
          {companyName.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Metadata Row: Level, Rounds, Duration, Outcome */}
      <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs sm:text-sm text-stone-600 font-medium">
        <div className="flex items-center gap-1.5 shrink-0">
          <BriefcaseBusiness className="w-3.5 h-3.5 text-stone-500" />
          <span>{experience.level || 'Full-time'}</span>
        </div>

        <span className="text-stone-300">•</span>

        <div className="flex items-center gap-1.5 shrink-0">
          <Clock3 className="w-3.5 h-3.5 text-stone-500" />
          <span>{rounds.length || 3} Rounds ({experience.duration || '2 weeks'})</span>
        </div>

        <span className="text-stone-300">•</span>

        <div className="flex items-center gap-1.5 shrink-0 text-emerald-800 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{experience.outcome || 'Selected'}</span>
        </div>
      </div>

      {/* Summary Paragraph */}
      <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-stone-600">
        {experience.summary}
      </p>

      {/* Skill / Round Chips & Difficulty Pill */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-stone-200/50">
        <div className="flex flex-wrap items-center gap-1.5">
          {rounds.map((round, idx) => {
            const rName = (round?.name || '').toLowerCase();
            const isOA = rName.includes('online assessment') || rName.includes('oa') || rName.includes('nqt');
            return (
              <span
                key={`${round?.name || 'round'}-${idx}`}
                className={`text-xs font-semibold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 ${
                  isOA
                    ? 'bg-amber-100/70 text-amber-900 border border-amber-200/60'
                    : 'bg-orange-100/60 border border-orange-200/50 text-orange-950'
                }`}
              >
                {isOA ? (
                  <Zap className="w-3 h-3 text-amber-600" />
                ) : (
                  <Code2 className="w-3 h-3 text-stone-500" />
                )}
                <span>{round?.name}</span>
              </span>
            );
          })}
        </div>

        {/* Difficulty badge */}
        <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-900 bg-emerald-100/80 border border-emerald-200/60 shadow-2xs">
          <span>{experience.difficulty || 'Medium'} Difficulty</span>
        </div>
      </div>

      {/* Expandable Section: OA Questions, Tech Questions, HR Questions, Linked Prep Resources */}
      {expanded && (
        <div className="mt-5 space-y-4 border-t border-stone-200/50 pt-5">
          {/* 1. OA Questions (Online Assessment) */}
          {oaRound && (
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-950">
                  <Zap className="h-4 w-4 text-amber-600 fill-amber-500" />
                  <span>OA Questions (Online Assessment)</span>
                </h4>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                  {oaRound.duration || '90 mins'} · {oaRound.format || 'Timed Coding'}
                </span>
              </div>
              <p className="text-xs text-amber-900 mb-2.5 leading-relaxed">{oaRound.discussion}</p>
              <div className="flex flex-wrap gap-2">
                {(oaRound.questions || []).map((q, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-stone-900 font-semibold text-xs shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span>
                    <span>{q}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 2. Technical Interview Questions */}
          {techRounds.length > 0 && (
            <div>
              <h4 className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-700">
                <Code2 className="h-4 w-4 text-[#ea580c]" />
                <span>Technical Interview Questions & Discussion</span>
              </h4>
              <div className="space-y-2.5">
                {techRounds.map((round, index) => (
                  <div key={`${round?.name || 'tech'}-${index}`} className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-xs font-bold text-stone-900">
                        Round {index + 1}: {round?.name}
                      </h5>
                      <span className="text-[10px] font-semibold text-stone-500 bg-white/80 px-2 py-0.5 rounded-full border border-white">
                        {round?.duration || '60 mins'} · {round?.format || 'Live Coding'}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-stone-600">{round?.discussion}</p>
                    <ul className="mt-2 space-y-1">
                      {(round?.questions || []).map((q, qIdx) => (
                        <li key={qIdx} className="flex gap-2 text-xs leading-relaxed text-stone-800 font-medium">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ea580c]" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. HR & Behavioral Questions */}
          {(experience.hrQuestions || []).length > 0 && (
            <div className="rounded-2xl border border-orange-200/60 bg-orange-100/50 p-4 shadow-xs">
              <h4 className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-950 mb-2">
                <MessageSquareText className="h-4 w-4 text-[#ea580c]" />
                <span>HR & Behavioral Interview Questions (STAR Format)</span>
              </h4>
              <ul className="space-y-1.5">
                {experience.hrQuestions.map((q, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs leading-relaxed text-orange-950 font-semibold bg-white/70 p-2.5 rounded-xl border border-orange-200/40"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ea580c]" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Key Preparation Tips & Advice */}
          {(experience.preparationTips || []).length > 0 && (
            <div className="rounded-2xl border border-stone-200/60 bg-white/60 p-4 shadow-xs">
              <h4 className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-800 mb-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Candidate's Advice & Preparation Checklist</span>
              </h4>
              <ul className="space-y-1">
                {experience.preparationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-stone-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. Preparation Resources Linked to Each Experience */}
          {(experience.resources || []).length > 0 && (
            <div className="rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <h4 className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-950">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span>Preparation Resources Linked to this Experience</span>
                </h4>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/60 px-2.5 py-0.5 rounded-full">
                  Click pill to read notes · click ↗ to open direct link
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {experience.resources.map((res, rIdx) => {
                  const targetHref = res?.href || res?.link || 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/';
                  const label = res?.label || res?.title || 'Resource';
                  return (
                    <div
                      key={`${label}-${rIdx}`}
                      className="inline-flex items-center bg-white border border-blue-200 hover:border-blue-400 rounded-full shadow-2xs overflow-hidden transition-all hover:scale-105 group/pill"
                    >
                      {/* Main Pill: Opens in-depth study notes modal */}
                      <button
                        type="button"
                        onClick={() => onSelectResource(res)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 bg-white hover:bg-blue-50/60 transition-colors"
                        title="Click to view complete study notes, cheat sheets & reference links"
                      >
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        <span>{label}</span>
                      </button>

                      {/* Direct External Link Icon Button */}
                      <a
                        href={targetHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1.5 text-blue-600 hover:text-white hover:bg-blue-600 border-l border-blue-100 transition-colors flex items-center justify-center"
                        title={`Open reference link directly in new tab: ${targetHref}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer: Date Posted, Actions */}
      <div className="flex items-center justify-between mt-4 text-xs text-stone-500 pt-3 border-t border-stone-200/40">
        <div className="flex items-center gap-3">
          <span>Posted {experience.date || 'Oct 2026'}</span>
          <div className="flex items-center gap-1 text-[#ea580c] font-semibold">
            <Hourglass className="w-3.5 h-3.5" />
            <span>{rounds.length || 3} verified rounds</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(companyName);
            }}
            className="w-9 h-9 rounded-full bg-white/70 border border-white/80 hover:bg-white text-stone-600 hover:text-orange-600 shadow-xs flex items-center justify-center transition-all"
            title="Share Experience"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(experience._id || experience.id || experience.slug);
            }}
            className={`px-3 py-1.5 rounded-full border shadow-xs flex items-center gap-1.5 font-bold transition-all ${
              upvoted
                ? 'bg-orange-100 border-orange-300 text-[#ea580c]'
                : 'bg-white/70 border-white/80 text-stone-600 hover:text-[#ea580c] hover:bg-white'
            }`}
            title="Mark as Helpful"
          >
            {upvoted ? <Check className="w-3.5 h-3.5 text-[#ea580c]" /> : <ThumbsUp className="w-3.5 h-3.5" />}
            <span>Helpful · {experience.helpfulCount || 0}</span>
          </button>

          <button
            onClick={onToggle}
            className="px-3.5 py-1.5 rounded-full border border-white/80 bg-white/60 hover:bg-white text-stone-800 font-bold shadow-xs transition-all flex items-center gap-1"
          >
            <span>{expanded ? 'Hide Details' : 'View Questions'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
}

/**
 * Modal to Add New Preparation Resource or Share Interview Experience
 */
function AddResourceModal({ isOpen, onClose, onResourceAdded, onExperienceAdded }) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('resource'); // 'resource' | 'experience'
  const [submitting, setSubmitting] = useState(false);

  // Form State for Resource
  const [resourceForm, setResourceForm] = useState({
    title: '',
    category: 'DSA Practice Sheets',
    role: 'SDE',
    company: 'All Companies',
    description: '',
    topics: '',
    link: '',
    notes: '',
    contributor: 'Rohan (Senior Mentor)',
  });

  // Form State for Experience
  const [expForm, setExpForm] = useState({
    company: '',
    role: 'SDE',
    title: '',
    level: 'Full-time',
    stipend: '',
    difficulty: 'Medium',
    location: 'Bengaluru · Campus Drive',
    candidateProfile: 'B.Tech CSE Student · 2026 Batch',
    summary: '',
    oaQuestions: '',
    techQuestions: '',
    hrQuestions: '',
    preparationTips: '',
  });

  if (!isOpen) return null;

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    if (!resourceForm.title.trim() || !resourceForm.description.trim()) {
      showToast('Please provide a title and description for the resource.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: resourceForm.title.trim(),
        category: resourceForm.category,
        role: resourceForm.role,
        company: resourceForm.company.trim(),
        description: resourceForm.description.trim(),
        topics: resourceForm.topics
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        link: resourceForm.link.trim() || 'https://takeuforward.org',
        notes: resourceForm.notes.trim(),
        contributor: resourceForm.contributor.trim() || 'Student Mentor',
      };

      try {
        const result = await interviewExperienceService.addResource(payload);
        if (result?.data) {
          onResourceAdded(result.data);
        } else {
          onResourceAdded({ ...payload, id: `res-${Date.now().toString(36)}` });
        }
      } catch (err) {
        onResourceAdded({ ...payload, id: `res-${Date.now().toString(36)}` });
      }

      showToast('🎉 Preparation resource added successfully!', 'success');
      onClose();
    } catch (error) {
      showToast(error.message || 'Failed to add resource', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    if (!expForm.company.trim() || !expForm.title.trim() || !expForm.summary.trim()) {
      showToast('Please fill in Company, Job Title, and Overall Summary.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const oaList = expForm.oaQuestions
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean);
      const techList = expForm.techQuestions
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean);
      const hrList = expForm.hrQuestions
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean);
      const tipList = expForm.preparationTips
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        company: expForm.company.trim(),
        role: expForm.role,
        title: expForm.title.trim(),
        level: expForm.level,
        stipend: expForm.stipend.trim() || 'Undisclosed',
        difficulty: expForm.difficulty,
        location: expForm.location.trim(),
        candidateProfile: expForm.candidateProfile.trim(),
        outcome: 'Offer Received · Verified',
        summary: expForm.summary.trim(),
        rounds: [
          {
            name: 'Online Assessment',
            duration: '90 minutes',
            format: 'Coding platform · timed',
            discussion: 'Core algorithmic problem solving with strict time constraints.',
            questions: oaList.length > 0 ? oaList : ['Overlapping intervals', 'Binary search variation'],
          },
          {
            name: 'Technical Round 1',
            duration: '60 minutes',
            format: 'Live coding · pair interview',
            discussion: 'Data structures, algorithm complexity, and clean modular code.',
            questions: techList.length > 0 ? techList : ['Design an LRU cache', 'Binary tree traversal'],
          },
        ],
        hrQuestions: hrList.length > 0 ? hrList : ['Why this company?', 'Describe a time you overcame a setback.'],
        preparationTips: tipList.length > 0 ? tipList : ['Review trees, graphs, and core CS fundamentals.'],
        lessonsLearned: 'Explaining your thought process out loud is crucial to succeeding.',
        resources: [
          {
            label: 'DSA practice sheets',
            href: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
            title: 'Top 180 DSA Practice Sheets',
          },
          {
            label: 'Previous OA questions',
            href: 'https://leetcode.com/discuss/interview-question',
            title: 'Company Online Assessment (OA) Archives',
          },
        ],
      };

      try {
        const result = await interviewExperienceService.createExperience(payload);
        if (result?.data) {
          onExperienceAdded(result.data);
        } else {
          onExperienceAdded({ ...payload, _id: `exp-${Date.now().toString(36)}` });
        }
      } catch (err) {
        onExperienceAdded({ ...payload, _id: `exp-${Date.now().toString(36)}` });
      }

      showToast('🎉 Interview experience contributed successfully!', 'success');
      onClose();
    } catch (error) {
      showToast(error.message || 'Failed to share interview experience', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full shadow-2xl border border-white/80 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200/50 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#ea580c] flex items-center justify-center shadow-xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                Contribute to Mentorship & Preparation Hub
              </h3>
              <p className="text-xs text-stone-500">
                Help fellow students prepare with authentic resources and verified hiring rounds.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Add Resource vs Share Experience */}
        <div className="flex border-b border-stone-200/60 bg-stone-50/70 p-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('resource')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'resource'
                ? 'bg-[#ea580c] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Add Preparation Resource</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'experience'
                ? 'bg-[#ea580c] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Share Interview Experience</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'resource' ? (
            <form onSubmit={handleResourceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  placeholder="e.g. Striver SDE 180 Sheet 2026 / Core CS Pocket Notes"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={resourceForm.category}
                    onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  >
                    <option value="DSA Practice Sheets">DSA Practice Sheets</option>
                    <option value="Previous OA Questions">Previous OA Questions</option>
                    <option value="Core CS Study Notes">Core CS Study Notes</option>
                    <option value="Interview Prep Guides">Interview Prep Guides</option>
                    <option value="Learning Roadmaps">Learning Roadmaps</option>
                    <option value="Mock Test Resources">Mock Test Resources</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Target Role</label>
                  <select
                    value={resourceForm.role}
                    onChange={(e) => setResourceForm({ ...resourceForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  >
                    <option value="SDE">SDE (Software)</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Analyst">Analyst</option>
                    <option value="All Roles">All Roles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Target Company</label>
                  <input
                    type="text"
                    value={resourceForm.company}
                    onChange={(e) => setResourceForm({ ...resourceForm, company: e.target.value })}
                    placeholder="e.g. Google, Flipkart, All"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Description & What’s Included *
                </label>
                <textarea
                  required
                  rows={3}
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  placeholder="Explain what topics are covered and how students should use this resource..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Key Topics or Practice Problems (comma separated)
                </label>
                <input
                  type="text"
                  value={resourceForm.topics}
                  onChange={(e) => setResourceForm({ ...resourceForm, topics: e.target.value })}
                  placeholder="e.g. Sliding Window, Two Pointers, Monotonic Stack, Dynamic Programming"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Direct Reference Link / Source URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={resourceForm.link}
                    onChange={(e) => setResourceForm({ ...resourceForm, link: e.target.value })}
                    placeholder="https://takeuforward.org/... or https://www.geeksforgeeks.org/..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Name & Role
                  </label>
                  <input
                    type="text"
                    value={resourceForm.contributor}
                    onChange={(e) => setResourceForm({ ...resourceForm, contributor: e.target.value })}
                    placeholder="e.g. Alex Johnson (Alumni Mentor)"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Handwritten Notes & Preparation Advice (Markdown supported)
                </label>
                <textarea
                  rows={3}
                  value={resourceForm.notes}
                  onChange={(e) => setResourceForm({ ...resourceForm, notes: e.target.value })}
                  placeholder="Add detailed bullet points, formulas, or tips for cracking interviews..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-200/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 hover:scale-105 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Publish Resource</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleExperienceSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    placeholder="e.g. Google, Atlassian, Flipkart"
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Job Role *</label>
                  <select
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  >
                    <option value="SDE">Software Engineer (SDE)</option>
                    <option value="AI / ML">AI / ML Engineer</option>
                    <option value="Analyst">Data & Product Analyst</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={expForm.title}
                    onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                    placeholder="e.g. Software Engineer I"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Level</label>
                  <select
                    value={expForm.level}
                    onChange={(e) => setExpForm({ ...expForm, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Offered Stipend / CTC</label>
                  <input
                    type="text"
                    value={expForm.stipend}
                    onChange={(e) => setExpForm({ ...expForm, stipend: e.target.value })}
                    placeholder="e.g. ₹ 1.25 L/Mo or 44 LPA"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Difficulty Rating</label>
                  <select
                    value={expForm.difficulty}
                    onChange={(e) => setExpForm({ ...expForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Candidate Profile & CGPA</label>
                  <input
                    type="text"
                    value={expForm.candidateProfile}
                    onChange={(e) => setExpForm({ ...expForm, candidateProfile: e.target.value })}
                    placeholder="e.g. B.Tech CSE · 2026 Batch · 8.8 CGPA"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Overall Interview Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={expForm.summary}
                  onChange={(e) => setExpForm({ ...expForm, summary: e.target.value })}
                  placeholder="Summarize the overall difficulty, timeline, and vibe of the interview process..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Online Assessment (OA) Questions (one per line)
                </label>
                <textarea
                  rows={2}
                  value={expForm.oaQuestions}
                  onChange={(e) => setExpForm({ ...expForm, oaQuestions: e.target.value })}
                  placeholder="e.g. Merge overlapping intervals&#10;Minimum meeting rooms II"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Technical Interview Questions (one per line)
                </label>
                <textarea
                  rows={2}
                  value={expForm.techQuestions}
                  onChange={(e) => setExpForm({ ...expForm, techQuestions: e.target.value })}
                  placeholder="e.g. Design an LRU cache&#10;Lowest common ancestor in a binary tree"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  HR & Behavioral Questions (one per line)
                </label>
                <textarea
                  rows={2}
                  value={expForm.hrQuestions}
                  onChange={(e) => setExpForm({ ...expForm, hrQuestions: e.target.value })}
                  placeholder="e.g. Tell me about a time you had a disagreement with a team member."
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-200/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 hover:scale-105 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Share Experience</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Main Page Component
 */
export default function InterviewExperiencesPage({ defaultTab = 'all' }) {
  const { showToast } = useToast();
  const { user, isStudent, isRecruiter, isAdmin } = useAuth();
  const [experiences, setExperiences] = useState(initialInterviewExperiences || []);
  const [resourcesList, setResourcesList] = useState(initialCuratedResources || []);
  const [storageMode, setStorageMode] = useState('mongodb');

  // Filters state matching reference UI
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedCompany, setSelectedCompany] = useState('All Companies');
  const [difficulty, setDifficulty] = useState('Any Difficulty');
  const [sortByHelpful, setSortByHelpful] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab); // 'all' | 'saved' | 'resources'

  // Expanded cards set (default: first 2 expanded for instant review of questions)
  const [expandedIds, setExpandedIds] = useState(() => {
    try {
      return new Set((initialInterviewExperiences || []).slice(0, 2).map((d) => d?._id || d?.slug).filter(Boolean));
    } catch (e) {
      return new Set();
    }
  });

  const [activeResourceModal, setActiveResourceModal] = useState(null);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [modalActiveTab, setModalActiveTab] = useState('notes'); // 'notes' | 'links' | 'topics'

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [expResult, resResult] = await Promise.allSettled([
          interviewExperienceService.getExperiences(),
          interviewExperienceService.getResources(),
        ]);

        if (!active) return;

        if (expResult.status === 'fulfilled' && expResult.value?.data?.length > 0) {
          setExperiences(expResult.value.data);
          if (expResult.value?.storageMode) {
            setStorageMode(expResult.value.storageMode);
          }
        }
        if (resResult.status === 'fulfilled' && resResult.value?.data?.length > 0) {
          setResourcesList(resResult.value.data);
        }
      } catch (err) {
        console.warn('Network sync notice (using seed dataset):', err);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const companies = useMemo(
    () => ['All Companies', ...new Set((experiences || []).map((e) => e?.company).filter(Boolean))],
    [experiences]
  );

  const toggleExpand = (id) => {
    if (!id) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleShare = (companyName) => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Link to ${companyName} interview experience copied!`, 'info');
  };

  const handleUpvote = async (id) => {
    if (!id) return;
    try {
      const result = await interviewExperienceService.toggleHelpful(id);
      setExperiences((current) =>
        current.map((experience) =>
          experience?._id === id || experience?.slug === id
            ? { ...experience, helpfulCount: result.helpfulCount, hasVoted: result.hasVoted }
            : experience
        )
      );
      showToast(result.hasVoted ? 'Marked experience as helpful!' : 'Removed helpful vote', 'success');
    } catch (error) {
      // Local optimistic toggle fallback
      setExperiences((current) =>
        current.map((experience) => {
          if (experience?._id === id || experience?.slug === id) {
            const nextVoted = !experience.hasVoted;
            return {
              ...experience,
              hasVoted: nextVoted,
              helpfulCount: Math.max(0, (experience.helpfulCount || 0) + (nextVoted ? 1 : -1)),
            };
          }
          return experience;
        })
      );
      showToast('Updated helpful vote!', 'success');
    }
  };

  const handleResourceAdded = (newResource) => {
    if (!newResource) return;
    setResourcesList((prev) => [newResource, ...prev]);
  };

  const handleExperienceAdded = (newExp) => {
    if (!newExp) return;
    setExperiences((prev) => [newExp, ...prev]);
    const expId = newExp._id || newExp.slug;
    if (expId) {
      setExpandedIds((prev) => new Set([expId, ...prev]));
    }
  };

  const filteredExperiences = useMemo(() => {
    const query = (search || '').trim().toLowerCase();
    const list = (experiences || []).filter((experience) => {
      if (!experience) return false;
      const searchableText = [
        experience.company || '',
        experience.role || '',
        experience.title || '',
        experience.location || '',
        experience.candidateProfile || '',
        experience.summary || '',
        experience.stipend || '',
        ...(experience.rounds || []).flatMap((round) => [
          round?.name || '',
          round?.format || '',
          round?.discussion || '',
          ...(round?.questions || []),
        ]),
        ...(experience.hrQuestions || []),
        ...(experience.preparationTips || []),
      ]
        .join(' ')
        .toLowerCase();

      const roleMatch =
        selectedRole === 'All Roles' ||
        (experience.role || '').toLowerCase().includes(selectedRole.toLowerCase());

      const companyMatch =
        selectedCompany === 'All Companies' ||
        experience.company === selectedCompany;

      const difficultyMatch =
        difficulty === 'Any Difficulty' ||
        experience.difficulty === difficulty;

      const tabMatch = activeTab !== 'saved' || Boolean(experience.hasVoted);

      return (!query || searchableText.includes(query)) && roleMatch && companyMatch && difficultyMatch && tabMatch;
    });

    return sortByHelpful
      ? [...list].sort((a, b) => (b?.helpfulCount || 0) - (a?.helpfulCount || 0))
      : list;
  }, [activeTab, difficulty, experiences, search, selectedCompany, selectedRole, sortByHelpful]);

  const filteredResources = useMemo(() => {
    const query = (search || '').trim().toLowerCase();
    return (resourcesList || []).filter((res) => {
      if (!res) return false;
      const text = [
        res.title || '',
        res.category || '',
        res.role || '',
        res.company || '',
        res.description || '',
        res.notes || '',
        ...(res.topics || []),
      ]
        .join(' ')
        .toLowerCase();

      const roleMatch =
        selectedRole === 'All Roles' ||
        (res.role || '').toLowerCase().includes(selectedRole.toLowerCase()) ||
        res.role === 'All Roles';

      const companyMatch =
        selectedCompany === 'All Companies' ||
        (res.company || '').toLowerCase().includes(selectedCompany.toLowerCase()) ||
        res.company === 'All Companies';

      return (!query || text.includes(query)) && roleMatch && companyMatch;
    });
  }, [resourcesList, search, selectedCompany, selectedRole]);

  const activeFilterCount =
    (selectedRole !== 'All Roles' ? 1 : 0) +
    (selectedCompany !== 'All Companies' ? 1 : 0) +
    (difficulty !== 'Any Difficulty' ? 1 : 0) +
    (search ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedRole('All Roles');
    setSelectedCompany('All Companies');
    setDifficulty('Any Difficulty');
    setSearch('');
    setActiveTab('all');
  };

  // Find resource detail object from resources list or fallback dictionary
  const currentResourceDetail = useMemo(() => {
    if (!activeResourceModal) return null;

    if (typeof activeResourceModal === 'object') {
      const match = (resourcesList || []).find(
        (r) =>
          (r?.title || '').toLowerCase().includes((activeResourceModal.label || '').toLowerCase()) ||
          (r?.category || '').toLowerCase().includes((activeResourceModal.category || '').toLowerCase()) ||
          (r?.title || '').toLowerCase().includes((activeResourceModal.title || '').toLowerCase())
      );
      if (match) return match;

      return {
        title: activeResourceModal.title || activeResourceModal.label || 'Resource',
        category: activeResourceModal.category || 'Preparation Resource',
        description: activeResourceModal.description || 'Verified study materials and interview problem sets.',
        link: activeResourceModal.href || activeResourceModal.link || 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/',
        notes: activeResourceModal.notes || 'Review core concepts, edge cases, and time/space complexity before coding.',
        topics: activeResourceModal.topics || ['Algorithmic Patterns', 'Core CS Fundamentals', 'Live Interview Questions'],
        referenceLinks: [
          { title: 'Primary Reference Source', url: activeResourceModal.href || activeResourceModal.link || 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/' },
        ],
      };
    }

    const searchKey = String(activeResourceModal || '').toLowerCase();
    const fromList = (resourcesList || []).find(
      (r) =>
        (r?.title || '').toLowerCase().includes(searchKey) ||
        (r?.category || '').toLowerCase().includes(searchKey) ||
        (searchKey.includes('study note') && r?.id === 'res-cs-notes') ||
        (searchKey.includes('dsa') && r?.id === 'res-dsa-sheet') ||
        (searchKey.includes('oa') && r?.id === 'res-oa-archives') ||
        (searchKey.includes('prep') && r?.id === 'res-interview-guide') ||
        (searchKey.includes('roadmap') && r?.id === 'res-applied-ai-roadmap') ||
        (searchKey.includes('mock') && r?.id === 'res-mock-tests')
    );

    if (fromList) return fromList;

    return initialCuratedResources[0];
  }, [activeResourceModal, resourcesList]);

  const handleCopyNotes = (text) => {
    navigator.clipboard?.writeText(text || '');
    showToast('📋 Study notes copied to clipboard!', 'success');
  };

  return (
    <div className="article-hub-page max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb and Search Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <span className="text-stone-400">Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <span className="font-bold text-stone-900">Mentorship</span>
        </div>

        {/* Search Bar Pill matching reference UI */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mentorship by title, skills, or company..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-xs sm:text-sm font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:bg-white/80 shadow-inner transition-all"
          />
        </div>
      </div>

      {/* Hero Header Section - Role based & showing Database status */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100/70 border border-orange-200/50 text-[#ea580c] text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isRecruiter
                ? 'Recruiter & Hiring Benchmark Hub'
                : isAdmin
                ? 'Campus Placement Cell & Administration'
                : 'Student Mentorship & Experience Hub'}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>MongoDB Atlas Live: {storageMode === 'mongodb' ? 'careerhub (Cloud DB)' : 'Connected'}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-purple-700 text-[11px] font-bold">
            <span>Role:</span>
            <span className="uppercase">{user?.role || 'STUDENT'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {isRecruiter ? (
                <>Company Hiring <span className="text-[#f97316]">Benchmarks</span></>
              ) : isAdmin ? (
                <>Placement Records <span className="text-[#f97316]">& Audit</span></>
              ) : (
                <>Interview Experience <span className="text-[#f97316]">Hub</span></>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 font-medium">
              {isRecruiter
                ? `Logged in as ${user?.name || 'Recruiter'}. Review verified candidate questions, benchmark OA problem difficulty, and contribute hiring rounds.`
                : isAdmin
                ? `Logged in as ${user?.name || 'Placement Officer'}. Monitor candidate interview reports, verified campus placements, and study resources.`
                : `Logged in as ${user?.name || 'Alex'}. Explore authentic company-wise hiring journeys, OA & technical questions, HR rounds, difficulty ratings, and curated preparation resources.`}
            </p>
          </div>

          {/* Action Buttons: Add Resource & Set Alert */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsAddResourceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 hover:scale-105 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isRecruiter ? '+ Post Interview Standard' : '+ Add Resource'}</span>
            </button>

            <button
              onClick={() => showToast('Mentorship alert preferences updated!', 'info')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/70 bg-white/70 hover:bg-white backdrop-blur-md text-xs font-semibold text-stone-700 shadow-xs hover:shadow-sm transition-all"
            >
              <Bell className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Set Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Highlights Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="article-hub-card bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-stone-900 block leading-tight">{experiences.length}+</span>
            <span className="text-[11px] font-medium text-stone-500">Verified Companies</span>
          </div>
        </div>

        <div className="article-hub-card bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-stone-900 block leading-tight">35+</span>
            <span className="text-[11px] font-medium text-stone-500">OA Coding Questions</span>
          </div>
        </div>

        <div className="article-hub-card bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-stone-900 block leading-tight">{resourcesList.length || 8}+</span>
            <span className="text-[11px] font-medium text-stone-500">Curated Prep Sheets</span>
          </div>
        </div>

        <div className="article-hub-card bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-3.5 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Star className="w-4 h-4 fill-emerald-600" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-stone-900 block leading-tight">4.9 / 5</span>
            <span className="text-[11px] font-medium text-stone-500">Student Rating</span>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs matching reference screenshot */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-[#f97316] text-white shadow-sm'
              : 'bg-white/60 backdrop-blur-md border border-white/60 text-stone-700 hover:bg-white/80 shadow-xs'
          }`}
        >
          <span>All Experiences</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              activeTab === 'all' ? 'bg-white/30 text-white' : 'bg-stone-200/60 text-stone-700'
            }`}
          >
            {experiences.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            activeTab === 'saved'
              ? 'bg-[#f97316] text-white font-semibold shadow-sm'
              : 'bg-white/60 backdrop-blur-md border border-white/60 text-stone-700 hover:bg-white/80 shadow-xs'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Helpful Saved</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'resources'
              ? 'bg-[#f97316] text-white shadow-sm'
              : 'bg-white/60 backdrop-blur-md border border-white/60 text-stone-700 hover:bg-white/80 shadow-xs'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Preparation Resources</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              activeTab === 'resources' ? 'bg-white/30 text-white' : 'bg-stone-200/60 text-stone-700'
            }`}
          >
            {resourcesList.length || 8}
          </span>
        </button>
      </div>

      {/* Category / Role Pills matching reference screenshot */}
      <div className="mb-2 flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
        <button
          onClick={() => setSelectedRole('All Roles')}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedRole === 'All Roles'
              ? 'bg-[#f97316] text-white shadow-sm'
              : 'bg-white/60 backdrop-blur-md border border-white/60 text-stone-700 hover:bg-white/85 shadow-xs'
          }`}
        >
          All Categories
        </button>

        {[
          { name: 'SDE', label: '💻 Software Development (SDE)' },
          { name: 'AI / ML', label: '🤖 Artificial Intelligence (AI)' },
          { name: 'Analyst', label: '📊 Product & Data Analysis' },
        ].map((role) => (
          <button
            key={role.name}
            onClick={() => setSelectedRole(selectedRole === role.name ? 'All Roles' : role.name)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedRole === role.name
                ? 'bg-[#f97316] text-white font-semibold shadow-sm shadow-orange-500/25'
                : 'bg-white/60 backdrop-blur-md border border-white/60 text-stone-700 hover:bg-white/85 shadow-xs'
            }`}
          >
            <span>{role.label}</span>
          </button>
        ))}
      </div>

      {/* Filter and Sort Controls Bar matching reference screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filters Badge Button */}
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#f97316] text-white shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-orange-600 text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>

          {/* Company-wise Dropdown */}
          <div className="relative">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="appearance-none bg-white/60 backdrop-blur-md border border-white/60 text-stone-700 text-xs font-medium rounded-full pl-3.5 pr-8 py-2 hover:bg-white/85 focus:outline-none focus:ring-2 focus:ring-orange-400/40 shadow-xs cursor-pointer transition-all"
            >
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company === 'All Companies' ? 'Company' : company}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Difficulty Rating Dropdown */}
          {activeTab !== 'resources' && (
            <div className="relative">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="appearance-none bg-white/60 backdrop-blur-md border border-white/60 text-stone-700 text-xs font-medium rounded-full pl-3.5 pr-8 py-2 hover:bg-white/85 focus:outline-none focus:ring-2 focus:ring-orange-400/40 shadow-xs cursor-pointer transition-all"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d === 'Any Difficulty' ? 'Difficulty' : d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Reset Filters if active */}
          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-full bg-rose-50/80 hover:bg-rose-100/90 border border-rose-200/50 transition-colors shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Sort By Right */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <select
              value={sortByHelpful ? 'helpful' : 'newest'}
              onChange={(e) => setSortByHelpful(e.target.value === 'helpful')}
              className="appearance-none bg-white/60 backdrop-blur-md border border-white/60 text-stone-700 text-xs font-medium rounded-full pl-4 pr-8 py-2 hover:bg-white/85 focus:outline-none focus:ring-2 focus:ring-orange-400/40 shadow-xs cursor-pointer transition-all"
            >
              <option value="newest">Sort By: Newest</option>
              <option value="helpful">Sort By: Most Helpful</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Content Area: Experience Cards OR Preparation Resources Grid */}
      {activeTab === 'resources' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#ea580c]" />
              <span>Curated Preparation Resources Library ({filteredResources.length})</span>
            </h3>
            <button
              onClick={() => setIsAddResourceModalOpen(true)}
              className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Contribute Resource</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <div
                key={res?.id || res?.title}
                className="article-hub-card bg-white/75 backdrop-blur-xl border border-white/70 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] border border-orange-200/60">
                      {res?.category || 'General'}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500">{res?.role || 'All Roles'}</span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 mb-1 hover:text-[#ea580c] transition-colors">
                    {res?.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    {res?.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(res?.topics || []).slice(0, 4).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/50 flex items-center justify-between text-xs">
                  <span className="text-stone-500 text-[11px]">By {res?.contributor || 'Mentor'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveResourceModal(res)}
                      className="px-3.5 py-1.5 rounded-full border border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#ea580c] font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Read Notes</span>
                    </button>
                    {res?.link && (
                      <a
                        href={res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 transition-all"
                        title="Open External Reference Link"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Link ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Experience Cards List */
        <div className="space-y-4 mt-2">
          {filteredExperiences.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 p-12 text-center shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-orange-100/60 flex items-center justify-center mx-auto text-[#ea580c] mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900">No experiences match those filters</h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1 mb-4">
                Try loosening your filters or searching for different keywords like "Google", "Amazon", or "AI".
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredExperiences.map((exp) => (
              <ExperienceCard
                key={exp?._id || exp?.id || exp?.slug}
                experience={exp}
                expanded={expandedIds.has(exp?._id || exp?.id || exp?.slug)}
                onToggle={() => toggleExpand(exp?._id || exp?.id || exp?.slug)}
                upvoted={exp?.hasVoted}
                onUpvote={handleUpvote}
                onSelectResource={(res) => setActiveResourceModal(res)}
                onShare={handleShare}
              />
            ))
          )}
        </div>
      )}

      {/* Enhanced Linked Preparation Resource & Reference Notes Modal */}
      {activeResourceModal && currentResourceDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full shadow-2xl border border-white/80 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200/50 flex items-start justify-between bg-white/70 gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-orange-100 text-[#ea580c] flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] border border-orange-200/60">
                      {currentResourceDetail.category || 'Preparation Resource'}
                    </span>
                    {currentResourceDetail.contributor && (
                      <span className="text-[11px] font-semibold text-stone-500">
                        By {currentResourceDetail.contributor}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    {currentResourceDetail.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveResourceModal(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Bar: Direct Reference Link & Copy Notes */}
            <div className="px-6 py-3 bg-gradient-to-r from-orange-50/70 via-blue-50/50 to-amber-50/70 border-b border-stone-200/50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-semibold text-stone-700">
                <LinkIcon className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Reference URL:</span>
                <a
                  href={currentResourceDetail.link || 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline truncate max-w-xs font-bold"
                >
                  {currentResourceDetail.link || 'https://www.geeksforgeeks.org/...'}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyNotes(currentResourceDetail.notes || currentResourceDetail.description)}
                  className="px-3 py-1.5 rounded-full bg-white border border-stone-200 hover:border-orange-300 text-stone-700 hover:text-[#ea580c] font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
                  title="Copy full study notes to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Notes</span>
                </button>

                <a
                  href={currentResourceDetail.link || 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold shadow-xs flex items-center gap-1.5 transition-all hover:scale-105"
                  title="Open external documentation in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Link ↗</span>
                </a>
              </div>
            </div>

            {/* Modal Internal Navigation Tabs */}
            <div className="flex border-b border-stone-200/60 bg-white/50 px-6 gap-4 text-xs font-bold text-stone-600">
              <button
                type="button"
                onClick={() => setModalActiveTab('notes')}
                className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  modalActiveTab === 'notes'
                    ? 'border-[#ea580c] text-[#ea580c]'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Handwritten Notes & Cheatsheet</span>
              </button>

              <button
                type="button"
                onClick={() => setModalActiveTab('links')}
                className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  modalActiveTab === 'links'
                    ? 'border-[#ea580c] text-[#ea580c]'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Curated Reference Links ({currentResourceDetail.referenceLinks?.length || 1})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalActiveTab('topics')}
                className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  modalActiveTab === 'topics'
                    ? 'border-[#ea580c] text-[#ea580c]'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Topics Checklist</span>
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700">
              {modalActiveTab === 'notes' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-amber-950">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>Executive Summary</span>
                    </div>
                    <p className="text-xs leading-relaxed">{currentResourceDetail.description}</p>
                  </div>

                  {currentResourceDetail.notes ? (
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs leading-relaxed text-stone-800 whitespace-pre-line shadow-inner max-h-[35vh] overflow-y-auto">
                      {currentResourceDetail.notes}
                    </div>
                  ) : (
                    <p className="italic text-stone-500">Comprehensive study notes will be loaded from reference source.</p>
                  )}
                </div>
              )}

              {modalActiveTab === 'links' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-600 font-medium">
                    Verified external documentation, official guides, and practice platforms linked to this module:
                  </p>

                  <div className="space-y-2.5">
                    {(currentResourceDetail.referenceLinks || [
                      { title: currentResourceDetail.title, url: currentResourceDetail.link },
                    ]).map((ref, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border border-stone-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs sm:text-sm text-stone-900 truncate">{ref.title}</h5>
                          <span className="text-[11px] text-blue-600 truncate block font-mono mt-0.5">{ref.url}</span>
                        </div>

                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 font-bold text-xs shadow-2xs flex items-center gap-1.5 transition-all shrink-0"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalActiveTab === 'topics' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wide text-stone-500 mb-2">
                    Key Topics Covered in this Resource:
                  </h4>
                  <div className="space-y-2">
                    {(currentResourceDetail.topics || [
                      'Operating Systems Core Concepts',
                      'Database Management Systems',
                      'Computer Networks',
                    ]).map((topic, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-orange-50/70 border border-orange-100 text-stone-800 font-semibold text-xs"
                      >
                        <Check className="w-4 h-4 text-[#ea580c] shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="p-4 px-6 border-t border-stone-200/50 bg-white/60 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">
                Verified student resource · {currentResourceDetail.downloads || 1200}+ students studied
              </span>

              <button
                onClick={() => {
                  showToast(`Study resource ready for preparation!`, 'success');
                  setActiveResourceModal(null);
                }}
                className="px-6 py-2.5 rounded-full font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25 hover:scale-105 transition-all text-xs"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        onResourceAdded={handleResourceAdded}
        onExperienceAdded={handleExperienceAdded}
      />
    </div>
  );
}
