import React from 'react';
import {
  ExternalLink,
  Download,
  FileText,
  ThumbsUp,
  Bookmark,
  Share2,
  Calendar,
  Sparkles,
  Youtube,
  BookOpen,
  Code2,
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import { resourceService } from '../../services/resourceService';

export default function ResourceCard({ resource, onLikeUpdated }) {
  const { showToast } = useToast();

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await resourceService.likeResource(resource._id);
      showToast('Marked as helpful!', 'success');
      if (onLikeUpdated) onLikeUpdated(resource._id, res.likesCount);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + `/resources?id=${resource._id}`);
    showToast('Resource link copied to clipboard!', 'info');
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'DSA Sheets':
        return <Code2 className="w-4 h-4 text-blue-600" />;
      case 'Study Notes':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'Interview Preparation PDFs':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'YouTube Playlists':
        return <Youtube className="w-4 h-4 text-rose-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 hover:border-white/80 rounded-3xl p-6 shadow-md hover:shadow-xl hover:bg-white/80 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header: Category and Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 border border-white/80 text-stone-700 shadow-xs">
            {getCategoryIcon(resource.category)}
            <span>{resource.category}</span>
          </div>

          {resource.badge && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-800 border border-amber-200/50 shadow-xs">
              {resource.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {resource.tags?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-medium text-stone-600 bg-white/60 border border-stone-200/50 px-2.5 py-0.5 rounded-full shadow-xs"
            >
              #{tag}
            </span>
          ))}
          {resource.tags?.length > 3 && (
            <span className="text-[10px] text-stone-500 font-semibold px-1 py-0.5">
              +{resource.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="mt-5 pt-3.5 border-t border-stone-200/40 flex items-center justify-between text-xs text-stone-500">
        <div className="truncate max-w-[140px]">
          <p className="text-[10px] text-stone-400 font-medium truncate uppercase tracking-wider">Contributed by</p>
          <p className="font-semibold text-stone-800 truncate">{resource.contributorName}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/80 bg-white/70 hover:bg-white text-stone-700 hover:text-orange-600 shadow-xs transition-colors"
            title="Mark as Helpful"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{resource.likesCount || 0}</span>
          </button>

          {/* Access / Download Button */}
          {resource.fileUrl ? (
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={resource.fileName || true}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
              title="Download PDF/Document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          ) : (
            <a
              href={resource.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-xs transition-colors"
              title="Open External Resource"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
