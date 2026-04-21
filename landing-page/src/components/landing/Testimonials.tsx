import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ quote, author, role, delay }: { quote: string, author: string, role: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-12 rounded-[3.5rem] border border-black/5 shadow-2xl shadow-black/[0.02] hover:shadow-black/[0.05] transition-all duration-500 relative"
  >
    <div className="absolute top-10 right-10 text-black/5">
      <Quote size={48} />
    </div>
    <div className="flex space-x-1 mb-10">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className="fill-dycore-gold text-dycore-gold" />
      ))}
    </div>
    <p className="text-[#0f172a] text-lg font-medium leading-relaxed mb-12 italic">
      "{quote}"
    </p>
    <div className="flex items-center space-x-5">
      <div className="w-16 h-16 bg-[#0f172a]/5 rounded-full overflow-hidden border-2 border-white shadow-lg">
        <img 
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`} 
          alt={author} 
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h4 className="font-display font-black text-[#0f172a] text-lg tracking-tight">{author}</h4>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-dycore-pink">{role}</p>
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const testimonials = [
    {
      quote: "O Dycore transformou a forma como gerencio minhas locações. Antes era tudo manual, hoje tenho controle total em segundos.",
      author: "Juliana Silva",
      role: "CEO na Eventos Premium",
      delay: 0.1
    },
    {
      quote: "A interface é de outro planeta. Meus funcionários aprenderam a usar em menos de uma hora. Eficiência pura!",
      author: "Ricardo Mendes",
      role: "Dono da RentalTech",
      delay: 0.2
    },
    {
      quote: "O melhor investimento que fiz este ano. O suporte é rápido e o sistema é extremamente estável.",
      author: "Ana Beatriz",
      role: "Gerente Financeira",
      delay: 0.3
    }
  ];

  return (
    <section className="py-40 px-6 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <p className="text-dycore-pink font-black uppercase tracking-[0.4em] text-[10px] mb-6">Confiança Total</p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display font-black text-[#0f172a] tracking-tighter leading-[0.9]"
          >
            Aprovado por quem <br /> domina o mercado.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
