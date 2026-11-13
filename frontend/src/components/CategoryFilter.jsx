import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { Sparkles, Scissors, Box, Palmtree } from 'lucide-react';

export default function CategoryFilter({ selectedCategory, onSelectCategory, productCounts = {} }) {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Kasuti Embroidery':
        return <Scissors className="w-4 h-4 text-terracotta-500" />;
      case 'Beedu Craft':
        return <Box className="w-4 h-4 text-amber-600" />;
      case 'Coastal Wood & Shell':
        return <Palmtree className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-2">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = productCounts[cat] !== undefined ? productCounts[cat] : null;

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all touch-target shrink-0 shadow-sm ${
              isSelected
                ? 'bg-terracotta-600 text-white shadow-terracotta-600/30 shadow-md ring-2 ring-terracotta-600 ring-offset-2'
                : 'bg-white hover:bg-cream-200 text-stone-700 border border-cream-300'
            }`}
          >
            <span className={isSelected ? 'text-white' : ''}>
              {getCategoryIcon(cat)}
            </span>
            <span>{cat}</span>
            {count !== null && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-cream-200 text-stone-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
