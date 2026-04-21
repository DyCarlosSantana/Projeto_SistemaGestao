import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowUpRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingCard = ({ 
  tier, 
  price, 
  description, 
  features, 
  isMain = false,
  delay = 0 
}: { 
  tier: string, 
  price: string, 
  description: string, 
  features: string[], 
  isMain?: boolean,
  delay?: number
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`relative flex flex-col w-full max-w-[380px] bg-white rounded-[3.5rem] overflow-hidden transition-all duration-500 border-2 ${
        isMain ? 'border-dycore-pink shadow-3xl shadow-dycore-pink/10' : 'border-black/5 shadow-xl shadow-black/[0.02]'
      }`}
    >
      <div className="p-12 pb-8">
        <div className="flex justify-between items-start mb-8">
          <h3 className="text-3xl font-display font-black tracking-tighter text-[#0f172a]">{tier}</h3>
          {isMain && (
            <div className="bg-dycore-pink text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center">
              <Star size={10} className="mr-2 fill-current" /> Destaque
            </div>
          )}
        </div>

        <p className="text-base font-medium text-[#0f172a]/40 mb-12 leading-relaxed min-h-[70px]">
          {description}
        </p>

        <div className="flex items-center justify-between">
           <Button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`rounded-2xl font-black uppercase tracking-widest text-[10px] px-8 py-7 transition-all ${
              isMain ? 'bg-[#0f172a] text-white hover:bg-black' : 'bg-black/5 text-[#0f172a] hover:bg-black/10'
            }`}
          >
            {isExpanded ? 'Ver menos' : 'Detalhes'} <ArrowUpRight className="ml-2 w-4 h-4" />
          </Button>

          <div className="text-right">
            <div className="flex items-baseline justify-end">
              <span className="text-sm font-black text-[#0f172a]/30 mr-1">R$</span>
              <span className="text-5xl font-display font-black tracking-tighter text-[#0f172a]">{price}</span>
            </div>
            <span className="text-[10px] font-black text-[#0f172a]/20 uppercase tracking-[0.2em] block mt-1">/ mensal</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-12 pb-12 pt-8 bg-[#fcfcfc] border-t border-black/5"
          >
            <div className="space-y-5">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0f172a]/30 mb-6">Recursos do Plano:</p>
              {features.map((f, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-full bg-dycore-blue/10 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-dycore-blue" strokeWidth={4} />
                  </div>
                  <span className="text-sm font-bold text-[#0f172a]/70 tracking-tight">{f}</span>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-10 bg-dycore-pink text-white rounded-[2rem] py-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-dycore-pink/20 hover:scale-[1.02] transition-all">
              Assinar Plano
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LandingPricing = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="preços" className="py-32 px-6 bg-[#f8fafc] relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-24">
          <p className="text-dycore-pink font-black uppercase tracking-[0.4em] text-[10px] mb-6">Investimento Consciente</p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display font-black text-[#0f172a] tracking-tighter text-center mb-16 leading-[0.9]"
          >
            Planos feitos para <br /> impulsionar seu crescimento.
          </motion.h2>

          <div className="bg-white border border-black/5 p-2 rounded-[2rem] flex items-center shadow-sm">
            <button 
              onClick={() => setBilling('monthly')}
              className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${billing === 'monthly' ? 'bg-[#0f172a] text-white shadow-xl' : 'text-[#0f172a]/30 hover:text-[#0f172a]'}`}
            >
              Mensal
            </button>
            <button 
              onClick={() => setBilling('yearly')}
              className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${billing === 'yearly' ? 'bg-[#0f172a] text-white shadow-xl' : 'text-[#0f172a]/30 hover:text-[#0f172a]'}`}
            >
              Anual
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-10 items-start">
          <PricingCard 
            tier="Standard"
            price={billing === 'monthly' ? '97' : '77'}
            description="Ideal para profissionais e pequenos negócios que buscam organização digital."
            features={["Até 500 produtos", "PDV Mobile", "Relatórios Financeiros", "1 Usuário Master", "Suporte VIP"]}
            delay={0.1}
          />
          <PricingCard 
            tier="Pro Plan"
            price={billing === 'monthly' ? '197' : '157'}
            description="O ecossistema completo para empresas que buscam automação e escala real."
            features={["Produtos Ilimitados", "Gestão de Locações", "Agenda Integrada", "Até 5 Usuários", "Suporte Prioritário", "Dashboard Executivo"]}
            isMain={true}
            delay={0.2}
          />
          <PricingCard 
            tier="Enterprise"
            price={billing === 'monthly' ? '497' : '397'}
            description="Customização total e infraestrutura dedicada para grandes operações."
            features={["Multi-tenant", "API de Integração", "Usuários Ilimitados", "Gerente de Sucesso", "Backup Diário"]}
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};

export default LandingPricing;
