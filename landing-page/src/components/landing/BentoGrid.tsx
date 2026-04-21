import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  ShoppingCart, 
  Calendar, 
  Shield, 
  Zap,
  Layout,
  ArrowUpRight
} from 'lucide-react';

const BentoCard = ({ 
  title, 
  description, 
  icon: Icon, 
  className = "", 
  delay = 0,
  image = "",
  accent = "pink"
}: { 
  title: string, 
  description: string, 
  icon: any, 
  className?: string, 
  delay?: number,
  image?: string,
  accent?: "pink" | "gold" | "blue" | "dark"
}) => {
  const accentColors = {
    pink: "text-dycore-pink bg-dycore-pink/10",
    gold: "text-dycore-gold bg-dycore-gold/10",
    blue: "text-dycore-blue bg-dycore-blue/10",
    dark: "text-dycore-dark bg-dycore-dark/5"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className={`group relative bg-white border border-black/5 rounded-[40px] overflow-hidden hover:shadow-2xl hover:shadow-dycore-pink/5 transition-all duration-500 ${className}`}
    >
      <div className="p-10 relative z-10 h-full flex flex-col">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500 ${accentColors[accent]}`}>
          <Icon size={28} />
        </div>
        
        <h3 className="text-3xl font-display font-black text-dycore-dark mb-4 tracking-tight leading-tight">{title}</h3>
        <p className="text-dycore-dark/50 font-medium leading-relaxed mb-6 flex-grow">{description}</p>
        
        <div className="flex items-center text-dycore-pink font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Saber mais <ArrowUpRight className="ml-2" size={18} />
        </div>
      </div>

      {image && (
        <div className="absolute bottom-0 right-0 w-3/4 translate-x-1/4 translate-y-1/4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000 opacity-20 group-hover:opacity-100">
          <img src={image} alt={title} className="rounded-tl-3xl shadow-2xl border border-black/5" />
        </div>
      )}
      
      {/* Decorative Blob */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-white to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
};

const BentoGrid = () => {
  return (
    <section id="funcionalidades" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-dycore-pink font-black uppercase tracking-[0.2em] text-xs mb-4"
            >
              Potência & Elegância
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-display font-black tracking-tight text-dycore-dark"
            >
              Uma interface que <br />
              <span className="text-gradient">facilita seu dia.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-dycore-dark/40 text-lg font-medium max-w-sm mb-2"
          >
            Cada pixel foi pensado para que você foque no que importa: o crescimento da sua empresa.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-8">
          {/* Financeiro */}
          <BentoCard 
            title="Controle de Caixa"
            description="Visualize sua saúde financeira com gráficos dinâmicos e conciliação automática."
            icon={BarChart}
            image="/dashboard-preview.png"
            className="md:col-span-6 lg:col-span-7 lg:row-span-2"
            delay={0.1}
            accent="pink"
          />

          {/* Vendas */}
          <BentoCard 
            title="PDV Ágil"
            description="Realize vendas e orçamentos em segundos com interface touch-friendly."
            icon={ShoppingCart}
            className="md:col-span-3 lg:col-span-5 lg:row-span-1"
            delay={0.2}
            accent="gold"
          />

          {/* Agenda */}
          <BentoCard 
            title="Agenda Inteligente"
            description="Gestão de locações e compromissos com visão de calendário integrada."
            icon={Calendar}
            className="md:col-span-3 lg:col-span-5 lg:row-span-1"
            delay={0.3}
            accent="blue"
          />

          {/* Login / Segurança */}
          <BentoCard 
            title="Acesso Seguro"
            description="Interface de autenticação premium com proteção de dados multi-nível."
            icon={Shield}
            image="/login-preview.png"
            className="md:col-span-6 lg:col-span-8 lg:row-span-1"
            delay={0.4}
            accent="dark"
          />

          {/* SaaS */}
          <BentoCard 
            title="Performance SaaS"
            description="Arquitetura moderna pronta para escalar seu negócio sem gargalos."
            icon={Zap}
            className="md:col-span-6 lg:col-span-4 lg:row-span-1"
            delay={0.5}
            accent="pink"
          />
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
