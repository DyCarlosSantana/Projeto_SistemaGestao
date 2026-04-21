import React from 'react';
import { motion } from 'framer-motion';

const ResourceCard = ({ title, description, image, bgColor, delay }: { title: string, description: string, image: string, bgColor: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`${bgColor} p-10 rounded-[2.5rem] border border-black/5 flex flex-col h-full`}
  >
    <div className="flex-1 mb-10 overflow-hidden rounded-2xl shadow-xl border border-black/5">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div>
      <h4 className="text-2xl font-black text-[#0f172a] mb-4 tracking-tight">{title}</h4>
      <p className="text-[#0f172a]/50 text-sm font-medium leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  </motion.div>
);

const FeatureGrid = () => {
  const resources = [
    {
      title: "Domínio Financeiro 360°",
      description: "Abandone o \"caderninho\" e as planilhas quebradas. Tenha um DRE gerencial automático em tempo real.",
      image: "/dashboard-preview.png",
      bgColor: "bg-gradient-to-br from-green-100/50 to-blue-100/50",
      delay: 0.1
    },
    {
      title: "Organização Inteligente de Relacionamentos",
      description: "Simplifique a forma como você gerencia conexões e fideliza seus clientes sem esforço.",
      image: "/dashboard-preview.png",
      bgColor: "bg-white shadow-3xl shadow-black/[0.02]",
      delay: 0.2
    },
    {
      title: "Catálogo de Vendas e Serviços",
      description: "Potencialize seu faturamento com um catálogo integrado, prático e visualmente atraente.",
      image: "/login-preview.png",
      bgColor: "bg-gray-100/50",
      delay: 0.3
    },
    {
      title: "Planejador de Tarefas Automatizado",
      description: "Aumente a eficiência da sua equipe com um planejador que prioriza o que realmente importa.",
      image: "/dashboard-preview.png",
      bgColor: "bg-white shadow-3xl shadow-black/[0.02]",
      delay: 0.4
    }
  ];

  return (
    <section id="recursos" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 text-[#0f172a]/30 mb-6">
            <span className="text-xs">✦</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Recursos</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-[#0f172a] tracking-tighter leading-[0.85] mb-8">
            Tudo o que você precisa <br /> em um só lugar.
          </h2>
          <p className="text-lg text-[#0f172a]/40 max-w-lg mx-auto font-medium">
            Ferramentas poderosas desenhadas para simplificar fluxos e aumentar a produtividade da sua equipe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((res, idx) => (
            <ResourceCard key={idx} {...res} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
