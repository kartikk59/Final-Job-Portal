import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, BookOpen, FileUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { resourceService } from '../../services/resourceService';

const CATEGORIES = [
  'DSA Sheets',
  'Study Notes',
  'Interview Preparation PDFs',
  'Learning Roadmaps',
  'YouTube Playlists',
  'Previous OA Questions',
];

export default function AddResourceModal({ onClose, onResourceAdded }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState('link'); // 'link' | 'file'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'DSA Sheets',
    tags: '',
    externalUrl: '',
    resourceType: 'external_link',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        showToast('File size must be under 15MB', 'error');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('Title and description are required', 'error');
      return;
    }

    if (mode === 'link' && !formData.externalUrl.trim()) {
      showToast('Please provide an external URL', 'error');
      return;
    }

    if (mode === 'file' && !selectedFile) {
      showToast('Please select a PDF or document file to upload', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('tags', formData.tags);
      data.append('resourceType', mode === 'file' ? 'pdf' : formData.resourceType);

      if (mode === 'link') {
        data.append('externalUrl', formData.externalUrl);
      } else if (selectedFile) {
        data.append('file', selectedFile);
      }

      const res = await resourceService.createResource(data);
      showToast(res.message || 'Resource contributed successfully!', 'success');
      if (onResourceAdded) onResourceAdded(res.data);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full shadow-2xl border border-white/80 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200/50 flex items-center justify-between bg-white/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100/70 text-[#ea580c] flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Share Preparation Resource</h3>
              <p className="text-xs text-stone-500">Contribute study material to help fellow students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Mode Toggle */}
        <div className="flex border-b border-stone-200/50 p-2 bg-white/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              mode === 'link' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Web Link / Sheet</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              mode === 'file' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <FileUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload PDF / Notes</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Resource Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Operating Systems Placement Cheatsheet"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200/70 bg-white/70 text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-400/40 shadow-inner"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200/70 bg-white/70 text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-400/40 shadow-inner cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of what topics this covers..."
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200/70 bg-white/70 text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-400/40 shadow-inner"
            />
          </div>

          {mode === 'link' ? (
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Resource Link / URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-200/70 bg-white/70 text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-400/40 shadow-inner"
              />
            </div>
          ) : (
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Upload File (PDF / DOC max 15MB) <span className="text-rose-500">*</span>
              </label>
              <div className="border-2 border-dashed border-orange-200 rounded-2xl p-4 text-center hover:border-orange-400 transition-colors bg-orange-50/30">
                <input
                  type="file"
                  id="pdfUpload"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="pdfUpload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-6 h-6 text-[#ea580c] mb-1.5" />
                  <span className="font-semibold text-[#ea580c]">Click to choose a file</span>
                  <span className="text-[11px] text-stone-500 mt-0.5">
                    {selectedFile ? selectedFile.name : 'PDF, Word doc, or text file up to 15MB'}
                  </span>
                </label>
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. DBMS, SQL, Interviews, CheatSheet"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200/70 bg-white/70 text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-400/40 shadow-inner"
            />
          </div>

          <div className="pt-3 border-t border-stone-200/50 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/25 transition-all disabled:opacity-50"
            >
              {submitting ? 'Sharing...' : 'Share Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
