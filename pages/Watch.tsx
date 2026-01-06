import React, { useState, useEffect, useRef } from 'react';
import { Anime, Episode } from '../types';
import { useAuth } from '../context/AuthContext';

interface WatchProps {
  anime: Anime;
  episode?: Episode;
  onBack: () => void;
}

export const Watch: React.FC<WatchProps> = ({ anime, episode, onBack }) => {
  const { addToHistory } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); 
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [audioLang, setAudioLang] = useState('Japanese (Original)');
  const [speed, setSpeed] = useState(1);
  const [isBuffering, setIsBuffering] = useState(true);

  // Initialize
  useEffect(() => {
    addToHistory(anime);
    if (videoRef.current) {
        // Auto-play attempt
        videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
    }
  }, [anime.id, episode]);

  // Controls Visibility Timer
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleActivity = () => {
      setShowControls(true);
      document.body.style.cursor = 'default';
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (playing && !showSettings) {
            setShowControls(false);
            document.body.style.cursor = 'none';
        }
      }, 3000);
    };
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    
    return () => {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        clearTimeout(timeout);
        document.body.style.cursor = 'default';
    };
  }, [playing, showSettings]);

  // Video Event Listeners
  const handleTimeUpdate = () => {
    if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        // Intro skip logic (Example: between 1m and 2m30s)
        if (videoRef.current.currentTime > 60 && videoRef.current.currentTime < 150) {
            setShowSkipIntro(true);
        } else {
            setShowSkipIntro(false);
        }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
        setDuration(videoRef.current.duration);
        setIsBuffering(false);
        setPlaying(!videoRef.current.paused);
    }
  };

  const handleVideoPlay = () => setPlaying(true);
  const handleVideoPause = () => setPlaying(false);
  const handleWaiting = () => setIsBuffering(true);
  const handlePlaying = () => setIsBuffering(false);

  const togglePlay = () => {
    if (videoRef.current) {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        switch(e.key.toLowerCase()) {
            case ' ':
            case 'k':
                e.preventDefault();
                togglePlay();
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'm':
                if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                    setVolume(videoRef.current.muted ? 0 : 1);
                }
                break;
            case 'arrowright':
                if (videoRef.current) videoRef.current.currentTime += 10;
                break;
            case 'arrowleft':
                if (videoRef.current) videoRef.current.currentTime -= 10;
                break;
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
        videoRef.current.currentTime = percent * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = parseFloat(e.target.value);
      setVolume(vol);
      if (videoRef.current) videoRef.current.volume = vol;
  };

  const handleSpeedChange = (s: number) => {
      setSpeed(s);
      if (videoRef.current) videoRef.current.playbackRate = s;
  };

  const handleSkipIntro = () => {
      if (videoRef.current) {
          videoRef.current.currentTime = 150; // Skip to 2:30
      }
  };

  const currentEpTitle = episode ? `${episode.number}. ${episode.title}` : "Episode 1";
  const videoSrc = episode?.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans select-none group">
      
      {/* Video Layer */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
         <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onWaiting={handleWaiting}
            onPlaying={handlePlaying}
            onClick={togglePlay}
         />
         
         {/* Buffering Spinner */}
         {isBuffering && (
             <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                 <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
             </div>
         )}
      </div>

      {/* Skip Intro Button */}
      {showSkipIntro && (
        <button 
            onClick={handleSkipIntro}
            className="absolute bottom-32 right-12 z-30 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-6 py-2 rounded font-bold uppercase tracking-wider text-sm transition-all animate-fade-in-up flex items-center gap-2"
        >
            Skip Intro
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      )}

      {/* Center Play/Pause Animation (Overlay when paused) */}
      {!playing && !isBuffering && (
          <div 
            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer bg-black/40"
            onClick={togglePlay}
          >
              <div className="w-24 h-24 bg-brand-accent/80 hover:bg-brand-accent rounded-full flex items-center justify-center backdrop-blur-sm transition-all transform hover:scale-110 shadow-[0_0_50px_rgba(99,102,241,0.5)]">
                  <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
          </div>
      )}

      {/* Top Gradient & Back Button */}
      <div className={`absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/90 via-black/60 to-transparent transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <button onClick={onBack} className="text-white/80 hover:text-white flex items-center gap-4 transition-colors group/back">
              <div className="p-3 rounded-full bg-white/10 group-hover/back:bg-brand-accent transition-colors backdrop-blur">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
              <div className="flex flex-col items-start drop-shadow-md">
                  <h1 className="text-xl font-bold leading-none mb-1">{anime.title}</h1>
                  <span className="text-sm text-gray-300 font-mono flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                     {currentEpTitle}
                  </span>
              </div>
          </button>
      </div>

      {/* Bottom Controls Container */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-32 pb-8 px-8 transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
         
         {/* Progress Bar */}
         <div 
            className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer group/progress mb-6 transition-all hover:h-2"
            onClick={handleSeek}
         >
             {/* Buffered Bar (Simulated as full for this demo) */}
             <div className="absolute top-0 left-0 h-full bg-white/30 rounded-full w-full"></div>
             {/* Current Progress */}
             <div className="absolute top-0 left-0 h-full bg-brand-accent rounded-full relative" style={{ width: `${(currentTime / duration) * 100}%` }}>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 scale-0 group-hover/progress:scale-100 transition-all"></div>
             </div>
         </div>

         <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-6">
                <button onClick={togglePlay} className="text-white hover:text-brand-accent transition-colors">
                    {playing ? (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>

                <div className="flex items-center gap-2 group/volume relative">
                    <button onClick={() => setVolume(v => v === 0 ? 1 : 0)} className="text-white hover:text-brand-accent">
                        {volume === 0 ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                        )}
                    </button>
                    <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                        <input 
                            type="range" min="0" max="1" step="0.1" 
                            value={volume} onChange={handleVolumeChange}
                            className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-accent ml-2"
                        />
                    </div>
                </div>

                <div className="text-sm font-mono text-gray-300 select-none">
                    {formatTime(currentTime)} <span className="text-gray-600 mx-1">/</span> {formatTime(duration || 0)}
                </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-6">
                
                {/* Settings Menu */}
                <div className="relative">
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`text-white transition-transform duration-300 ${showSettings ? 'rotate-90 text-brand-accent' : 'hover:text-brand-accent'}`}
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    
                    {/* Settings Popup */}
                    {showSettings && (
                        <div className="absolute bottom-14 right-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-5 w-72 shadow-2xl animate-fade-in-up">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Playback Settings</h3>
                            
                            <div className="space-y-5">
                                {/* Audio Language */}
                                <div>
                                    <div className="text-sm text-gray-300 mb-2 font-medium">Audio Language</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Japanese (Original)', 'English (Dub)', 'Hindi (Dub)', 'Chinese (Mandarin)'].map(lang => (
                                            <button 
                                                key={lang} 
                                                onClick={() => setAudioLang(lang)}
                                                className={`px-3 py-2 text-xs text-left rounded transition-colors ${audioLang === lang ? 'bg-brand-accent text-white font-bold' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-300 mb-2 font-medium">Quality</div>
                                    <div className="flex gap-2">
                                        {['1080p', '720p', '480p'].map(q => (
                                            <button 
                                                key={q} 
                                                onClick={() => setQuality(q)}
                                                className={`px-3 py-1 text-xs rounded border transition-colors ${quality === q ? 'bg-brand-accent border-brand-accent text-white' : 'border-white/20 text-gray-400 hover:border-white/50'}`}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="text-sm text-gray-300 mb-2 font-medium">Speed</div>
                                    <div className="flex gap-2">
                                        {[0.5, 1, 1.5, 2].map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => handleSpeedChange(s)}
                                                className={`px-3 py-1 text-xs rounded border transition-colors ${speed === s ? 'bg-brand-accent border-brand-accent text-white' : 'border-white/20 text-gray-400 hover:border-white/50'}`}
                                            >
                                                {s}x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={toggleFullscreen} className="text-white hover:text-brand-accent transition-colors">
                    {isFullscreen ? (
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    ) : (
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                    )}
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};