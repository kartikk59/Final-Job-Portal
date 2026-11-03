import React from 'react';
import { ExternalLink, Sparkles, Trophy, Award } from 'lucide-react';

const FEATURED_ITEMS = [
  {
    id: 1,
    title: 'Get Unstoppable on LinkedIn',
    subtitle: 'Career Competition & Networking',
    tag: 'Competition',
    logo: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
    link: '#',
    accent: 'bg-blue-50 text-blue-700',
  },
  {
    id: 2,
    title: 'TrendSetter 5.0 by DS Group',
    subtitle: 'National B-School Case Challenge',
    tag: 'Register Now!',
    logo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=60&h=60&fit=crop&q=80',
    link: '#',
    accent: 'bg-amber-50 text-amber-700',
  },
  {
    id: 3,
    title: 'Google Cloud: Learn with Communities',
    subtitle: 'Certification & Hackathon Track',
    tag: 'Free Vouchers',
    logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
    link: '#',
    accent: 'bg-red-50 text-red-700',
  },
  {
    id: 4,
    title: 'VOYAGEHACK 4.0',
    subtitle: 'Global 36-hr Student Hackathon',
    tag: 'Cash Prize ₹5L',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=60&h=60&fit=crop&q=80',
    link: '#',
    accent: 'bg-purple-50 text-purple-700',
  },
  {
    id: 5,
    title: 'HDFC Life Aspire 3.0',
    subtitle: 'Corporate Innovation League',
    tag: 'PPO Offers',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=60&h=60&fit=crop&q=80',
    link: '#',
    accent: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 6,
    title: 'Airtel Sync 2026',
    subtitle: 'Engineering Excellence Challenge',
    tag: 'Hiring Track',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=60&h=60&fit=crop&q=80',
    link: '#',
    accent: 'bg-rose-50 text-rose-700',
  },
];

export default function FeaturedSidebar() {
  return (
    <aside className="w-full">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <h3 className="font-bold text-sm text-slate-800 tracking-tight">Featured Opportunities</h3>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Sponsored</span>
        </div>

        <div className="space-y-3">
          {FEATURED_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.link}
              onClick={(e) => e.preventDefault()}
              className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center border border-slate-200/80 p-1">
                <img src={item.logo} alt="" className="w-full h-full object-contain rounded" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-slate-900 truncate group-hover:text-brand-500 transition-colors">
                    {item.title}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                <div className="mt-1.5 flex items-center">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.accent}`}>
                    {item.tag}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">Want your campus event featured here?</p>
          <a
            href="mailto:partnerships@careerhub.edu"
            className="text-[11px] font-semibold text-brand-500 hover:text-brand-600 inline-block mt-0.5"
          >
            Partner with CareerHub →
          </a>
        </div>
      </div>
    </aside>
  );
}
