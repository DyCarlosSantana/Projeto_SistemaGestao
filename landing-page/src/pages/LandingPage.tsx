import React from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingHero from '../components/landing/LandingHero';
import BenefitsStack from '../components/landing/BenefitsStack';
import FeatureGrid from '../components/landing/FeatureGrid';
import TestimonialsBento from '../components/landing/TestimonialsBento';
import FAQ from '../components/landing/FAQ';
import LandingPricing from '../components/landing/LandingPricing';
import FinalCTA from '../components/landing/FinalCTA';
import LandingFooter from '../components/landing/LandingFooter';
import { motion, useScroll, useSpring } from 'framer-motion';

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative min-h-screen bg-[#f8fafc] selection:bg-dycore-pink selection:text-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-dycore-pink z-[60] origin-left"
        style={{ scaleX }}
      />

      <LandingHeader />
      
      <main>
        <LandingHero />
        
        {/* Logos / Social Proof */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#0f172a]/40 max-w-[200px]">
                CONFIADO POR EMPRESAS LÍDERES
               </p>
               <div className="flex flex-wrap justify-center gap-16 md:gap-24">
                {['TECHFLOW', 'VENU', 'DECOR', 'FLOW', 'DYCORE'].map((logo) => (
                  <span key={logo} className="text-3xl font-display font-black tracking-tighter text-[#0f172a]">{logo}</span>
                ))}
               </div>
            </div>
          </div>
        </section>

        <BenefitsStack />

        <FeatureGrid />
        
        <TestimonialsBento />
        
        <LandingPricing />
        
        <FinalCTA />

        <FAQ />
      </main>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
