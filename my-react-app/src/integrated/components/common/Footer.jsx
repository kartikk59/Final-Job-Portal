import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/70 backdrop-blur-md border-t border-orange-100/60 mt-20 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-sm">
          <div>
            <h4 className="font-semibold text-slate-900 mb-4 tracking-tight">Job Portal</h4>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link to="/internships" className="hover:text-brand-500 transition-colors">
                  Internships for Students
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-brand-500 transition-colors">
                  Full-Time Tech Jobs
                </Link>
              </li>
              <li>
                <Link to="/saved-jobs" className="hover:text-brand-500 transition-colors">
                  Bookmarked Positions
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-brand-500 transition-colors">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 tracking-tight">For Students</h4>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link to="/resources" className="hover:text-brand-500 transition-colors">
                  Prep Zone & DSA Sheets
                </Link>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Resume Builder (Module 1)</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Activity Dashboard (Module 2)</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Interview Experiences (Module 6)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 tracking-tight">For Recruiters</h4>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link to="/recruiter/jobs/new" className="hover:text-brand-500 transition-colors">
                  Post New Opening
                </Link>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Candidate Pipeline (Module 4)</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Campus Drive Partnerships</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 tracking-tight">Resources</h4>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link to="/resources?category=DSA+Sheets" className="hover:text-brand-500 transition-colors">
                  Top 180 DSA Sheets
                </Link>
              </li>
              <li>
                <Link to="/resources?category=Study+Notes" className="hover:text-brand-500 transition-colors">
                  Core CS Study Notes
                </Link>
              </li>
              <li>
                <Link to="/resources?category=Interview+Preparation+PDFs" className="hover:text-brand-500 transition-colors">
                  System Design & Interview Guides
                </Link>
              </li>
              <li>
                <Link to="/resources?category=Previous+OA+Questions" className="hover:text-brand-500 transition-colors">
                  Company OA Archives
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CareerHub</span>
            <span>• Student Career & Placement Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <span>MERN Stack Project</span>
            <span className="text-slate-300">|</span>
            <span>Feature 3: Job Portal & Feature 5: Resource Sharing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
