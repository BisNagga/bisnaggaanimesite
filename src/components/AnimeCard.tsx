import React from 'react';
import { Star } from 'lucide-react';
import type { Anime } from '../types/anime';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
      <a href={`/anime/${anime.id}`}>
        <img
          src={anime.coverImage}
          alt={anime.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{anime.title}</h3>
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-300">{anime.rating.toFixed(1)}</span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-sm text-gray-300">{anime.episodes} episodes</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {anime.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs px-2 py-1 bg-blue-500 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
}