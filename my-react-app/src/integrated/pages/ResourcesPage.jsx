import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Home,
  ChevronRight,
  BookOpen,
  PlusCircle,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import ResourceCard from '../features/resources/ResourceCard';
import AddResourceModal from '../features/resources/AddResourceModal';
import { resourceService } from '../services/resourceService';

// Pastel Carousel Tiles matching Page 4
const PREP_TILES = [
  { id: '1', title: '100 Days to Code', icon: '</>', bg: 'bg-blue-100/50 text-blue-800 border-blue-200/50', filter: 'DSA Sheets' },
  { id: '2', title: 'DSA Sheets', icon: '📄', bg: 'bg-purple-100/50 text-purple-800 border-purple-200/50', filter: 'DSA Sheets' },
  { id: '3', title: 'Study Notes', icon: '📖', bg: 'bg-amber-100/50 text-amber-900 border-amber-200/50', filter: 'Study Notes' },
  { id: '4', title: 'Mock Test', icon: '📝', bg: 'bg-cyan-100/50 text-cyan-800 border-cyan-200/50', filter: 'Interview Preparation PDFs' },
  { id: '5', title: 'Learning Roadmaps', icon: '🎯', bg: 'bg-indigo-100/50 text-indigo-800 border-indigo-200/50', filter: 'Learning Roadmaps' },
  { id: '6', title: 'YouTube Series', icon: '📺', bg: 'bg-rose-100/50 text-rose-800 border-rose-200/50', filter: 'YouTube Playlists' },
  { id: '7', title: 'Previous OA Archive', icon: '⚡', bg: 'bg-emerald-100/50 text-emerald-800 border-emerald-200/50', filter: 'Previous OA Questions' },
];

const CATEGORY_TABS = [
  'All',
  'DSA Sheets',
  'Study Notes',
  'Interview Preparation PDFs',
  'Learning Roadmaps',
  'YouTube Playlists',
  'Previous OA Questions',
];

export default function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [resources, setResources] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sort, setSort] = useState('newest');
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          search,
          category: selectedCategory === 'All' ? '' : selectedCategory,
          sort,
        };
        const res = await resourceService.getResources(queryParams);
        setResources(res.data || []);
        setTotalCount(res.total || res.data?.length || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResources();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, selectedCategory, sort]);

  const handleLikeUpdated = (id, newLikes) => {
    setResources((prev) =>
      prev.map((r) => (r._id === id ? { ...r, likesCount: newLikes } : r))
    );
  };

  const handleResourceAdded = (newResource) => {
    setResources((prev) => [newResource, ...prev]);
    setTotalCount((c) => c + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb & Frosted Glass Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
          <Link to="/" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-stone-900">Prep Zone</span>
        </div>

        {/* Search Bar Pill */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, sheets, OA topics, or companies..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-xs sm:text-sm font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:bg-white/80 shadow-inner transition-all"
          />
        </div>
      </div>

      {/* Hero Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100/70 border border-orange-200/50 text-[#ea580c] text-xs font-semibold mb-2.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Everything you need to prepare, in one place</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Student Prep Zone & <span className="text-[#f97316]">Resources</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 font-medium">
            Handpicked interview preparation sheets, CS core notes, system design primers, and past OA questions.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-semibold shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share Resource</span>
        </button>
      </div>

      {/* Quick Access Carousel / Tiles in Frosted Glass */}
      <div className="mb-8 overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-3 min-w-max">
          {PREP_TILES.map((tile) => (
            <div
              key={tile.id}
              onClick={() => setSelectedCategory(tile.filter)}
              className="bg-white/70 backdrop-blur-xl border border-white/60 hover:border-white/80 rounded-3xl p-4 w-44 shadow-sm hover:shadow-md hover:bg-white/85 cursor-pointer transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold mb-2.5 shadow-xs ${tile.bg} group-hover:scale-110 transition-transform`}
              >
                {tile.icon}
              </div>
              <h4 className="font-bold text-xs text-stone-800 group-hover:text-orange-600 transition-colors">
                {tile.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Category Tabs & Sort Controls in Frosted Glass */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORY_TABS.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#f97316] text-white shadow-sm shadow-orange-500/20'
                    : 'bg-white/60 backdrop-blur-md border border-white/60 text-stone-700 hover:bg-white/85 shadow-xs'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <div className="shrink-0 flex items-center gap-2 self-end md:self-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none bg-white/60 backdrop-blur-md border border-white/60 text-stone-700 text-xs font-medium rounded-full px-4 py-2 hover:bg-white/85 focus:outline-none focus:ring-2 focus:ring-orange-400/40 shadow-xs cursor-pointer"
          >
            <option value="newest">Sort By: Newest</option>
            <option value="likes">Most Helpful (Likes)</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#ea580c] mb-2" />
          <p className="text-xs font-medium">Loading preparation resources...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-3xl bg-rose-50/80 backdrop-blur-md border border-rose-200 text-rose-800 text-xs flex items-center gap-3 shadow-md">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold">Failed to load resources</p>
            <p className="text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 p-12 text-center shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-orange-100/60 flex items-center justify-center mx-auto text-[#ea580c] mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900">No resources found</h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1 mb-4">
            Try a different search query or select another category from the tabs above.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <ResourceCard
              key={res._id}
              resource={res}
              onLikeUpdated={handleLikeUpdated}
            />
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      {addModalOpen && (
        <AddResourceModal
          onClose={() => setAddModalOpen(false)}
          onResourceAdded={handleResourceAdded}
        />
      )}
    </div>
  );
}
