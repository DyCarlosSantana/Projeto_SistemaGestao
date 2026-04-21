import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-screen flex flex-col items-center">
      {/* Background Soft Glows (from the SantFit reference) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-blue-100/50 via-purple-50/30 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto w-full text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-[#0f172a]/5 border border-[#0f172a]/5 rounded-full px-5 py-2.5 mb-10"
        >
          <Sparkles className="w-4 h-4 text-[#0f172a]" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#0f172a]">Sistema de Gestão Completo</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-[5.5rem] font-display font-black tracking-tighter leading-[0.9] text-[#0f172a] mb-12"
        >
          O sistema completo para <br /> 
          <span className="text-dycore-pink">Modernizar seu negócio.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[#0f172a]/50 max-w-2xl mx-auto mb-14 font-medium leading-relaxed"
        >
          Unifique financeiro, vendas e locações em uma plataforma robusta feita para o crescimento real da sua empresa.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-24"
        >
          <Button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto bg-[#0f172a] text-white hover:bg-black rounded-full px-12 py-8 text-lg font-black shadow-2xl shadow-black/10 transition-all"
          >
            Começar Grátis <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            variant="outline"
            className="w-full sm:w-auto border-[#0f172a]/10 hover:bg-black/5 rounded-full px-12 py-8 text-lg font-black"
          >
            Ver Planos
          </Button>
        </motion.div>

        {/* System Preview with Soft Glow (Exactly like the SantFit Image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Large Glow behind screenshot */}
          <div className="absolute -inset-20 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-green-400/20 rounded-full blur-[100px] opacity-60" />
          
          <div className="relative bg-white p-3 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-black/5">
            <img 
              src="/dashboard-preview.png" 
              alt="Dycore Dashboard" 
              className="rounded-[2rem] w-full shadow-2xl border border-black/5"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHero;
