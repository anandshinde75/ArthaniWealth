import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

import HomePage from './pages/HomePage';
import CalculatorsPage from './pages/CalculatorsPage';
import RetirementPage from './pages/RetirementPage';
import GoalsPage from './pages/GoalsPage';
import RiskProfilePage from './pages/RiskProfilePage';
import AssetsPage from './pages/AssetsPage';
import IncomePage from './pages/IncomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage setCurrentPage={setCurrentPage} />;
      case 'calculators': return <CalculatorsPage />;
      case 'retirement': return <RetirementPage />;
      case 'goals': return <GoalsPage />;
      case 'risk': return <RiskProfilePage />;
      case 'assets': return <AssetsPage />;
      case 'income': return <IncomePage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="min-h-[calc(100vh-200px)]">{renderPage()}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
