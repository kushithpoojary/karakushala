import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { Sparkles, Scissors, Box, Palmtree, Compass } from 'lucide-react';

export default function CategoryFilter({ selectedCategory, onSelectCategory, productCounts = {} }) {
  
  // Vibrant multi-color theme configuration per category
  const categoryThemes = {
    'All Crafts': {
      activeBg: 'bg-gradient-to-r from-terracotta-600 via-amber-600 to-indigo-700 text-white shadow-lg shadow-terracotta-600/30 ring-2 ring-terracotta-400',
      inactiveBg: 'bg-white hover:bg-cream-100 text-stone-800 border-cream-300',
      icon: <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />,
      kannada: 'ಎಲ್ಲ ಕರಕುಶಲ',
      glowColor: 'hover:border-terracotta-400'
    },
    'Kasuti Embroidery': {
      activeBg: 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400',
      inactiveBg: 'bg-white hover:bg-rose-50 text-stone-800 border-rose-200',
      icon: <Scissors className="w-4 h-4 text-rose-500" />,
      kannada: 'ಕಸೂತಿ ಕಲೆ',
      glowColor: 'hover:border-rose-400'
    },
    'Beedu Craft': {
      activeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400',
      inactiveBg: 'bg-white hover:bg-emerald-50 text-stone-800 border-emerald-200',
      icon: <Box className="w-4 h-4 text-emerald-600" />,
      kannada: 'ಬೀಡು ಹೆಣಿಗೆ',
      glowColor: 'hover:border-emerald-400'
    },
    'Coastal Wood & Shell': {
      activeBg: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 ring-2 ring-cyan-400',
      inactiveBg: 'bg-white hover:bg-cyan-50 text-stone-800 border-cyan-200',
      icon: <Palmtree className="w-4 h-4 text-cyan-600" />,
      kannada: 'ಕರಾವಳಿ ಕಲೆ',
      glowColor: 'hover:border-cyan-400'
    }
  };

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none py-2">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = productCounts[cat] !== undefined ? productCounts[cat] : null;
        const theme = categoryThemes[cat] || categoryThemes['All Crafts'];

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all touch-target shrink-0 border transform active:scale-95 ${
              isSelected
                ? `${theme.activeBg} scale-105`
                : `${theme.inactiveBg} ${theme.glowColor} shadow-xs`
            }`}
          >
            <span className={isSelected ? 'text-white' : ''}>
              {theme.icon}
            </span>
            <span>{cat}</span>
            <span className={`text-[10px] hidden sm:inline opacity-80 ${isSelected ? 'text-white/90' : 'text-stone-500'}`}>
              ({theme.kannada})
            </span>
            {count !== null && (
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-transform ${
                  isSelected 
                    ? 'bg-white text-stone-900 shadow-xs scale-110' 
                    : 'bg-cream-200 text-stone-700'
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
