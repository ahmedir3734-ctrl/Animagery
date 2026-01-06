export interface Episode {
  id: string;
  number: number;
  season: number; // New field for organizing long series
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration?: string;
}

export interface Anime {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  coverUrl: string;
  genres: string[];
  rating: number;
  releaseYear: number;
  availableLanguages: string[]; // e.g., ['JP', 'EN', 'ES', 'FR']
  episodes: number;
  episodeList?: Episode[]; // Optional list of concrete episodes
}

export interface Category {
  title: string;
  items: Anime[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  myList: Anime[];
  history: Anime[];
  avatarColor: string; // Hex code for avatar background
}

export interface UserPreferences {
  audioLanguage: string;
  subtitleLanguage: string;
}

export enum ViewState {
  HOME = 'HOME',
  WATCH = 'WATCH',
  SEARCH = 'SEARCH',
  PROFILE = 'PROFILE',
  DETAILS = 'DETAILS',
}