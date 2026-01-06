import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ContentRail } from './components/ContentRail';
import { Watch } from './pages/Watch';
import { Profile } from './pages/Profile';
import { AnimeDetail } from './components/AnimeDetail';
import { fetchHomeContent, searchAnime } from './services/geminiService';
import { Anime, Category, ViewState, Episode } from './types';
import { useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [currentAnime, setCurrentAnime] = useState<Anime | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { isAuthModalOpen } = useAuth();

  // Initial Load
  useEffect(() => {
    const loadContent = async () => {
      const data = await fetchHomeContent();
      setCategories(data);
      setLoading(false);
    };
    loadContent();
  }, []);

  // Handler for clicking a card: Opens Detail View
  const handleAnimeSelect = (anime: Anime) => {
    setCurrentAnime(anime);
    setCurrentEpisode(undefined);
    setViewState(ViewState.DETAILS);
  };

  // Handler for "Watch Now" button: Goes directly to player
  const handleWatchNow = (anime: Anime, episode?: Episode) => {
    setCurrentAnime(anime);
    setCurrentEpisode(episode);
    setViewState(ViewState.WATCH);
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setViewState(ViewState.SEARCH);
    const results = await searchAnime(query);
    setSearchResults(results);
    setLoading(false);
  };

  const renderContent = () => {
    if (viewState === ViewState.WATCH && currentAnime) {
      return (
        <Watch 
            anime={currentAnime} 
            episode={currentEpisode}
            onBack={() => setViewState(ViewState.DETAILS)} 
        />
      );
    }

    if (viewState === ViewState.DETAILS && currentAnime) {
        return (
            <AnimeDetail 
                anime={currentAnime} 
                onWatch={handleWatchNow} 
                onClose={() => setViewState(ViewState.HOME)} 
            />
        );
    }

    if (viewState === ViewState.PROFILE) {
        return <Profile onNavigate={setViewState} onSelectAnime={handleAnimeSelect} />;
    }

    if (viewState === ViewState.SEARCH) {
        return (
            <div className="min-h-screen pt-24 px-6 container mx-auto">
                 <h2 className="text-3xl font-display font-bold text-white mb-8">Search Results</h2>
                 {loading ? (
                    <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div></div>
                 ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {searchResults.map(anime => (
                            <div key={anime.id} className="relative group" onClick={() => handleAnimeSelect(anime)}>
                                <img src={anime.thumbnailUrl} alt={anime.title} className="w-full h-80 object-cover rounded-lg group-hover:opacity-75 transition-opacity cursor-pointer" />
                                <div className="mt-2">
                                    <h3 className="text-white font-medium truncate">{anime.title}</h3>
                                    <div className="flex gap-2 text-xs text-gray-400 mt-1">
                                        <span>{anime.releaseYear}</span>
                                        <span className="text-brand-accent">{anime.availableLanguages.length} Langs</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center text-gray-500 py-20">No results found from the AI oracle.</div>
                 )}
            </div>
        );
    }

    // Home View
    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-brand-accent font-display tracking-widest animate-pulse">INITIALIZING ANIMAGERY AI...</p>
            </div>
        );
    }

    const featuredAnime = categories.length > 0 && categories[0].items.length > 0 ? categories[0].items[0] : null;

    return (
      <div className="pb-20">
        {featuredAnime && (
            <Hero 
                anime={featuredAnime} 
                onWatch={(a) => handleWatchNow(a, a.episodeList?.[0])} 
                onDetail={handleAnimeSelect} 
            />
        )}
        
        <div className="relative z-20 -mt-24 space-y-4">
          {categories.map((cat, idx) => (
            <div key={idx} className={idx === 0 ? "pl-0" : ""}>
               <ContentRail 
                 title={cat.title} 
                 items={cat.items} 
                 onSelect={handleAnimeSelect} 
               />
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/5 py-12 text-center text-gray-600 text-sm">
            <p className="mb-4">ANIMAGERY &copy; 2024</p>
            <p>Powered by Google Gemini 2.5 Flash</p>
        </footer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-950 text-white font-sans selection:bg-brand-accent selection:text-white">
      {viewState !== ViewState.WATCH && viewState !== ViewState.DETAILS && (
        <Navbar onNavigate={setViewState} onSearch={handleSearch} />
      )}
      {renderContent()}
      {isAuthModalOpen && <AuthModal />}
    </div>
  );
};

export default App;