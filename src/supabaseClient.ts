import { createClient } from '@supabase/supabase-js';

const rawUrl = 'https://mcejlzadhmmpxwugjixk.supabase.co/rest/v1/';
const supabaseAnonKey = 'sb_publishable_X-8znn7mTiZfB5JV0cXsXw_zpHeYJsB';

const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Verifica se a conexão com o banco está ativa e as tabelas acessíveis
 */
export async function checkSupabaseConnection() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return { ok: false, message: 'Falta Configurar API no Settings' };
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        return { ok: false, message: 'Tabela Profiles não existe (Rode o SQL)' };
      }

      if (error.message.toLowerCase().includes('apikey')) {
        return { ok: false, message: 'Chave API Inválida' };
      }

      throw error;
    }

    return { ok: true, message: 'Fox Cloud: Ativa e Segura' };

  } catch (err: any) {
    return {
      ok: false,
      message: 'Erro: ' + (err.message || 'Conexão Falhou')
    };
  }
}