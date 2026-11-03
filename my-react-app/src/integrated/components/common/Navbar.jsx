import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Bookmark,
  FileCheck2,
  Bell,
  BookOpen,
  PlusCircle,
  ChevronDown,
  User,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, switchRole, isRecruiter } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navItemClass = ({ isActive }) =>
    `px-4 py-1.5 text-sm font-semibold transition-all rounded-full ${
      isActive
        ? 'bg-[rgba(242,106,33,0.15)] text-[#9A3412]'
        : 'text-[#1E1B3A] hover:text-[#9A3412] hover:bg-white/40'
    }`;

  const placeholderClass =
    'px-4 py-1.5 text-sm font-semibold text-[#5B5568]/60 hover:text-[#5B5568] cursor-default select-none transition-colors';

  return (
    <header className="sticky top-0 z-40 bg-[rgba(255,255,255,0.62)] backdrop-blur-[18px] border-b border-[rgba(255,255,255,0.85)] shadow-[0_10px_28px_rgba(180,90,30,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F47B2A] to-[#D9480F] flex items-center justify-center text-white shadow-sm shadow-[#F47B2A]/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1E1B3A]">
                Career<span className="text-[#F26A21]">Hub</span>
              </span>
            </Link>

            {/* Navigation Links in exact order */}
            <nav className="hidden md:flex items-center gap-1">
              <span className={placeholderClass} title="Home (In development by teammate)">
                Home
              </span>
              <NavLink to="/jobs" className={navItemClass}>
                Jobs
              </NavLink>
              <NavLink to="/internships" className={navItemClass}>
                Internships
              </NavLink>
              <span className={placeholderClass} title="Mentorship (Coming soon)">
                Mentorship
              </span>
              <NavLink to="/prepzone" className={navItemClass}>
                Prepzone
              </NavLink>
              <span className={placeholderClass} title="My Activity (Coming soon)">
                My Activity
              </span>
            </nav>
          </div>

          {/* Right Section / Controls */}
          <div className="flex items-center gap-3">
            {/* Recruiter Action / "For Business" Button matching reference screenshot */}
            {isRecruiter ? (
              <Link
                to="/recruiter/jobs/new"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white shadow-[0_10px_22px_rgba(217,72,15,0.3)] hover:opacity-95 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Post New Job
              </Link>
            ) : (
              <button
                onClick={() => {
                  switchRole('recruiter');
                  navigate('/recruiter/jobs/new');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[rgba(255,255,255,0.7)] border border-[rgba(242,106,33,0.45)] text-[#9A3412] hover:bg-white transition-colors"
                title="Switch to Recruiter role to post openings"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#F26A21]" />
                For Business
              </button>
            )}

            {/* Notification Bell */}
            <button className="p-2 text-[#5B5568] hover:text-[#1E1B3A] rounded-full hover:bg-white/60 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F26A21] rounded-full"></span>
            </button>

            {/* Role Switcher Pill & Profile */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.85)] bg-[rgba(255,255,255,0.62)] backdrop-blur-[14px] hover:bg-white/80 transition-all text-left shadow-xs"
              >
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-7 h-7 rounded-full object-cover border border-white/80"
                />
                <div className="hidden sm:block text-xs">
                  <div className="font-semibold text-[#1E1B3A] leading-tight flex items-center gap-1">
                    {user?.name.split(' ')[0]}
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-full ${
                        user?.role === 'recruiter'
                          ? 'bg-purple-100 text-purple-700'
                          : user?.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {user?.role}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#5B5568]" />
              </button>

              {/* Role Switcher Dropdown */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Profile</p>
                    <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>

                  <div className="px-3 py-2">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                      Switch Role (Team Dev Mode)
                    </p>
                    <button
                      onClick={() => {
                        switchRole('student');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors ${
                        user?.role === 'student'
                          ? 'bg-emerald-50 text-emerald-800 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <div className="text-left">
                        <div>Student View (Alex)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Browse, apply, save jobs</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        switchRole('recruiter');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl mt-1 transition-colors ${
                        user?.role === 'recruiter'
                          ? 'bg-purple-50 text-purple-800 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      <div className="text-left">
                        <div>Recruiter View (Rohan)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Post & manage listings</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        switchRole('admin');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl mt-1 transition-colors ${
                        user?.role === 'admin'
                          ? 'bg-amber-50 text-amber-800 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <div className="text-left">
                        <div>Admin View (Prof. Sharma)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Manage all resources & jobs</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
