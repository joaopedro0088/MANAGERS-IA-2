/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Save, AppLog, GeneratorItem, UserRole, Report, UserStats, OfficialChallenge, ImportedCareer, CommunityTip, LibraryIdea, AppSettings } from './types';
import { LIMITS } from './constants';
import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
  USERS: 'fox_managers_users',
  SAVES: 'fox_managers_saves',
  LOGS: 'fox_managers_logs',
  GEN_LISTS: 'fox_managers_gen_lists',
  OFFICIAL_CHALLENGES: 'fox_managers_official_challenges',
  IMPORTED_CAREERS: 'fox_managers_imported_careers',
  COMMUNITY_TIPS: 'fox_managers_community_tips',
  LIBRARY_IDEAS: 'fox_managers_library_ideas',
  REPORTS: 'fox_managers_reports',
  CURRENT_USER_ID: 'fox_managers_auth_id',
  USER_STATS: 'fox_managers_user_stats',
  SETTINGS: 'fox_managers_app_settings',
};

// Initial Data for Mock
const INITIAL_LOGS: AppLog[] = [
  {
    id: '2',
    title: 'PES 2026 Mod & Novas Metas',
    version: '1.2.0',
    date: Date.now(),
    type: 'update',
    description: 'Atualizamos o PES para o Mod 2026 e adicionamos o sistema de metas e diário no save!',
  },
  {
    id: '1',
    title: 'Lançamento Alpha',
    version: '1.0.0',
    date: Date.now() - 86400000,
    type: 'news',
    description: 'Boas-vindas ao Fox Managers! O melhor companheiro para sua carreira gamer.',
  }
];

const INITIAL_GEN_LISTS: GeneratorItem[] = [
  {
    id: 'fm',
    game: 'Football Manager',
    teams: [
      'Wrexham|Inglaterra|Pequeno|Base/Youth', 
      'Schalke 04|Alemanha|Médio|Rebuild', 
      'Botafogo|Brasil|Grande|Normal', 
      'Como 1907|Itália|Médio|Rebuild', 
      'Sunderland|Inglaterra|Médio|Rebuild',
      'Deportivo La Coruña|Espanha|Pequeno|Rebuild', 
      'Saint-Étienne|França|Médio|Rebuild', 
      'Parma|Itália|Médio|Rebuild',
      'Málaga CF|Espanha|Pequeno|Rebuild', 
      'Hamburger SV|Alemanha|Médio|Rebuild', 
      'Bragantino|Brasil|Grande|Normal', 
      'Palermo|Itália|Pequeno|Rebuild',
      'Grêmio|Brasil|Grande|Normal',
      'Internacional|Brasil|Grande|Normal',
      'Vasco da Gama|Brasil|Grande|Rebuild'
    ],
    objectives: [
      'Ganhar a Champions em 5 anos', 'Apenas jogadores da base (Youth Only)', 
      'Tríplice Coroa Nacional', 'Ter o artilheiro da liga por 3 anos seguidos',
      'Pagar todas as dívidas do clube', 'Vencer o Mundial de Clubes',
      'Dominar o país com um elenco sub-23', 'Invencibilidade na liga',
      'Moneyball: Contratar apenas jogadores via análise de dados'
    ],
    rules: [
      'Sem transferências na 1ª janela', 'Vender estrela todo ano', 
      'Máximo 3 estrangeiros no 11 inicial', 'Apenas contratações domésticas',
      'Teto salarial rigoroso', 'Nenhum jogador acima de 30 anos',
      'Vender qualquer jogador se a oferta for 2x o valor', 'Apenas jogadores livres (Free Agents)'
    ],
    styles: [
      'Gegenpress (4-2-3-1)', 'Vertical Tiki-Taka (4-3-3)', 'Catenaccio (5-3-2)', 
      'Fluid Counter-Attack', 'Control Possession', 'Wing Play (4-4-2)',
      'Route One', 'Tiki-Taka (4-1-2-3)'
    ],
  },
  {
    id: 'wsc',
    game: 'World Soccer Champs',
    teams: [
      'Red Bull Bragantino|Brasil|Grande|Normal', 
      'Leicester City|Inglaterra|Médio|Normal', 
      'Girona|Espanha|Médio|Normal', 
      'Bayer Leverkusen|Alemanha|Grande|Normal', 
      'Inter Miami|Outros|Médio|Normal', 
      'Al-Nassr|Outros|Grande|Normal', 
      'Union Berlin|Alemanha|Médio|Normal', 
      'Brighton|Inglaterra|Médio|Normal', 
      'Sporting CP|Portugal|Grande|Normal'
    ],
    objectives: [
      'Ser campeão invicto', 'Levar um time da 4ª divisão ao topo (Road to Glory)',
      'Ganhar a Copa do Mundo com país pequeno', 'Ter elenco 100% nacional',
      'Caçador de Lendas: Ter pelo menos 2 lendas no 11 inicial',
      'Evolução Máxima: Chegar em 2040 com o mesmo clube'
    ],
    rules: [
      'Não usar olheiros (Scouts)', 'Vender jogadores com 85+ de rating',
      'Sempre aceitar a primeira oferta de venda', 'Treinar apenas jogadores < 21 anos',
      'Desafio das Lendas: Não comprar jogadores, apenas usar o que o jogo der'
    ],
    styles: ['Equilibrado', 'Muito Ofensivo', 'Contra-Ataque', 'Totalmente Defensivo'],
  },
  {
    id: 'fifa',
    game: 'EA Sports FC (FIFA)',
    teams: [
      'Real Madrid|Espanha|Grande|Normal', 
      'Newcastle|Inglaterra|Grande|Normal', 
      'Ipswich Town|Inglaterra|Pequeno|Normal',
      'Paris-FC|França|Pequeno|Rebuild', 
      'Dortmund|Alemanha|Grande|Base/Youth', 
      'Santos FC|Brasil|Grande|Rebuild',
      'Palmeiras|Brasil|Grande|Normal',
      'São Paulo|Brasil|Grande|Normal',
      'Flamengo|Brasil|Grande|Normal',
      'Corinthians|Brasil|Grande|Rebuild'
    ],
    objectives: [
      'Ganhar a tríplice coroa na 1ª temporada', 'Subir 3 divisões sem gastar €',
      'Contratar o Mbappé e o Haaland no mesmo time', 'Ter o melhor CT da Europa'
    ],
    rules: [
      'Simular todos os jogos fora de casa', 'Não usar a Rede Global de Transferências',
      'Vender quem pedir aumento', 'Apenas 1 contratação por janela'
    ],
    styles: ['4-2-3-1 (Meta)', '4-3-2-1 (Ataque Rápido)', '5-2-2-1 (Retranca)', '3-4-2-1'],
  },
  {
    id: 'pes',
    game: 'PES 2026 (Mod Atualizado)',
    teams: [
      'Master League Origins|Outros|Pequeno|Normal', 
      'AC Milan|Itália|Grande|Rebuild',
      'Flamengo|Brasil|Grande|Normal', 
      'Barcelona|Espanha|Grande|Rebuild'
    ],
    objectives: [
      'Vencer a Master League com os jogadores padrões', 'Ranking #1 de Clubes',
      'Treinar um "Regen" até 95 de rating'
    ],
    rules: [
      'Não renovar com jogadores acima de 32 anos', 'Dificuldade Lenda Obrigatória',
      'Apenas jogadores com Face Real'
    ],
    styles: ['Contra-Ataque Rápido', 'Posse de Bola', 'Por Fora', 'Passe Longo'],
  }
];

const INITIAL_CHALLENGES: OfficialChallenge[] = [
  {
    id: 'ch_1',
    title: 'Desafio do Mês: O Retorno do Rei',
    description: 'Assuma o Santos no EA FC e vença a Libertadores usando apenas jogadores da base em 3 temporadas.',
    difficulty: 'Month',
    rewardIcon: '👑',
    type: 'youth-only'
  },
  {
    id: 'ch_2',
    title: 'Austeridade Total',
    description: 'Vença a Champions no FM com um saldo de transferências positivo de €200m.',
    difficulty: 'Extreme',
    rewardIcon: '💎',
    type: 'no-signing'
  }
];

const INITIAL_CAREERS: ImportedCareer[] = [
  // ... (existing)
];

const INITIAL_IDEAS: LibraryIdea[] = [
  {
    id: 'i1',
    category: 'teams',
    title: 'Como 1907',
    content: 'Dinheiro na Itália e reforços experientes (Fàbregas era) - Rebuild perfeito.'
  },
  {
    id: 'i2',
    category: 'teams',
    title: 'Málaga CF',
    content: 'Gigante caído na Espanha lutando para voltar ao topo.'
  }
];

const INITIAL_TIPS: CommunityTip[] = [
  {
    id: 't1',
    authorId: 'user_1',
    authorName: 'Fox Bot',
    title: 'Contrate Olheiros Bons',
    content: 'No FM, a qualidade dos olheiros define 80% do seu sucesso a longo prazo.',
    status: 'approved',
    game: 'Football Manager',
    publishedToCommunity: true,
    createdAt: Date.now()
  }
];

export const storage = {
  getAppSettings: (): AppSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const DEFAULT_SETTINGS: AppSettings = {
      generatorActive: true,
      uploadsAllowed: true,
      logsPublic: true,
      reportsEnabled: true,
      dailySaveLimit: 1,
      dailyGenLimit: 10,
      theme: 'dark',
      language: 'pt'
    };
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },

  setAppSettings: (settings: AppSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  setUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
  
  getSaves: (): Save[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVES) || '[]'),
  setSaves: (saves: Save[]) => localStorage.setItem(STORAGE_KEYS.SAVES, JSON.stringify(saves)),
  
  getLogs: (): AppLog[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || JSON.stringify(INITIAL_LOGS)),
  setLogs: (logs: AppLog[]) => localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs)),
  
  getGenLists: (): GeneratorItem[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.GEN_LISTS) || JSON.stringify(INITIAL_GEN_LISTS)),
  setGenLists: (lists: GeneratorItem[]) => localStorage.setItem(STORAGE_KEYS.GEN_LISTS, JSON.stringify(lists)),
  
  getOfficialChallenges: (): OfficialChallenge[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFICIAL_CHALLENGES) || JSON.stringify(INITIAL_CHALLENGES)),
  setOfficialChallenges: (ch: OfficialChallenge[]) => localStorage.setItem(STORAGE_KEYS.OFFICIAL_CHALLENGES, JSON.stringify(ch)),

  getImportedCareers: (): ImportedCareer[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.IMPORTED_CAREERS) || JSON.stringify(INITIAL_CAREERS)),
  setImportedCareers: (careers: ImportedCareer[]) => localStorage.setItem(STORAGE_KEYS.IMPORTED_CAREERS, JSON.stringify(careers)),

  getCommunityTips: (): CommunityTip[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITY_TIPS) || JSON.stringify(INITIAL_TIPS)),
  setCommunityTips: (tips: CommunityTip[]) => localStorage.setItem(STORAGE_KEYS.COMMUNITY_TIPS, JSON.stringify(tips)),

  getLibraryIdeas: (): LibraryIdea[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.LIBRARY_IDEAS) || JSON.stringify(INITIAL_IDEAS)),
  setLibraryIdeas: (ideas: LibraryIdea[]) => localStorage.setItem(STORAGE_KEYS.LIBRARY_IDEAS, JSON.stringify(ideas)),

  getReports: (): Report[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]'),
  setReports: (reports: Report[]) => localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports)),

  getCurrentUser: (): User | null => {
    const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!id) return null;
    return storage.getUsers().find(u => u.id === id) || null;
  },

  setCurrentUser: (user: User) => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) users[index] = user;
    else users.push(user);
    storage.setUsers(users);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
  },

  getUserStats: (userId: string): UserStats => {
    const allStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_STATS) || '{}');
    const defaultStats: UserStats = {
      generationsToday: 0,
      lastGenerationDate: '',
      savesCreatedThisMonth: 0,
      lastSaveDate: '',
    };
    return allStats[userId] || defaultStats;
  },

  updateUserStats: (userId: string, stats: Partial<UserStats>) => {
    const allStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_STATS) || '{}');
    allStats[userId] = { ...storage.getUserStats(userId), ...stats };
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(allStats));
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    await supabase.auth.signOut();
  },
};
