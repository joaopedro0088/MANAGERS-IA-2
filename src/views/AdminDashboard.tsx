/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, UserRole, Report, AppLog, GeneratorItem, ImportedCareer, CommunityTip, LibraryIdea, OfficialChallenge } from '../types';
import { storage } from '../store';
import { 
  Users, AlertTriangle, FileText, Settings, Shield, 
  ChevronLeft, Ban, Check, X, ShieldAlert, Plus, Search,
  Trash2, ArrowUpCircle, ArrowDownCircle, Info, Briefcase, Globe2, 
  MessageSquare, Edit3, Save, Eye, Crown, Zap, Flame, LayoutDashboard,
  ShieldCheck, Terminal, ToggleRight, History, Bell, Activity, MousePointer2,
  LogOut, Download, Upload, User as UserIcon, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CAREER_CATEGORIES, GAMES, COUNTRIES, TEAM_SIZES, GEN_TYPES, DIFFICULTIES } from '../constants';

interface AdminDashboardProps {
  user: User;
  onBack: () => void;
}

export default function AdminDashboard({ user, onBack }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [activePanel, setActivePanel] = useState<'dashboard' | 'users' | 'reports' | 'tips' | 'careers' | 'library' | 'system' | 'categories'>('dashboard');
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AppLog[]>([]);
  const [genLists, setGenLists] = useState<GeneratorItem[]>([]);
  const [careers, setCareers] = useState<ImportedCareer[]>([]);
  const [tips, setTips] = useState<CommunityTip[]>([]);
  const [library, setLibrary] = useState<LibraryIdea[]>([]);
  const [saves, setSaves] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<OfficialChallenge[]>([]);
  const [promoEmail, setPromoEmail] = useState('');

  const [appSettings, setAppSettings] = useState(storage.getAppSettings());
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Editable lists (Advanced Category Management)
  const [managedEras, setManagedEras] = useState<string[]>(CAREER_CATEGORIES);
  const [managedGames, setManagedGames] = useState<string[]>(GAMES);
  const [managedDifficulties, setManagedDifficulties] = useState<string[]>(DIFFICULTIES);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setReports(storage.getReports());
    setUsers(storage.getUsers());
    setLogs(storage.getLogs());
    setGenLists(storage.getGenLists());
    setCareers(storage.getImportedCareers());
    setTips(storage.getCommunityTips());
    setLibrary(storage.getLibraryIdeas());
    setSaves(storage.getSaves());
    setChallenges(storage.getOfficialChallenges());
  };

  const handleUpdateUserRole = (userId: string, role: UserRole) => {
    const allUsers = storage.getUsers();
    const updated = allUsers.map(u => {
      if (u.id === userId) {
        let badges = [...u.badges];
        if (role === UserRole.ADM && !badges.includes('ADM Fox')) badges.push('ADM Fox');
        if (role === UserRole.USER) badges = badges.filter(b => b !== 'ADM Fox');
        return { ...u, role, badges };
      }
      return u;
    });
    storage.setUsers(updated);
    setUsers(updated);
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Deseja realmente REMOVER este Manager?')) return;
    const remaining = users.filter(u => u.id !== userId);
    storage.setUsers(remaining);
    setUsers(remaining);
  };

  const handleResetLevel = (userId: string) => {
    if (!confirm('Deseja realmente RESETAR o nível deste Manager para 1?')) return;
    const allUsers = storage.getUsers();
    const updated = allUsers.map(u => u.id === userId ? { ...u, level: 1, xp: 0 } : u);
    storage.setUsers(updated);
    setUsers(updated);
    alert('Nível resetado com sucesso!');
  };

  const handleUpdateSettings = (newSettings: any) => {
    const updated = { ...appSettings, ...newSettings };
    setAppSettings(updated);
    storage.setAppSettings(updated);
  };

  const handleAdminPromotion = () => {
    if (!promoEmail) return;
    const allUsers = storage.getUsers();
    const userToPromote = allUsers.find(u => u.email.toLowerCase() === promoEmail.toLowerCase());
    
    if (userToPromote) {
      if (userToPromote.role === UserRole.CEO) {
        alert('Este usuário já é CEO.');
        return;
      }
      userToPromote.role = UserRole.ADM;
      if (!userToPromote.badges.includes('ADM Fox')) userToPromote.badges.push('ADM Fox');
      storage.setUsers(allUsers);
      setUsers(allUsers);
      setPromoEmail('');
      alert(`Usuário ${userToPromote.name} promovido a ADM!`);
    } else {
      alert('Usuário não encontrado.');
    }
  };

  const handleDeleteItem = (id: string, type: 'save' | 'tip' | 'idea' | 'challenge' | 'category') => {
    if (!confirm('Você tem certeza que deseja apagar permanentemente este item?')) return;
    
    if (type === 'save') {
      const remaining = saves.filter(s => s.id !== id);
      storage.setSaves(remaining);
      setSaves(remaining);
    } else if (type === 'tip') {
      const remaining = tips.filter(t => t.id !== id);
      storage.setCommunityTips(remaining);
      setTips(remaining);
    } else if (type === 'idea') {
      const remaining = library.filter(l => l.id !== id);
      storage.setLibraryIdeas(remaining);
      setLibrary(remaining);
    } else if (type === 'challenge') {
      const remaining = challenges.filter(c => c.id !== id);
      storage.setOfficialChallenges(remaining);
      setChallenges(remaining);
    }
    refreshData();
  };

  const handleLogin = () => {
    if (nameInput === 'joaopedroo' && passInput === '12345678910haha@2') {
      setIsAuthenticated(true);
    } else if (user.role === UserRole.CEO && passInput === '12345678910haha@2') {
       setIsAuthenticated(true);
    } else {
      alert('Acesso Negado. Verifique o Nome e a Senha digitados.');
    }
  };

  if (!isAuthenticated && user.role === UserRole.CEO) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A1A1A] border border-[#2D2D2D] p-10 rounded-[40px] w-full max-w-sm space-y-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-[#7B2CBF]/10 rounded-full flex items-center justify-center mx-auto border border-[#7B2CBF33]">
             <Shield size={40} className="text-[#7B2CBF]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase italic text-white tracking-widest">Área Restrita</h3>
            <p className="text-[10px] text-[#A0A0A0] font-black uppercase tracking-[0.2em]">Insira a chave mestra Fox</p>
          </div>
          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-[#444] ml-2">Identificação CEO</label>
              <input 
                type="text" 
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="NOME"
                className="w-full bg-black/40 border border-[#2D2D2D] rounded-2xl px-6 py-4 text-center text-sm focus:border-[#7B2CBF] outline-none text-white font-black tracking-widest"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-[#444] ml-2">Código de Acesso</label>
              <input 
                type="password" 
                value={passInput}
                onChange={e => setPassInput(e.target.value)}
                placeholder="SENHA"
                className="w-full bg-black/40 border border-[#2D2D2D] rounded-2xl px-6 py-4 text-center text-sm focus:border-[#7B2CBF] outline-none text-white font-black tracking-[0.5em]"
              />
            </div>
            <div className="flex gap-3 pt-4">
               <button onClick={onBack} className="flex-1 bg-white/5 py-4 rounded-2xl text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest">Voltar</button>
               <button onClick={handleLogin} className="flex-[2] bg-[#7B2CBF] py-4 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-[#7B2CBF33]">Acessar</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleExportData = (type?: 'all' | 'careers' | 'generator') => {
    let data: any = {};
    let filename = `fox_backup_${new Date().toISOString().split('T')[0]}.json`;

    if (type === 'careers') {
      data = { careers: storage.getImportedCareers() };
      filename = `fox_careers_${Date.now()}.json`;
    } else if (type === 'generator') {
      data = { 
        challenges: storage.getOfficialChallenges(),
        genLists: storage.getGenLists()
      };
      filename = `fox_generator_${Date.now()}.json`;
    } else {
      data = {
        tips: storage.getCommunityTips(),
        ideas: storage.getLibraryIdeas(),
        challenges: storage.getOfficialChallenges(),
        careers: storage.getImportedCareers(),
        genLists: storage.getGenLists(),
        settings: storage.getAppSettings()
      };
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        let importedCount = 0;

        if (data.tips) { storage.setCommunityTips(data.tips); importedCount++; }
        if (data.ideas) { storage.setLibraryIdeas(data.ideas); importedCount++; }
        if (data.challenges) { storage.setOfficialChallenges(data.challenges); importedCount++; }
        if (data.careers) { storage.setImportedCareers(data.careers); importedCount++; }
        if (data.genLists) { storage.setGenLists(data.genLists); importedCount++; }
        if (data.settings) { storage.setAppSettings(data.settings); importedCount++; }
        
        refreshData();
        alert(`Sucesso! ${importedCount} categorias de dados foram atualizadas.`);
      } catch (err) {
        alert('Erro ao processar arquivo JSON. Verifique a estrutura.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const moderateTip = (tipId: string, status: 'approved' | 'rejected') => {
    const updatedTips = tips.map(t => t.id === tipId ? { ...t, status, moderatedBy: user.name } : t);
    storage.setCommunityTips(updatedTips);
    setTips(updatedTips);
  };

  const promoteToOfficial = (tip: CommunityTip) => {
    const newIdea: LibraryIdea = {
      id: Math.random().toString(36).substr(2, 9),
      category: 'community',
      title: tip.title,
      content: tip.content,
      authorName: tip.authorName
    };
    
    const updatedLibrary = [...library, newIdea];
    storage.setLibraryIdeas(updatedLibrary);
    setLibrary(updatedLibrary);
    moderateTip(tip.id, 'approved');
  };

  const recentActivity = [
    { text: 'João criou um novo save', icon: <Save size={10}/>, time: '2 min atrás' },
    { text: 'Nova denúncia enviada', icon: <AlertTriangle size={10} className="text-red-500"/>, time: '15 min atrás' },
    { text: 'Novo log v3.0 publicado', icon: <Terminal size={10}/>, time: '1h atrás' },
    { text: 'Ricardo tornou-se ADM', icon: <Shield size={10}/>, time: '3h atrás' }
  ];

  return (
    <div className="space-y-8 pb-32 px-2">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl text-[#A0A0A0] hover:text-white transition-all"><ChevronLeft size={20} /></button>
          <div className="space-y-1">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Painel CEO</h2>
            <div className="flex items-center gap-2">
               <ShieldCheck size={12} className="text-[#7B2CBF]" />
               <span className="text-[10px] text-[#7B2CBF] font-black uppercase tracking-[0.2em]">CEO ACCESS</span>
            </div>
          </div>
        </div>
        <div className="bg-[#7B2CBF]/10 border border-[#7B2CBF33] p-3 rounded-2xl">
           <Zap size={24} className="text-[#7B2CBF]" />
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-1">
        <TabBtn active={activePanel === 'dashboard'} onClick={() => setActivePanel('dashboard')} icon={<LayoutDashboard size={12}/>}>Resumo</TabBtn>
        <TabBtn active={activePanel === 'users'} onClick={() => setActivePanel('users')} icon={<Users size={12}/>}>Managers</TabBtn>
        <TabBtn active={activePanel === 'careers'} onClick={() => setActivePanel('careers')} icon={<Globe2 size={12}/>}>Carreiras</TabBtn>
        <TabBtn active={activePanel === 'library'} onClick={() => setActivePanel('library')} icon={<Zap size={12}/>}>Gerador</TabBtn>
        <TabBtn active={activePanel === 'tips'} onClick={() => setActivePanel('tips')} icon={<MessageSquare size={12}/>}>Moderação</TabBtn>
        <TabBtn active={activePanel === 'categories'} onClick={() => setActivePanel('categories')} icon={<List size={12}/>}>Categorias</TabBtn>
        <TabBtn active={activePanel === 'system'} onClick={() => setActivePanel('system')} icon={<Save size={12}/>}>Backup</TabBtn>
        <TabBtn active={activePanel === 'reports'} onClick={() => setActivePanel('reports')} icon={<ShieldAlert size={12}/>}>Reports</TabBtn>
      </div>

      {/* Panel Content Rendering */}
      <div className="space-y-6">
        {activePanel === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <StatsOverviewCard icon={<Users size={18}/>} label="Usuários" val={users.length} desc="+5 hoje" />
              <StatsOverviewCard icon={<AlertTriangle size={18}/>} label="Denúncias" val={reports.filter(r => r.status === 'pending').length} color={reports.filter(r => r.status === 'pending').length > 0 ? "text-red-500" : "text-[#A0A0A0]"} alert={reports.filter(r => r.status === 'pending').length > 0} />
              <StatsOverviewCard icon={<Save size={18}/>} label="Saves" val={saves.length} />
              <StatsOverviewCard icon={<Globe2 size={18}/>} label="Carreiras" val={careers.length} />
              <StatsOverviewCard icon={<MousePointer2 size={18}/>} label="Gerações" val={154} desc="Hoje" />
              <StatsOverviewCard icon={<Terminal size={18}/>} label="Logs" val={logs.length} />
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#A0A0A0] flex items-center gap-2">
                    <Activity size={14} className="text-[#7B2CBF]" /> Atividade Recente
                  </h3>
               </div>
               <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-[32px] overflow-hidden">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="flex items-center justify-between p-5 border-b border-[#2D2D2D] last:border-0 hover:bg-white/5 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-black/40 rounded-xl">{act.icon}</div>
                          <p className="text-xs font-bold text-white uppercase italic">{act.text}</p>
                       </div>
                       <span className="text-[8px] font-black text-[#666] uppercase">{act.time}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2 px-2">
                  <Settings size={14} className="text-[#7B2CBF]" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#A0A0A0]">Configurações Rápidas</h3>
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <QuickToggle label="Gerador Ativo" active={appSettings.generatorActive} onToggle={() => handleUpdateSettings({ generatorActive: !appSettings.generatorActive })} />
                  <QuickToggle label="Uploads Permitidos" active={appSettings.uploadsAllowed} onToggle={() => handleUpdateSettings({ uploadsAllowed: !appSettings.uploadsAllowed })} />
               </div>
            </div>
          </motion.div>
        )}

        {activePanel === 'users' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col gap-4 px-2">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-widest text-[#A0A0A0]">Listagem de Managers</h3>
                   <span className="text-[9px] font-black text-[#7B2CBF]">{users.length} Registros</span>
                </div>
                <div className="flex gap-2">
                   <div className="flex-1 relative">
                      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Procurar manager..." className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-2xl px-10 py-4 text-[10px] text-white outline-none focus:border-[#7B2CBF] uppercase font-black" />
                      <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
                   </div>
                   <select value={filterRole} onChange={e => setFilterRole(e.target.value as any)} className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-2xl px-4 text-[10px] text-white font-black uppercase">
                      <option value="all">TODOS</option>
                      <option value={UserRole.USER}>MEMBER</option>
                      <option value={UserRole.ADM}>ADM</option>
                      <option value={UserRole.CEO}>CEO</option>
                   </select>
                </div>
             </div>

             <div className="space-y-3">
                {users
                  .filter(u => (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())) && (filterRole === 'all' || u.role === filterRole))
                  .map(u => (
                  <div key={u.id} className="bg-[#1A1A1A] border border-[#2D2D2D] p-5 rounded-[32px] space-y-4 group">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/5">
                              {u.photoUrl ? <img src={u.photoUrl} className="w-full h-full object-cover" /> : <UserIcon className="m-auto text-white/10" />}
                           </div>
                           <div className="space-y-0.5">
                              <h4 className="text-[11px] font-black uppercase text-white tracking-widest">{u.name}</h4>
                              <p className="text-[9px] text-[#444] font-bold uppercase">{u.email}</p>
                           </div>
                        </div>
                        <span className={`text-[7px] font-black px-2 py-0.5 rounded-lg border ${u.role === UserRole.CEO ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-white/5 text-[#A0A0A0] border-white/10'}`}>{u.role}</span>
                     </div>
                     {u.role !== UserRole.CEO && (
                       <div className="flex gap-2 pt-2">
                          <button onClick={() => handleUpdateUserRole(u.id, u.role === UserRole.USER ? UserRole.ADM : UserRole.USER)} className="flex-1 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-[#7B2CBF]/10 hover:text-[#7B2CBF] transition-all">
                             {u.role === UserRole.USER ? 'Dar ADM' : 'Remover ADM'}
                          </button>
                          <button onClick={() => handleResetLevel(u.id)} className="flex-1 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-white/10 transition-all">
                             Resetar Nível
                          </button>
                          <button onClick={() => handleDeleteUser(u.id)} className="p-3 bg-red-500/5 text-red-500/30 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                             <Trash2 size={14} />
                          </button>
                       </div>
                     )}
                  </div>
                ))}
             </div>
          </div>
        )}

        {activePanel === 'careers' && (
           <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xs font-black uppercase tracking-widest text-[#A0A0A0]">Gestão de Carreiras</h3>
                 <div className="flex gap-2">
                    <button onClick={() => { setIsAddingNew(true); setEditingItem({ title: '', content: '', category: 'discovery', authorName: 'Fox Team' }); }} className="p-2 bg-[#7B2CBF] text-white rounded-lg"><Plus size={14}/></button>
                    <button onClick={() => handleExportData('careers')} className="p-2 bg-white/5 rounded-lg"><Download size={14}/></button>
                 </div>
              </div>
              <div className="space-y-3">
                 {library.map(idea => (
                    <div key={idea.id} className="bg-[#1A1A1A] border border-[#2D2D2D] p-5 rounded-[24px] flex items-center justify-between group">
                       <div className="space-y-1">
                          <span className="text-[7px] font-black uppercase text-[#7B2CBF] px-2 py-0.5 bg-[#7B2CBF]/10 rounded-lg">{idea.category}</span>
                          <h4 className="text-[10px] font-black uppercase text-white tracking-widest">{idea.title}</h4>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => setEditingItem(idea)} className="p-2 bg-white/5 rounded-lg text-[#A0A0A0]"><Edit3 size={12} /></button>
                          <button onClick={() => handleDeleteItem(idea.id, 'idea')} className="p-2 bg-red-500/5 rounded-lg text-red-500/30"><Trash2 size={12} /></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activePanel === 'categories' && (
          <div className="space-y-8 animate-fade-in">
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xs font-black uppercase tracking-widest text-[#7B2CBF]">Categorias de Carreira</h3>
                   <button className="p-2 bg-[#7B2CBF]/10 text-[#7B2CBF] rounded-lg"><Plus size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   {managedEras.map((cat, i) => (
                      <div key={i} className="bg-[#1A1A1A] border border-[#2D2D2D] p-4 rounded-2xl flex items-center justify-between">
                         <span className="text-[9px] font-black uppercase text-white">{cat}</span>
                         <button className="text-[#444] hover:text-red-500"><X size={12}/></button>
                      </div>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xs font-black uppercase tracking-widest text-[#7B2CBF]">Jogos Disponíveis</h3>
                   <button className="p-2 bg-[#7B2CBF]/10 text-[#7B2CBF] rounded-lg"><Plus size={14}/></button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                   {managedGames.map((game, i) => (
                      <div key={i} className="bg-[#1A1A1A] border border-[#2D2D2D] p-4 rounded-2xl flex items-center justify-between">
                         <span className="text-[9px] font-black uppercase text-white">{game}</span>
                         <button className="text-[#444] hover:text-red-500"><X size={12}/></button>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activePanel === 'system' && (
           <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#7B2CBF]/10 to-transparent border border-[#7B2CBF33] p-8 rounded-[40px] flex flex-col items-center gap-6">
                 <div className="text-center space-y-2">
                    <h3 className="text-xl font-black uppercase italic text-white italic">Backup de Sistema</h3>
                    <p className="text-[10px] text-[#A0A0A0] font-black uppercase">Segurança e migração de dados</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 w-full">
                    <button onClick={() => handleExportData()} className="bg-white/5 border border-white/5 py-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-[#7B2CBF]/10 transition-all font-black text-[10px] uppercase">
                       <Download size={20} className="text-[#7B2CBF]" /> Exportar Tudo
                    </button>
                    <label className="bg-white/5 border border-white/5 py-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-[#7B2CBF]/10 transition-all font-black text-[10px] uppercase cursor-pointer">
                       <Upload size={20} className="text-[#7B2CBF]" /> Importar Tudo
                       <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                    </label>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Editing Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#0F0F0F] border border-[#2D2D2D] w-full max-w-sm rounded-[40px] p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black uppercase italic text-[#7B2CBF]">{isAddingNew ? 'Novo Item' : 'Editar Item'}</h3>
                <button onClick={() => { setEditingItem(null); setIsAddingNew(false); }} className="text-[#A0A0A0]"><X size={20}/></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[#444] ml-2">Título</label>
                  <input 
                    value={editingItem.title || editingItem.name || ''} 
                    onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full bg-black/40 border border-[#2D2D2D] rounded-2xl px-6 py-4 text-xs text-white uppercase font-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[#444] ml-2">Conteúdo / Descrição</label>
                  <textarea 
                    value={editingItem.content || editingItem.description || ''} 
                    onChange={e => setEditingItem({...editingItem, content: e.target.value})}
                    className="w-full bg-black/40 border border-[#2D2D2D] rounded-2xl px-6 py-4 text-xs text-white min-h-[100px] font-medium"
                  />
                </div>
                
                <button 
                  onClick={() => {
                    if (editingItem.id) {
                      if (activePanel === 'tips') storage.setCommunityTips(tips.map(t => t.id === editingItem.id ? editingItem : t));
                      else if (activePanel === 'careers') storage.setLibraryIdeas(library.map(i => i.id === editingItem.id ? editingItem : i));
                      else if (activePanel === 'library') storage.setOfficialChallenges(challenges.map(c => c.id === editingItem.id ? editingItem : c));
                    } else {
                      const newId = Math.random().toString(36).substr(2, 9);
                      const itemWithId = { ...editingItem, id: newId };
                      if (activePanel === 'careers') storage.setLibraryIdeas([...library, itemWithId]);
                      else if (activePanel === 'library') storage.setOfficialChallenges([...challenges, itemWithId]);
                    }
                    setEditingItem(null);
                    setIsAddingNew(false);
                    refreshData();
                  }}
                  className="w-full bg-[#7B2CBF] text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-[#7B2CBF33] active:scale-95 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function StatsOverviewCard({ icon, label, val, desc, color, alert }: any) {
  return (
    <div className={`bg-[#1A1A1A] border ${alert ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-[#2D2D2D]'} p-6 rounded-[32px] space-y-2 group transition-all hover:border-[#7B2CBF44]`}>
      <div className={`flex justify-between items-center ${color || 'text-[#7B2CBF]'}`}>
         <div className="p-2 bg-black/40 rounded-xl">{icon}</div>
         {desc && <span className="text-[7px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">{desc}</span>}
      </div>
      <div className="space-y-0.5">
        <p className="text-3xl font-black text-white italic">{val}</p>
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#A0A0A0]">{label}</span>
      </div>
    </div>
  );
}

function TabBtn({ children, active, onClick, icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 shrink-0 ${active ? 'bg-[#7B2CBF] border-[#7B2CBF] text-white shadow-lg shadow-[#7B2CBF33] translate-y-[-2px]' : 'bg-[#1A1A1A] border-[#2D2D2D] text-[#A0A0A0] opacity-60 hover:opacity-100'}`}
    >
      {icon} {children}
    </button>
  );
}

function QuickToggle({ label, active, onToggle }: any) {
  return (
    <button 
      onClick={onToggle}
      className="bg-[#1A1A1A] border border-[#2D2D2D] p-5 rounded-3xl flex justify-between items-center transition-all hover:border-[#7B2CBF33] text-left group"
    >
      <span className="text-[9px] font-black uppercase tracking-widest text-[#A0A0A0] group-hover:text-white transition-colors">{label}</span>
      <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${active ? 'bg-[#7B2CBF]' : 'bg-[#2D2D2D]'}`}>
         <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'left-6' : 'left-1'}`}></div>
      </div>
    </button>
  );
}
