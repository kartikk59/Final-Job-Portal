import React from 'react';

export default function CategoryPills({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      <button
        onClick={() => onSelectCategory('')}
        className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
          !selectedCategory || selectedCategory === 'All'
            ? 'bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white shadow-[0_10px_22px_rgba(217,72,15,0.3)]'
            : 'bg-[rgba(255,255,255,0.62)] border border-[rgba(255,255,255,0.85)] backdrop-blur-[14px] text-[#C2410C] hover:bg-white/80'
        }`}
      >
        All Categories
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();
        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(isSelected ? '' : cat.name)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-gradient-to-r from-[#F47B2A] to-[#D9480F] text-white shadow-[0_10px_22px_rgba(217,72,15,0.3)]'
                : 'bg-[rgba(255,255,255,0.62)] border border-[rgba(255,255,255,0.85)] backdrop-blur-[14px] text-[#C2410C] hover:bg-white/80'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
