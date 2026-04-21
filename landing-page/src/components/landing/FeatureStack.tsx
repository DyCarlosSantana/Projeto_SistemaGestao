import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, ArrowRight, BarChart, ShoppingCart, Calendar } from 'lucide-react';

const FeatureCard = ({ 
  title, 
  description, 
  image, 
  index, 
  icon: Icon,
  features
}: { 
  title: string, 
  description: string, 
  image: string, 
  index: number,
  icon: any,
  features: string[]
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const isEven = index % 2 === 0;

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ 
          scale,
          top: `calc(10vh + ${index * 30}px)`,
        }}
        className="relative w-full max-w-6xl h-[70vh] bg-white rounded-[4rem] border border-black/5 shadow-2xl shadow-black/[0.03] overflow-hidden flex flex-col md:flex-row items-center"
      >
        {/* Content Side */}
        <div className={`flex-1 p-12 md:p-24 z-10 ${!isEven ? 'md:order-2' : ''}`}>
          <div className="w-16 h-16 bg-[#0f172a]/5 rounded-3xl flex items-center justify-center mb-10 text-[#0f172a]">
            <Icon size={32} />
          </div>
          <h3 className="text-4xl md:text-6xl font-display font-black text-[#0f172a] mb-8 tracking-tighter leading-tight">
            {title}
          </h3>
          <p className="text-lg md:text-xl text-[#0f172a]/50 font-medium mb-12 leading-relaxed">
            {description}
          </p>
          <div className="space-y-5 mb-14">
            {features.map((f, i) => (
              <div key={i} className="flex items-center space-x-4 text-[#0f172a]/70 font-bold">
                <div className="w-6 h-6 rounded-full bg-dycore-pink/10 flex items-center justify-center">
                  <Check size={14} className="text-dycore-pink" strokeWidth={4} />
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <button className="flex items-center space-x-3 text-[#0f172a] font-black uppercase tracking-[0.2em] text-xs hover:translate-x-3 transition-all">
            Conhecer módulo <ArrowRight size={20} />
          </button>
        </div>
        
        {/* Image Side */}
        <div className={`flex-1 h-full w-full p-12 md:p-16 ${isEven ? 'md:order-2' : 'md:order-1'} bg-[#fcfcfc]`}>
          <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border border-black/5 group">
             <img 
               src={image} 
               alt={title} 
               className="w-full h-full object-cover object-left-top transition-transform duration-1000 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureStack = () => {
  const features = [
    {
      title: "Impacto Real na Lucratividade",
      description: "Tome decisões baseadas em dados com relatórios de lucratividade automáticos e precisos.",
      image: "/dashboard-preview.png",
      icon: BarChart,
      features: ["Análise de ROI por pedido", "Fluxo de caixa inteligente", "DRE gerencial em tempo real"]
    },
    {
      title: "Vendas sem Fricção",
      description: "Um PDV ágil que elimina filas e erros operacionais, focado na experiência do seu cliente.",
      image: "/login-preview.png",
      icon: ShoppingCart,
      features: ["Checkout ultra-rápido", "Gestão de estoque multi-loja", "Integração total com cartões"]
    },
    {
      title: "Gestão de Locações",
      description: "Controle total do ciclo de vida das suas locações, da reserva ao checklist de devolução.",
      image: "/dashboard-preview.png",
      icon: Calendar,
      features: ["Agenda de disponibilidade", "Gestão de avarias", "Contratos automatizados"]
    }
  ];

  return (
    <section id="funcionalidades" className="relative pb-[40vh] pt-32 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-dycore-pink font-black uppercase tracking-[0.4em] text-[10px] mb-6">Eficiência Operacional</p>
          <h2 className="text-5xl md:text-8xl font-display font-black text-[#0f172a] tracking-tighter leading-[0.85]">
            Tudo o que você precisa <br /> em um só lugar.
          </h2>
        </motion.div>
      </div>

      <div className="px-6 space-y-[20vh]">
        {features.map((feature, idx) => (
          <FeatureCard 
            key={idx} 
            index={idx} 
            {...feature} 
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureStack;
