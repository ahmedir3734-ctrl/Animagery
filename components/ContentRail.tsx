import React, { useRef } from 'react';
import { Anime } from '../types';
import { AnimeCard } from './AnimeCard';

interface ContentRailProps {
  title: string;
  items: Anime[];
  onSelect: (anime: Anime) => void;
}

export const ContentRail: React.FC<ContentRailProps> = ({ title, items, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = direction === 'left' ? -600 : 600;
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-8 space-y-4 group">
      <div className="container mx-auto px-6 flex items-end justify-between">
        <h2 className="text-2xl font-display font-semibold text-white tracking-tight">{title}</h2>
        <div className="hidden group-hover:flex gap-2">
            <button onClick={() => scroll('left')} className="p-2 rounded-full glass-panel hover:bg-brand-accent/20 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll('right')} className="p-2 rounded-full glass-panel hover:bg-brand-accent/20 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-6 pb-8 scrollbar-hide snap-x"
        style={{ scrollPaddingLeft: '1.5rem', scrollPaddingRight: '1.5rem' }}
      >
        {items.map((anime) => (
            <div key={anime.id} className="snap-start">
                <AnimeCard anime={anime} onClick={onSelect} />
            </div>
        ))}
      </div>
    </div>
  );
};
