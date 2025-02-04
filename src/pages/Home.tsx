import React from 'react';
import AnimeCard from '../components/AnimeCard';
import EpisodeCard from '../components/EpisodeCard';
import AnimeSlider from '../components/AnimeSlider';

// Mock data - replace with API calls
const featuredAnimes = [
  {
    id: '1',
    title: 'Attack on Titan Temporada Final',
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
    description: 'A conclusão épica da série Attack on Titan.',
  },
  {
    id: '2',
    title: 'Demon Slayer: Arco do Vilarejo dos Ferreiros',
    coverImage: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=800',
    description: 'Tanjiro e seus amigos chegam ao Vilarejo dos Ferreiros em busca de novas armas.',
  },
  {
    id: '3',
    title: 'Jujutsu Kaisen 2ª Temporada',
    coverImage: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800',
    description: 'A história continua com o Arco do Incidente de Shibuya.',
  },
];

const animeData = {
  id: '1',
  title: 'Attack on Titan Temporada Final',
  coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
  description: 'A conclusão épica da série Attack on Titan.',
  rating: 9.8,
  episodes: 12,
  status: 'AIRING' as const,
  genres: ['Ação', 'Drama', 'Fantasia'],
};

const recentEpisode = {
  id: '1',
  animeId: '1',
  number: 87,
  title: 'A Batalha Final',
  thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
  duration: 24,
  aired: '2024-03-10',
};

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Ad Space */}
      <div className="w-full h-24 bg-gray-800 mb-8 flex items-center justify-center">
        <div id="header-ad" className="text-gray-500">Espaço para Anúncio</div>
      </div>

      {/* Hero Section with Slider */}
      <section className="mb-12">
        <AnimeSlider slides={featuredAnimes} />
      </section>

      {/* Latest Episodes */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Últimos Episódios</h2>
          <a href="/latest" className="text-blue-400 hover:text-blue-300">Ver Todos</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <EpisodeCard key={i} episode={recentEpisode} />
          ))}
        </div>
      </section>

      {/* Currently Airing */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Em Exibição</h2>
          <a href="/airing" className="text-blue-400 hover:text-blue-300">Ver Todos</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <AnimeCard key={i} anime={animeData} />
          ))}
        </div>
      </section>

      {/* Ad Space */}
      <div className="w-full h-24 bg-gray-800 mb-8 flex items-center justify-center">
        <div id="footer-ad" className="text-gray-500">Espaço para Anúncio</div>
      </div>
    </div>
  );
}