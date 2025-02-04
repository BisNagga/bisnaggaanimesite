import React from 'react';
import { Play } from 'lucide-react';
import type { Episode } from '../types/anime';

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group">
      <a href={`/anime/${episode.animeId}/episode/${episode.number}`}>
        <div className="relative">
          <img
            src={episode.thumbnail}
            alt={`Episode ${episode.number}`}
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="p-3">
          <h4 className="font-semibold">Episode {episode.number}</h4>
          <p className="text-sm text-gray-400 truncate">{episode.title}</p>
          <div className="mt-2 text-xs text-gray-500">
            {new Date(episode.aired).toLocaleDateString()}
          </div>
        </div>
      </a>
    </div>
  );
}