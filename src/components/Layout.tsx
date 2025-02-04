import React from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Logo Space */}
              <div className="w-8 h-8 bg-gray-700 rounded-full">
                {liquipedia.net/commons/images/3/35/Tecnosh_at_SLi_Invitational_1.png}
              </div>
              <a href="/" className="flex items-center">
                <span className="text-xl font-bold">Limonations Animes</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <a href="/" className="hover:text-blue-400">Início</a>
                <a href="/airing" className="hover:text-blue-400">Em Exibição</a>
                <a href="/categories" className="hover:text-blue-400">Categorias</a>
                <a href="/latest" className="hover:text-blue-400">Últimos Episódios</a>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar anime..."
                    className="bg-gray-700 px-4 py-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-1.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 hover:bg-gray-700 rounded-md">Início</a>
              <a href="/airing" className="block px-3 py-2 hover:bg-gray-700 rounded-md">Em Exibição</a>
              <a href="/categories" className="block px-3 py-2 hover:bg-gray-700 rounded-md">Categorias</a>
              <a href="/latest" className="block px-3 py-2 hover:bg-gray-700 rounded-md">Últimos Episódios</a>
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Buscar anime..."
                  className="w-full bg-gray-700 px-4 py-1 rounded-full text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Limonations Animes</h3>
              <p className="text-gray-400">Seu destino principal para streaming de anime.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white">Sobre Nós</a></li>
                <li><a href="/contact" className="hover:text-white">Contato</a></li>
                <li><a href="/dmca" className="hover:text-white">DMCA</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/terms" className="hover:text-white">Termos de Serviço</a></li>
                <li><a href="/privacy" className="hover:text-white">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Limonations Animes. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
