import React from 'react';
import { Anime } from '../types';

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
  featured?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick, featured = false }) => {
  return (
    <div 
        onClick={() => onClick(anime)}
        className={`group relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-500 ease-out transform hover:z-20 hover:scale-105 hover:shadow-2xl hover:shadow-brand-accent/20 bg-brand-800 ${featured ? 'w-80 h-[28rem]' : 'w-56 h-80'}`}
    >
      <img 
        src={anime.thumbnailUrl} 
        alt={anime.title} 
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:opacity-40"
      />
      
      {/* Overlay Content (Visible on Hover/Always if desired) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-display font-bold text-lg leading-tight mb-1">{anime.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
            <span className="text-green-400 font-semibold">{anime.rating * 10}% Match</span>
            <span>{anime.releaseYear}</span>
            <span className="border border-gray-600 px-1 rounded text-[10px]">{anime.episodes} Ep</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
            {anime.genres.slice(0, 3).map(g => (
                <span key={g} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-200">{g}</span>
            ))}
        </div>

        {/* Language Badges */}
        <div className="flex flex-wrap gap-1">
            {anime.availableLanguages.slice(0, 4).map(lang => (
                <span key={lang} className="text-[9px] uppercase font-bold tracking-wider text-brand-glow bg-brand-accent/10 px-1.5 py-0.5 rounded border border-brand-accent/20">
                    {lang.substring(0,2)}
                </span>
            ))}
            {anime.availableLanguages.length > 4 && <span className="text-[9px] text-gray-400">+More</span>}
        </div>
      </div>
    </div>
  );
};
