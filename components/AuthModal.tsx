import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export const AuthModal: React.FC = () => {
  const { login, register, setAuthModalOpen } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(email, password);
        if (!success) setError('Invalid email or password');
      } else {
        if (!username) {
            setError('Username is required');
            setLoading(false);
            return;
        }
        success = await register(email, username, password);
        if (!success) setError('Email already in use');
      }
      
      if (success) {
        setAuthModalOpen(false);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setAuthModalOpen(false)}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-brand-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header Image/Gradient */}
        <div className="h-32 bg-gradient-to-br from-brand-accent to-purple-900 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
            <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                    {isLogin ? 'Welcome Back' : 'Join Animagery'}
                </h2>
                <p className="text-white/60 text-sm">
                    {isLogin ? 'Enter the portal to continue.' : 'Begin your journey today.'}
                </p>
            </div>
            <button 
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Form */}
        <div className="p-8 bg-brand-900">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}
                
                {!isLogin && (
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
                        <input 
                            type="text" 
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
                            placeholder="OtakuKing99"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                    <input 
                        type="email" 
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                    <input 
                        type="password" 
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        className="w-full" 
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="ml-2 text-brand-accent hover:text-brand-glow font-medium transition-colors"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};