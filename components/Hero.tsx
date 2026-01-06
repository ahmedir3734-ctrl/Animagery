import React from 'react';
import { Anime } from '../types';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';

interface HeroProps {
  anime: Anime;
  onWatch: (anime: Anime) => void;
  onDetail: (anime: Anime) => void;
}

export const Hero: React.FC<HeroProps> = ({ anime, onWatch, onDetail }) => {
  const { user, addToMyList, removeFromMyList } = useAuth();
  
  const inList = user?.myList.some(a => a.id === anime.id);

  const toggleList = () => {
    if (inList) {
        removeFromMyList(anime.id);
    } else {
        addToMyList(anime);
    }
  };

  return (
    <div className="relative w-full h-[85vh]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
            src={anime.coverUrl} 
            alt={anime.title} 
            className="w-full h-full object-cover"
        />
        {/* Gradients to blend into dark theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center max-w-7xl">
        <div className="max-w-2xl space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3">
                 <span className="px-2 py-1 bg-brand-accent/20 border border-brand-accent/40 text-brand-glow text-xs font-bold uppercase tracking-wider rounded">
                    #1 in Global Trending
                 </span>
                 <span className="text-gray-400 text-sm font-medium tracking-wide">
                    {anime.genres.join(" • ")}
                 </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-white drop-shadow-2xl">
                {anime.title}
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed drop-shadow-md line-clamp-3">
                {anime.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button onClick={() => onWatch(anime)} variant="primary" icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}>
                    Watch Now
                </Button>
                
                <Button onClick={() => onDetail(anime)} variant="glass" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                    More Info
                </Button>

                <Button onClick={toggleList} variant="glass" icon={
                    inList ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    )
                }>
                    {inList ? 'In List' : 'Add to List'}
                </Button>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium tracking-widest uppercase mt-8">
                <span>Audio: {anime.availableLanguages.join(" / ")}</span>
            </div>
        </div>
      </div>
    </div>
  );
};