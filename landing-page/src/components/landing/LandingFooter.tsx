import React from 'react';
import { Mail, MapPin, Phone, Globe, Send, Link as LinkIcon } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="py-32 px-6 bg-[#f1f5f9] border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          {/* Brand Column */}
          <div className="space-y-10">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-12 h-12 bg-[#0f172a] rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-xl">
                <img src="/logo.png" alt="Dycore" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-3xl font-display font-black tracking-tighter text-[#0f172a]">Dycore</span>
            </div>
            <p className="text-[#0f172a]/50 text-base font-medium leading-relaxed">
              Transformando a complexidade da gestão empresarial em uma experiência fluida, elegante e altamente rentável para o seu negócio.
            </p>
            <div className="flex space-x-5">
              {[Globe, Send, LinkIcon].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0f172a] hover:bg-dycore-pink hover:text-white shadow-sm hover:shadow-xl transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-[#0f172a] font-black mb-10 text-[10px] uppercase tracking-[0.4em]">Produto</h4>
            <ul className="space-y-5 text-sm font-bold text-[#0f172a]/40">
              <li><a href="#funcionalidades" className="hover:text-dycore-pink transition-colors">Funcionalidades</a></li>
              <li><a href="#preços" className="hover:text-dycore-pink transition-colors">Planos e Preços</a></li>
              <li><a href="#" className="hover:text-dycore-pink transition-colors">Demonstração</a></li>
              <li><a href="#" className="hover:text-dycore-pink transition-colors">Novidades</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-[#0f172a] font-black mb-10 text-[10px] uppercase tracking-[0.4em]">Suporte</h4>
            <ul className="space-y-5 text-sm font-bold text-[#0f172a]/40">
              <li><a href="#" className="hover:text-dycore-pink transition-colors">Centro de Ajuda</a></li>
              <li><a href="#" className="hover:text-dycore-pink transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-dycore-pink transition-colors">Status do Sistema</a></li>
              <li><a href="#" className="hover:text-dycore-pink transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-8">
            <h4 className="text-[#0f172a] font-black mb-10 text-[10px] uppercase tracking-[0.4em]">Contato</h4>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-dycore-pink shadow-sm group-hover:scale-110 transition-transform">
                  <Mail size={16} />
                </div>
                <span className="text-sm font-bold text-[#0f172a]/70">contato@dycore.com.br</span>
              </div>
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-dycore-pink shadow-sm group-hover:scale-110 transition-transform">
                  <Phone size={16} />
                </div>
                <span className="text-sm font-bold text-[#0f172a]/70">+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-dycore-pink shadow-sm group-hover:scale-110 transition-transform">
                  <MapPin size={16} />
                </div>
                <span className="text-sm font-bold text-[#0f172a]/70">São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-xs font-bold text-[#0f172a]/30 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Dycore. Todos os direitos reservados.
          </p>
          <div className="flex space-x-10 text-[10px] font-black uppercase tracking-widest text-[#0f172a]/20">
            <a href="#" className="hover:text-dycore-pink transition-colors">Privacidade</a>
            <a href="#" className="hover:text-dycore-pink transition-colors">Termos</a>
            <a href="#" className="hover:text-dycore-pink transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
