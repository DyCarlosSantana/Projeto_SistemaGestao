import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const LandingHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4' : 'py-8'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between px-8 py-3 rounded-2xl transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl border border-black/5 shadow-2xl shadow-black/5' 
            : 'bg-transparent'
        }`}>
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 relative overflow-hidden rounded-xl bg-[#0f172a] flex items-center justify-center shadow-lg">
              <img src="/logo.png" alt="Dycore Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-2xl font-display font-black tracking-tighter text-[#0f172a]">
              Dycore
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-12 text-xs font-black uppercase tracking-widest text-[#0f172a]/60">
            {['Funcionalidades', 'Preços', 'Sobre'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="hover:text-dycore-pink transition-colors relative group"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-[#0f172a] hover:bg-black/5 rounded-full px-6 font-bold"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-[#0f172a] text-white hover:bg-black rounded-full px-8 py-6 shadow-xl shadow-black/10 transition-all font-bold"
            >
              Começar Agora
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[#0f172a]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-6 right-6 mt-4 bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden"
          >
            <div className="flex flex-col p-8 space-y-6">
              <a href="#funcionalidades" className="text-lg font-bold text-[#0f172a]">Funcionalidades</a>
              <a href="#preços" className="text-lg font-bold text-[#0f172a]">Preços</a>
              <a href="#sobre" className="text-lg font-bold text-[#0f172a]">Sobre</a>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-[#0f172a] text-white py-7 text-lg font-bold rounded-2xl"
              >
                Começar Agora
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default LandingHeader;
