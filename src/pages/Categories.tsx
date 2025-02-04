import React from 'react';
import { Folder } from 'lucide-react';

const categories = [
  { id: '1', name: 'Ação', slug: 'acao', description: 'Animes cheios de cenas de luta e aventura' },
  { id: '2', name: 'Romance', slug: 'romance', description: 'Histórias de amor e relacionamentos' },
  { id: '3', name: 'Comédia', slug: 'comedia', description: 'Animes para dar boas risadas' },
  { id: '4', name: 'Drama', slug: 'drama', description: 'Histórias emocionantes e profundas' },
  { id: '5', name: 'Fantasia', slug: 'fantasia', description: 'Mundos mágicos e criaturas místicas' },
  { id: '6', name: 'Sci-Fi', slug: 'ficcao-cientifica', description: 'Ficção científica e tecnologia' },
  { id: '7', name: 'Slice of Life', slug: 'slice-of-life', description: 'O dia a dia da vida japonesa' },
  { id: '8', name: 'Esportes', slug: 'esportes', description: 'Competições e superação' },
];

export default function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Ad Space */}
      <div className="w-full h-24 bg-gray-800 mb-8 flex items-center justify-center">
        <div id="header-ad" className="text-gray-500">Espaço para Anúncio</div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categorias</h1>
        <p className="text-gray-400">Explore nosso catálogo de anime por categoria</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`/categories/${category.slug}`}
            className="bg-gray-800 rounded-lg p-6 transition-transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <Folder className="w-6 h-6 text-blue-400 mr-3" />
              <h2 className="text-xl font-semibold">{category.name}</h2>
            </div>
            <p className="text-gray-400">{category.description}</p>
          </a>
        ))}
      </div>

      {/* Ad Space */}
      <div className="w-full h-24 bg-gray-800 mt-8 flex items-center justify-center">
        <div id="footer-ad" className="text-gray-500">Espaço para Anúncio</div>
      </div>
    </div>
  );
}