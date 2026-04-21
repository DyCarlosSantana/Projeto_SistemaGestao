import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ 
  quote, 
  author, 
  role, 
  variant = 'white', 
  className = '',
  hasStars = false,
  delay = 0 
}: { 
  quote: string, 
  author: string, 
  role: string, 
  variant?: 'white' | 'black' | 'blue',
  className?: string,
  hasStars?: boolean,
  delay?: number
}) => {
  const styles = {
    white: 'bg-white text-[#0f172a] border border-black/5 shadow-sm',
    black: 'bg-[#0f172a] text-white border-none shadow-2xl shadow-black/20',
    blue: 'bg-[#2c99e4] text-white border-none shadow-2xl shadow-blue-500/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`${styles[variant]} ${className} p-10 rounded-[1.5rem] flex flex-col relative group overflow-hidden h-full`}
    >
      {/* Stars for Highlight Cards */}
      {hasStars && (
        <div className="flex space-x-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={`fill-current ${i === 4 ? 'opacity-30' : ''}`} />
          ))}
        </div>
      )}

      {/* Quote Icon - Top Right for Highlight, Bottom Right for White */}
      <div className={`absolute ${variant === 'white' ? 'bottom-8 right-8' : 'top-8 right-8'} opacity-[0.03] group-hover:opacity-10 transition-opacity`}>
        <Quote size={80} strokeWidth={3} />
      </div>

      <div className="flex-1">
        <p className={`text-lg leading-relaxed font-medium mb-10 ${variant === 'white' ? 'text-[#0f172a]/80' : 'text-white'}`}>
          "{quote}"
        </p>
      </div>

      <div className="flex items-center space-x-4 mt-auto">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-current/10">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`} 
            alt={author} 
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight">{author}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{role}</span>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsBento = () => {
  return (
    <section className="py-32 px-6 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1 */}
          <div className="space-y-6 flex flex-col">
            <TestimonialCard 
              variant="black"
              hasStars={true}
              className="flex-[2]"
              quote="This CRM transformed the way our team manages customers and opportunities. Within only three months of consistent use, we achieved a remarkable 35% increase in sales, driven by smarter workflows, better communication, and improved tracking."
              author="Alex Jordan"
              role="Content Strategist"
              delay={0.1}
            />
            <TestimonialCard 
              className="flex-1"
              quote="Within just 60 seconds, our complete CRM system was set up and ready for immediate use."
              author="Alex Jofer"
              role="Systems Administrator"
              delay={0.4}
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-6 flex flex-col">
            <TestimonialCard 
              className="flex-1"
              quote="Our team finally stopped juggling countless spreadsheets and switched to a cleaner, more efficient workflow solution."
              author="Daniel Cooper"
              role="Project Coordinator"
              delay={0.2}
            />
            <TestimonialCard 
              className="flex-1"
              quote="In just one day, our whole team was seamlessly collaborating and managing projects through a single dashboard."
              author="Liam Parker"
              role="Productivity Lead"
              delay={0.5}
            />
            <TestimonialCard 
              className="flex-1"
              quote="Our customer response time has improved by 40%, us to provide faster, more efficient support."
              author="Ethan Ross"
              role="Operations Manager"
              delay={0.7}
            />
          </div>

          {/* Column 3 */}
          <div className="space-y-6 flex flex-col">
            <TestimonialCard 
              className="flex-1"
              quote="We moved away from messy manual processes and embraced a smoother workflow that keeps our whole team aligned and efficient."
              author="Alison Thomas"
              role="Team Operations Lead"
              delay={0.3}
            />
            <TestimonialCard 
              variant="blue"
              hasStars={true}
              className="flex-[2]"
              quote="Dycore is a modern CRM platform designed to be simple, intelligent, and enjoyable to use. It streamlines daily tasks, organizes customer interactions, and helps teams work more efficiently while making the entire experience smoother and more engaging for everyone."
              author="Maya Rahman"
              role="Business Process Analyst"
              delay={0.6}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default TestimonialsBento;
