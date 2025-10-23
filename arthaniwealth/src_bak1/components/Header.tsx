import { Menu, X, TrendingUp } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function Header({ currentPage, setCurrentPage, menuOpen, setMenuOpen }: HeaderProps) {
  const pages = ['home', 'calculators', 'retirement', 'goals', 'risk', 'assets', 'income', 'about', 'contact'];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            ArthaniWealth
          </span>
        </div>

        <nav className="hidden md:flex gap-6">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                currentPage === page ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-emerald-50'
              }`}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </nav>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col p-4 gap-2">
            {pages.map(page => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  setMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-left font-medium transition-all ${
                  currentPage === page ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
