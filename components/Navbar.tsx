import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onNavigate: (view: ViewState) => void;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onSearch }) => {
  const { user, setAuthModalOpen } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
        onSearch(searchValue);
        setSearchOpen(false);
        setSearchValue("");
    }
  };

  // Modern hover effect class
  const navLinkStyle = "relative px-5 py-2 rounded-full text-sm font-medium text-gray-400 transition-all duration-300 hover:text-white hover:bg-brand-accent hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:-translate-y-1 hover:scale-105 active:scale-95 active:shadow-none";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-brand-950/90 backdrop-blur-md py-3 border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div 
            onClick={() => onNavigate(ViewState.HOME)} 
            className="text-2xl font-display font-bold tracking-tighter cursor-pointer flex items-center gap-2 text-white hover:text-brand-glow transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-all duration-300 group-hover:scale-110">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.8l6.8 13.2H5.2L12 6.8z"/></svg>
          </div>
          <span className="group-hover:tracking-widest transition-all duration-300">ANIMAGERY</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => onNavigate(ViewState.HOME)} className={navLinkStyle}>Home</button>
          <button className={navLinkStyle}>Series</button>
          <button className={navLinkStyle}>Movies</button>
          <button className={navLinkStyle}>New & Popular</button>
          {user && (
             <button onClick={() => onNavigate(ViewState.PROFILE)} className={navLinkStyle}>My List</button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="relative animate-fade-in-right">
                <input 
                    autoFocus
                    type="text" 
                    placeholder="Search titles..." 
                    className="bg-black/40 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-accent w-64 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onBlur={() => !searchValue && setSearchOpen(false)}
                />
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          )}
          
          {user ? (
            <div 
                onClick={() => onNavigate(ViewState.PROFILE)}
                className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-brand-accent transition-all flex items-center justify-center text-xs font-bold text-white shadow-lg hover:shadow-brand-accent/50 hover:scale-105 transform"
                style={{ backgroundColor: user.avatarColor }}
                title={user.username}
            >
                {user.username.substring(0, 2).toUpperCase()}
            </div>
          ) : (
            <button 
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-brand-accent hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1 hover:scale-105"
            >
                Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};