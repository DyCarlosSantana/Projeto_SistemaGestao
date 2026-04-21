import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-6 relative overflow-hidden bg-white">
      {/* Soft Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-blue-100/30 via-dycore-pink/10 to-dycore-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-[#0f172a] p-16 md:p-32 rounded-[5rem] text-center shadow-3xl shadow-black/20 relative overflow-hidden">
          {/* Animated Stars/Particles in background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             {[...Array(20)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ 
                   opacity: [0, 1, 0],
                   scale: [0, 1, 0]
                 }}
                 transition={{ 
                   duration: Math.random() * 3 + 2,
                   repeat: Infinity,
                   delay: Math.random() * 5
                 }}
                 style={{ 
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`
                 }}
                 className="absolute w-1 h-1 bg-white rounded-full"
               />
             ))}
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-2 mb-10"
            >
              <Sparkles className="w-5 h-5 text-dycore-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Pronto para a Evolução?</span>
            </motion.div>

            <h2 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.85] mb-14">
              Comece a sua <br /> nova era hoje.
            </h2>

            <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
              Junte-se a centenas de empresas que já modernizaram sua gestão com o Dycore. Teste grátis por 14 dias.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-white text-[#0f172a] hover:bg-white/90 rounded-full px-16 py-9 text-xl font-black shadow-2xl shadow-white/5 transition-all hover:scale-105"
              >
                Criar Conta Grátis
              </Button>
              <Button 
                variant="link"
                className="text-white/60 hover:text-white font-bold text-lg"
              >
                Agendar conversa <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
