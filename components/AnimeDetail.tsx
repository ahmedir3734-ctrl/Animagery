import React, { useState, useMemo } from 'react';
import { Anime, Episode } from '../types';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';

interface AnimeDetailProps {
  anime: Anime;
  onWatch: (anime: Anime, episode?: Episode) => void;
  onClose: () => void;
}

export const AnimeDetail: React.FC<AnimeDetailProps> = ({ anime, onWatch, onClose }) => {
  const { user, addToMyList, removeFromMyList } = useAuth();
  const [activeTab, setActiveTab] = useState<'episodes' | 'related'>('episodes');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  
  const inList = user?.myList.some(a => a.id === anime.id);

  const toggleList = () => {
    if (inList) {
        removeFromMyList(anime.id);
    } else {
        addToMyList(anime);
    }
  };

  // Use real episode list if available, otherwise generate mocks
  const allEpisodes: Episode[] = anime.episodeList || Array.from({ length: anime.episodes }, (_, i) => ({
    id: `mock-${i}`,
    number: i + 1,
    season: 1,
    title: `Episode ${i + 1}`,
    description: i === 0 ? "The journey begins as our heroes meet for the first time." : "Tensions rise as the group faces a new, unexpected threat.",
    duration: "24m",
    thumbnailUrl: `https://picsum.photos/seed/${anime.id}-${i}/300/200`
  }));

  // Grouping logic
  const seasons = useMemo(() => {
    const s = new Set(allEpisodes.map(e => e.season));
    return Array.from(s).sort((a, b) => a - b);
  }, [allEpisodes]);

  const filteredEpisodes = useMemo(() => {
    return allEpisodes.filter(e => e.season === selectedSeason);
  }, [allEpisodes, selectedSeason]);

  const handleWatchEpisode = (ep: Episode) => {
    onWatch(anime, ep);
  };

  return (
    <div className="min-h-screen bg-brand-950 animate-fade-in relative z-50">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
            <img src={anime.coverUrl} alt={anime.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-6 h-full flex items-end pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-end w-full">
                {/* Poster Card (Hidden on mobile, visible on desktop) */}
                <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-2xl border-2 border-white/10 shrink-0 transform translate-y-24">
                    <img src={anime.thumbnailUrl} alt={anime.title} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-6 mb-8 md:mb-0">
                    <div className="flex items-center gap-3 text-sm font-medium text-brand-glow">
                        <span className="bg-brand-accent/20 px-2 py-1 rounded border border-brand-accent/30">{anime.releaseYear}</span>
                        <span className="bg-white/10 px-2 py-1 rounded">{anime.episodes} Episodes</span>
                        <span className="text-green-400 border border-green-500/30 px-2 py-1 rounded">{anime.rating} Rating</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
                        {anime.title}
                    </h1>

                    <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                        {anime.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {anime.genres.map(g => (
                            <span key={g} className="text-xs text-gray-400 border border-white/10 px-3 py-1 rounded-full">{g}</span>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Button onClick={() => handleWatchEpisode(allEpisodes[0])} variant="primary" className="px-8 py-4 text-lg" icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}>
                            Watch S1 E1
                        </Button>
                        <Button onClick={toggleList} variant="glass" className="px-6 py-4" icon={
                            inList ? <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> 
                                   : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                        }>
                            {inList ? 'In Your List' : 'Add to List'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Content Tabs & Lists */}
      <div className="container mx-auto px-6 py-12 md:pl-80 relative z-20"> 
         <div className="flex gap-8 border-b border-white/10 mb-8 sticky top-20 bg-brand-950/95 backdrop-blur z-30 pt-4">
            <button 
                onClick={() => setActiveTab('episodes')}
                className={`pb-4 text-lg font-medium transition-colors relative ${activeTab === 'episodes' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                Episodes
                {activeTab === 'episodes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('related')}
                className={`pb-4 text-lg font-medium transition-colors relative ${activeTab === 'related' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                More Like This
                {activeTab === 'related' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
            </button>
         </div>

         {activeTab === 'episodes' && (
             <div className="space-y-6">
                 {/* Season Selector */}
                 {seasons.length > 1 && (
                     <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                         {seasons.map(season => (
                             <button
                                key={season}
                                onClick={() => setSelectedSeason(season)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                                    selectedSeason === season 
                                    ? 'bg-white text-black shadow-lg scale-105' 
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                             >
                                Season {season}
                             </button>
                         ))}
                     </div>
                 )}

                 <div className="space-y-4">
                     {filteredEpisodes.map((ep) => (
                         <div 
                            key={ep.id} 
                            className="group flex items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 cursor-pointer"
                            onClick={() => handleWatchEpisode(ep)}
                        >
                             <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-brand-800 shrink-0">
                                 <img src={ep.thumbnailUrl} alt={ep.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                 <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                     </div>
                                 </div>
                                 {ep.duration && <div className="absolute bottom-1 right-2 text-[10px] font-bold bg-black/80 px-1 rounded text-gray-300">{ep.duration}</div>}
                             </div>
                             <div className="flex-1">
                                 <h3 className="text-white font-medium text-lg mb-1 flex items-center gap-2">
                                    <span className="text-gray-500 text-base">{ep.number}.</span> {ep.title}
                                 </h3>
                                 <p className="text-gray-400 text-sm line-clamp-2">{ep.description}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
         )}
         
         {activeTab === 'related' && (
             <div className="py-12 text-center text-gray-500 border border-white/5 border-dashed rounded-xl">
                 AI curation for related content coming soon.
             </div>
         )}
      </div>
    </div>
  );
};