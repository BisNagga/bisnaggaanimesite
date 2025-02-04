export interface Anime {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  rating: number;
  episodes: number;
  status: 'AIRING' | 'FINISHED' | 'NOT_YET_AIRED';
  genres: string[];
  season?: string;
  year?: number;
}

export interface Episode {
  id: string;
  animeId: string;
  number: number;
  title: string;
  thumbnail: string;
  duration: number;
  aired: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}