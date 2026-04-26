import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const BenefitCard = ({ title, description, index }: { title: string, description: string, index: number }) => {
  return (
    <div
      className="sticky w-full mb-[15vh] last:mb-0"
      style={{ top: `calc(180px + ${index * 40}px)` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-12 md:p-16 rounded-[1.5rem] border border-black/5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] w-full max-w-xl mx-auto"
      >
        <h4 className="text-2xl md:text-3xl font-black text-[#0f172a] mb-6 pb-6 border-b border-black/5 tracking-tighter">
          {title}
        </h4>
        <p className="text-[#0f172a]/50 text-base md:text-lg font-medium leading-relaxed">
          {description}
        </p>
      </motion.div>
    </div>
  );
};

const BenefitsStack = () => {
  const benefits = [
    {
      title: "Recebimento Fácil",
      description: "Dê aos seus clientes formas de pagamentos online e seguros, mais acessibilidade e facilidade para você e seus clientes."
    },
    {
      title: "Zero Inadimplência",
      description: "Receba sempre em dia e diga adeus a desorganização. Diminua a inadimplência em até 30% com lembretes automáticos."
    },
    {
      title: "Recepção Moderna",
      description: "Impressione seus clientes com uma recepção moderna, organizada e tecnológica, focada na primeira impressão."
    },
    {
      title: "Estoque Inteligente",
      description: "Controle total de produtos e insumos com alertas de reposição e relatórios de giro de mercadorias em tempo real."
    }
  ];

  return (
    <section className="relative bg-white pt-20 pb-40">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600;1,700&display=swap');`}
      </style>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-start gap-12">
        {/* Left Content - Truly Fixed and spaced from header */}
        <div className="w-full lg:w-1/2 lg:h-[calc(100vh-100px)] lg:sticky lg:top-32 flex flex-col justify-center py-12">
          <div className="space-y-0 mb-10">
            <p className="text-[#0f172a]/30 font-black uppercase tracking-[0.4em] text-[9px] mb-4">Te ajudamos a melhorar a</p>
            <h2 className="font-display leading-[0.8] tracking-tighter">
              <span className="text-dycore-gold font-serif italic text-5xl md:text-[6rem] block lowercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Lucratividade
              </span>
              <span className="text-dycore-blue font-serif italic text-5xl md:text-[6rem] block lowercase mt-[-5px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                e Organização
              </span>
            </h2>
          </div>

          <p className="text-base text-[#0f172a]/40 font-medium mb-12 max-w-sm leading-relaxed">
            Um sistema completo para gerenciar alunos, automatizar vendas e garantir crescimento sustentável para o seu negócio.
          </p>

          {/* CTA Card */}
          <div className="relative group w-full max-w-lg">
            <div className="absolute -inset-1 bg-gradient-to-r from-dycore-blue/5 via-purple-400/5 to-dycore-pink/5 rounded-[1.5rem] blur opacity-40 transition duration-1000"></div>
            <div className="relative bg-white border border-black/5 p-10 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
              <p className="text-sm font-bold text-[#0f172a] max-w-[200px] leading-tight">
                Soluções tecnológicas específicas para o seu negócio.
              </p>
              <Button className="bg-[#0f172a] text-white hover:bg-black rounded-full px-10 py-6 font-black uppercase tracking-widest text-[10px] shadow-xl">
                Solicitar Contato
              </Button>
            </div>
          </div>
        </div>

        {/* Right Stack - Correct Overlapping Logic */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {benefits.map((benefit, idx) => (
            <BenefitCard key={idx} index={idx} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsStack;
