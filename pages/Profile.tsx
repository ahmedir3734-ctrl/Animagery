import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Anime, ViewState } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { Button } from '../components/Button';

interface ProfileProps {
  onNavigate: (view: ViewState) => void;
  onSelectAnime: (anime: Anime) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate, onSelectAnime }) => {
  const { user, logout } = useAuth();

  if (!user) {
    onNavigate(ViewState.HOME);
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 container mx-auto animate-fade-in">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b border-white/5 pb-12">
        <div 
            className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-display font-bold text-white shadow-2xl ring-4 ring-white/10"
            style={{ backgroundColor: user.avatarColor }}
        >
            {user.username.substring(0, 2).toUpperCase()}
        </div>
        
        <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-display font-bold text-white mb-2">{user.username}</h1>
            <p className="text-gray-400 mb-6">{user.email}</p>
            <div className="flex gap-4 justify-center md:justify-start">
                <div className="px-4 py-2 bg-brand-800 rounded-lg border border-white/5 text-center">
                    <span className="block text-2xl font-bold text-white">{user.myList.length}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">My List</span>
                </div>
                <div className="px-4 py-2 bg-brand-800 rounded-lg border border-white/5 text-center">
                    <span className="block text-2xl font-bold text-white">{user.history.length}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Watched</span>
                </div>
            </div>
        </div>

        <div className="flex gap-4">
             <Button variant="secondary" onClick={logout}>Sign Out</Button>
        </div>
      </div>

      {/* My List Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-display font-semibold text-white">My List</h2>
            <div className="h-px flex-1 bg-white/10"></div>
        </div>
        
        {user.myList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {user.myList.map(anime => (
                    <AnimeCard key={anime.id} anime={anime} onClick={onSelectAnime} />
                ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5 border-dashed">
                <p className="text-gray-500">Your list is empty. Go add some awesome anime!</p>
                <button onClick={() => onNavigate(ViewState.HOME)} className="mt-4 text-brand-accent hover:text-white transition-colors text-sm font-medium">Browse Anime</button>
            </div>
        )}
      </div>

      {/* History Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-display font-semibold text-white">Watch History</h2>
            <div className="h-px flex-1 bg-white/10"></div>
        </div>
        
        {user.history.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 opacity-80">
                {user.history.map((anime, idx) => (
                    <AnimeCard key={`${anime.id}-${idx}`} anime={anime} onClick={onSelectAnime} />
                ))}
            </div>
        ) : (
            <div className="text-center py-12 text-gray-500">
                No history yet. Start watching!
            </div>
        )}
      </div>
    </div>
  );
};