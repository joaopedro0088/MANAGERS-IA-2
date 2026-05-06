/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Home, Zap, Save as SaveIcon, User as UserIcon, Settings, Shield, Terminal, LogOut, Compass, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from './store';
import { User, UserRole } from './types';
import { COLORS } from './constants';

// Views
import HomeView from './views/HomeView';
import GeneratorView from './views/GeneratorView';
import SavesView from './views/SavesView';
import ProfileView from './views/ProfileView';
import AdminDashboard from './views/AdminDashboard';
import LogsView from './views/LogsView';
import LibraryView from './views/LibraryView';
import LoginView from './views/LoginView';

import CareersDiscoveryView from './views/CareersDiscoveryView';

import { checkSupabaseConnection } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'generator' | 'saves' | 'profile' | 'library' | 'careers'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLogsView, setIsLogsView] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    const savedUser = storage.getCurrentUser();
    if (savedUser) setUser(savedUser);
    
    checkSupabaseConnection().then(setDbStatus);
  }, []);

  if (!user) {
    return (
      <>
        <LoginView onLogin={setUser} />
        {dbStatus && !dbStatus.ok && (
          <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-bounce z-[999]">
            <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">{dbStatus.message}</p>
          </div>
        )}
      </>
    );
  }

  const renderContent = () => {
    if (isLogsView) return <LogsView onBack={() => setIsLogsView(false)} />;
    if (isAdminView && user && user.role !== UserRole.USER) {
      return <AdminDashboard user={user} onBack={() => setIsAdminView(false)} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            onGenerate={() => setActiveTab('generator')} 
            onSeeSaves={() => setActiveTab('saves')}
            onSeeLogs={() => setIsLogsView(true)}
          />
        );
      case 'generator':
        return <GeneratorView />;
      case 'saves':
        return <SavesView />;
      case 'careers':
        return <CareersDiscoveryView />;
      case 'library':
        return <LibraryView />;
      case 'profile':
        return (
          <ProfileView 
            user={user} 
            onOpenAdmin={() => setIsAdminView(true)}
            onOpenLogs={() => setIsLogsView(true)}
            onLogout={() => {
              storage.logout();
              setUser(null);
            }}
          />
        );
      default:
        return <HomeView onGenerate={() => setActiveTab('generator')} onSeeSaves={() => setActiveTab('saves')} onSeeLogs={() => setIsLogsView(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans selection:bg-[#7B2CBF] selection:text-white pb-20">
      <header className="px-6 py-8 flex justify-between items-center border-b border-[#2D2D2D]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#7B2CBF] rounded-lg flex items-center justify-center">
            <Zap size={20} fill="white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">FOX MANAGERS</h1>
        </div>
        <div className="flex items-center gap-4">
          {user && user.role !== UserRole.USER && (
            <button 
              onClick={() => setIsAdminView(!isAdminView)}
              className={`p-2 rounded-full transition-colors ${isAdminView ? 'bg-[#7B2CBF] text-white' : 'bg-[#1A1A1A] text-[#A0A0A0]'}`}
            >
              <Shield size={20} />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogsView ? 'logs' : (isAdminView ? 'admin' : activeTab)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="px-6 py-6"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      {!isAdminView && !isLogsView && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0F0F0F] border-t border-[#2D2D2D] px-4 py-3 flex justify-between items-center z-50 max-w-lg mx-auto">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-[#7B2CBF]' : 'text-[#A0A0A0]'}`}
          >
            <Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[9px] font-bold uppercase">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('generator')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'generator' ? 'text-[#7B2CBF]' : 'text-[#A0A0A0]'}`}
          >
            <Zap size={20} strokeWidth={activeTab === 'generator' ? 2.5 : 2} />
            <span className="text-[9px] font-bold uppercase">Gerador</span>
          </button>
          <button 
            onClick={() => setActiveTab('saves')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'saves' ? 'text-[#7B2CBF]' : 'text-[#A0A0A0]'}`}
          >
            <SaveIcon size={20} strokeWidth={activeTab === 'saves' ? 2.5 : 2} />
            <span className="text-[9px] font-bold uppercase">Saves</span>
          </button>
          <button 
            onClick={() => setActiveTab('careers')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'careers' ? 'text-[#7B2CBF]' : 'text-[#A0A0A0]'}`}
          >
            <Compass size={20} strokeWidth={activeTab === 'careers' ? 2.5 : 2} />
            <span className="text-[9px] font-bold uppercase">Explorar</span>
          </button>
          <button 
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'library' ? 'text-[#7B2CBF]' : 'text-[#A0A0A0]'}`}
          >
            <Book size={20} strokeWidth={activeTab === 'library' ? 2.5 : 2} />
            <span className="text-[9px] font-bold uppercase">Ideias</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-[#7B2CBF]' : 'text-[#A0A0A0]'}`}
          >
            <UserIcon size={20} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[9px] font-bold uppercase">Perfil</span>
          </button>
        </nav>
      )}
    </div>
  );
}
