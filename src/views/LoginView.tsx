/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Mail, Lock, LogIn, Shield, User as UserIcon } from 'lucide-react';
import { storage } from '../store';
import { UserRole, User } from '../types';
import { supabase } from '../supabaseClient';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const CEOs_EMAILS = [
  'joaopedroalvesbarbbosa08@gmail.com',
  'andreiaalvesbarbosa06@gmail.com'
];

export default function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch profile created by trigger
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw new Error('Perfil não encontrado. Tente novamente.');

        const user: User = {
          ...profile,
          password: '', // Never store password in App State
          favorites: { challenges: [], ideas: [], teams: [], careers: [], tips: [] }, // Load from context or separate table if needed
        };

        proceedWithLogin(user);
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: window.location.origin,
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        if (data.session) {
           setError('Cadastro realizado! Redirecionando...');
           // Trigger handles profile creation, just wait a bit or fetch
           setTimeout(() => handleLogin(e), 1500);
        } else {
           setError('Verifique seu e-mail para confirmar o cadastro!');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const proceedWithLogin = (user: User) => {
    // Override CEO role checks if based on hardcoded emails
    if (CEOs_EMAILS.includes(user.email.toLowerCase()) && user.role !== UserRole.CEO) {
      user.role = UserRole.CEO;
    }
    storage.setCurrentUser(user);
    onLogin(user);
  };

  const handleMockGoogleLogin = async () => {
    setError('Iniciando Google Auth...');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6 bg-[dashed-grid]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#7B2CBF] rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-[#7B2CBF44]">
            <Zap size={32} fill="white" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Fox Managers</h1>
            <p className="text-[10px] text-[#A0A0A0] font-black uppercase tracking-[0.3em]">Sua carreira de elite começa aqui</p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2D2D2D] p-8 rounded-[40px] shadow-2xl space-y-6">
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => { setIsSignup(false); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isSignup ? 'bg-[#7B2CBF] text-white shadow-lg' : 'text-[#A0A0A0]'}`}
            >
              Entrar
            </button>
            <button 
              onClick={() => { setIsSignup(true); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSignup ? 'bg-[#7B2CBF] text-white shadow-lg' : 'text-[#A0A0A0]'}`}
            >
              Registrar
            </button>
          </div>

          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            {isSignup && (
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[#444] ml-2 tracking-widest">Seu Nome de Manager</label>
                <div className="relative">
                   <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Jao_pxx"
                    className="w-full bg-black border border-[#2D2D2D] rounded-2xl px-12 py-4 text-xs text-white focus:border-[#7B2CBF] outline-none"
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"><UserIcon size={16}/></div>
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-[#444] ml-2 tracking-widest">E-mail / Gmail</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="manager@gmail.com"
                  className="w-full bg-black border border-[#2D2D2D] rounded-2xl px-12 py-4 text-xs text-white focus:border-[#7B2CBF] outline-none"
                  required
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"><Mail size={16}/></div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-[#444] ml-2 tracking-widest">Senha</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-[#2D2D2D] rounded-2xl px-12 py-4 text-xs text-white focus:border-[#7B2CBF] outline-none"
                  required
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"><Lock size={16}/></div>
              </div>
            </div>

            {isSignup && (
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[#444] ml-2 tracking-widest">Confirmar Senha</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black border border-[#2D2D2D] rounded-2xl px-12 py-4 text-xs text-white focus:border-[#7B2CBF] outline-none"
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"><Shield size={16}/></div>
                </div>
              </div>
            )}

            {error && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest text-center">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#7B2CBF] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-[#7B2CBF33] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <><LogIn size={18} /> {isSignup ? 'Começar Jornada' : 'Acessar Painel'}</>
              )}
            </button>
          </form>

        </div>

        <div className="text-center opacity-20 hover:opacity-50 transition-opacity">
           <p className="text-[10px] font-black uppercase tracking-[0.4em]">Fox Managers v3.0 Production</p>
        </div>
      </motion.div>
    </div>
  );
}
