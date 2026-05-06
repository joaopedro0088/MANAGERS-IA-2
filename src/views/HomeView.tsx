/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Zap, Save, ChevronRight, Trophy, Bot, Newspaper, Star, 
  Target, Crown, Settings, Globe, Palette, X, Check,
  Lightbulb, Flame, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../store';
import { AppSettings } from '../types';

interface HomeViewProps {
  onGenerate: () => void;
  onSeeSaves: () => void;
  onSeeLogs: () => void;
}

const LANGUAGES = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export default function HomeView({ onGenerate, onSeeSaves, onSeeLogs }: HomeViewProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>(storage.getAppSettings());
  const [dailySuggestion, setDailySuggestion] = useState<any>(null);

  const user = storage.getCurrentUser();
  const logs = storage.getLogs().slice(0, 2);
  const challenges = storage.getOfficialChallenges().slice(0, 2);

  useEffect(() => {
    // Generate/Get Daily Suggestion
    const tips = storage.getLibraryIdeas();
    if (tips.length > 0) {
      const today = new Date().toDateString();
      // Simple pseudo-random based on date
      const index = today.length % tips.length;
      setDailySuggestion(tips[index]);
    }
  }, []);

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...appSettings, ...newSettings };
    setAppSettings(updated);
    storage.setAppSettings(updated);
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header with Settings */}
      <header className="flex justify-between items-center py-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Crown size={20} className="text-[#7B2CBF] drop-shadow-[0_0_8px_rgba(123,44,191,0.5)]" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Olá, {user?.name.split(' ')[0]}</h2>
          </div>
          <div className="flex items-center gap-3">
             <p className="text-[10px] text-[#A0A0A0] font-black uppercase tracking-widest border-r border-white/10 pr-3">Nível {user?.level}</p>
             <div className="flex items-center gap-1.5 bg-[#7B2CBF]/10 px-2 py-0.5 rounded-full border border-[#7B2CBF33]">
                <Award size={10} className="text-[#7B2CBF]" />
                <span className="text-[9px] font-black uppercase text-[#7B2CBF]">{user?.badges.length} Badges</span>
             </div>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-4 bg-[#1A1A1A] border border-[#2D2D2D] rounded-[24px] text-[#A0A0A0] hover:text-white hover:border-[#7B2CBF44] transition-all active:scale-95 group"
        >
          <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </header>

      {/* Daily Automatic Suggestion */}
      {dailySuggestion && (
        <section className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
          <div className="bg-[#1A1A1A] border border-[#7B2CBF33] p-6 rounded-[32px] relative z-10 flex gap-5 group-hover:border-[#7B2CBF66] transition-all">
             <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center text-[#7B2CBF] shrink-0 border border-white/5">
                <Lightbulb size={28} className="animate-pulse" />
             </div>
             <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <Flame size={12} className="text-orange-500" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7B2CBF]">Sugestão do Dia</span>
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight text-white">{dailySuggestion.title}</h4>
                <p className="text-[10px] text-[#A0A0A0] leading-relaxed italic line-clamp-2">"{dailySuggestion.content}"</p>
             </div>
          </div>
        </section>
      )}

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-5">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onGenerate}
          className="bg-gradient-to-br from-[#7B2CBF] to-[#5A189A] p-7 rounded-[40px] flex flex-col items-center gap-5 shadow-2xl shadow-[#7B2CBF33] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          <div className="bg-white/20 p-4 rounded-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl border border-white/20">
            <Zap className="text-white" size={36} fill="white" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Criar Carreira</span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onSeeSaves}
          className="bg-[#1A1A1A] border border-[#2D2D2D] p-7 rounded-[40px] flex flex-col items-center gap-5 hover:border-[#7B2CBF44] transition-all group relative overflow-hidden"
        >
          <div className="bg-[#7B2CBF]/10 p-4 rounded-3xl group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 border border-[#7B2CBF22]">
            <Save className="text-[#7B2CBF]" size={36} fill="#7B2CBF" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A0A0A0]">Meu Diário</span>
        </motion.button>
      </div>

      {/* Official Challenges */}
      <section className="space-y-5">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-4 bg-[#7B2CBF] rounded-full"></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#A0A0A0]">Eventos Ativos</h3>
          </div>
        </div>
        <div className="space-y-4">
          {challenges.map(ch => (
            <div key={ch.id} className="bg-[#1A1A1A] border border-[#2D2D2D] p-5 rounded-[32px] flex items-center gap-5 hover:bg-white/5 transition-all cursor-pointer group active:scale-[0.98]">
              <div className="w-14 h-14 bg-[#0F0F0F] rounded-[22px] flex items-center justify-center text-2xl border border-[#2D2D2D] group-hover:border-[#7B2CBF44] group-hover:scale-105 transition-all shadow-inner">
                {ch.rewardIcon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black uppercase italic text-white tracking-tight leading-none">{ch.title}</h4>
                  <span className={`text-[8px] px-2 py-0.5 rounded-lg font-black tracking-widest uppercase border ${ch.difficulty === 'Extreme' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                    {ch.difficulty}
                  </span>
                </div>
                <p className="text-[10px] text-[#A0A0A0] line-clamp-1 font-medium opacity-60 tracking-tight leading-tight">{ch.description}</p>
              </div>
              <div className="p-2 bg-white/5 rounded-xl text-[#2D2D2D] group-hover:text-[#7B2CBF] transition-colors">
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Logs & Updates */}
      <section className="space-y-5">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-4 bg-[#7B2CBF] rounded-full"></div>
             <h3 className="text-xs font-black uppercase tracking-widest text-[#A0A0A0]">Fox News</h3>
          </div>
          <button onClick={onSeeLogs} className="text-[10px] font-black text-[#7B2CBF] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity">Ver Diário</button>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-[40px] p-8 space-y-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Newspaper size={80} />
           </div>
          {logs.map(log => (
            <div key={log.id} className="flex gap-5 relative z-10 group">
              <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#7B2CBF] shrink-0 shadow-[0_0_8px_rgba(123,44,191,0.5)] group-hover:scale-125 transition-transform" />
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-black text-white uppercase italic tracking-tighter">{log.title}</h4>
                <p className="text-[10px] text-[#A0A0A0] line-clamp-2 leading-relaxed font-medium opacity-80">{log.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-md"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 30 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-[#0F0F0F] border border-[#2D2D2D] w-full max-w-sm rounded-[40px] p-8 space-y-8"
             >
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <Settings size={20} className="text-[#7B2CBF]" />
                      <h3 className="text-xl font-black uppercase italic text-white tracking-widest">Configuração</h3>
                   </div>
                   <button onClick={() => setShowSettings(false)} className="p-3 bg-white/5 rounded-2xl text-[#A0A0A0] hover:text-white transition-all"><X size={24} /></button>
                </div>

                <div className="space-y-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 ml-1">
                         <Palette size={14} className="text-[#7B2CBF]" />
                         <span className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest">Tema Visual</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <button 
                           onClick={() => handleUpdateSettings({ theme: 'dark' })}
                           className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${appSettings.theme === 'dark' ? 'bg-[#7B2CBF] border-[#7B2CBF] text-white' : 'bg-white/5 border-white/5 text-[#A0A0A0]'}`}
                         >
                            <div className="w-3 h-3 rounded-full bg-black border border-white/20"></div>
                            <span className="text-[10px] font-black uppercase">Ouro Negro</span>
                         </button>
                         <button 
                           onClick={() => handleUpdateSettings({ theme: 'light' })}
                           className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${appSettings.theme === 'light' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-[#A0A0A0]'}`}
                         >
                            <div className="w-3 h-3 rounded-full bg-white border border-black/20"></div>
                            <span className="text-[10px] font-black uppercase">Pureza Fox</span>
                         </button>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-2 ml-1">
                         <Globe size={14} className="text-[#7B2CBF]" />
                         <span className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest">Idioma Fox</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                         {LANGUAGES.map(lang => (
                           <button 
                             key={lang.code}
                             onClick={() => handleUpdateSettings({ language: lang.code as any })}
                             className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${appSettings.language === lang.code ? 'bg-[#7B2CBF]/10 border-[#7B2CBF] text-white shadow-lg' : 'bg-white/5 border-white/5 text-[#A0A0A0]'}`}
                           >
                              <span className="text-2xl">{lang.flag}</span>
                              <span className="text-[8px] font-black uppercase">{lang.name}</span>
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="pt-4 border-t border-white/5 space-y-4">
                      <div className="flex flex-col items-center gap-3">
                         <div className="flex flex-col items-center gap-1">
                            <span className="text-[8px] font-black uppercase text-[#555] tracking-widest leading-none">Powered by</span>
                            <span className="text-sm font-black italic text-white uppercase tracking-tighter leading-none">Jaoxx_99</span>
                            <span className="text-[7px] font-black uppercase text-[#333] tracking-[0.3em] font-mono leading-none">Developer / CEO</span>
                         </div>
                         <a href="https://instagram.com/jao_pxx99" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/5 px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase text-[#A0A0A0] hover:text-[#7B2CBF] hover:bg-[#7B2CBF]/10 transition-all border border-white/5">
                            Instagram @jao_pxx99
                         </a>
                      </div>
                   </div>

                   <button 
                     onClick={() => setShowSettings(false)}
                     className="w-full bg-[#7B2CBF] text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#7B2CBF44] active:scale-95 transition-all"
                   >
                     Aplicar Mudanças
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
