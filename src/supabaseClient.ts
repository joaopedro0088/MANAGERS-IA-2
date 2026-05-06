import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseUrl = rawUrl?.replace(/\/rest\/v1\/?$/, ''); // Remove suffix if present
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Authentication will fall back to local storage or show errors.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

/**
 * Verifica se a conexão com o banco está ativa e as tabelas acessíveis
 */
export async function checkSupabaseConnection() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('placeholder')) {
    return { ok: false, message: 'Falta Configurar API no Settings' };
  }
  
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
        if (error.code === '42P01') return { ok: false, message: 'Tabela Profiles não existe (Rode o SQL)' };
        if (error.message.includes('apikey')) return { ok: false, message: 'Chave API Inválida' };
        throw error;
    }
    return { ok: true, message: 'Fox Cloud: Ativa e Segura' };
  } catch (err: any) {
    return { ok: false, message: 'Erro: ' + (err.message || 'Conexão Falhou') };
  }
}
