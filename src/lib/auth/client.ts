import { createClient } from '../supabase/client';
import type { Database, Profile, UserRole } from '../types/database';
import type { AuthError, User } from '@supabase/supabase-js';

/**
 * Hook para obtener el usuario autenticado en el cliente
 */
export async function getCurrentUser() {
  const supabase = createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { user: null, profile: null, error: authError };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    user,
    profile: profile as Profile | null,
    error: profileError
  };
}

/**
 * Inicia sesión con email y password
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Registra un nuevo usuario con rol
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: UserRole = 'client',
  businessName?: string
) {
  const supabase = createClient();
  
  // 1. Crear usuario en auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
        business_name: businessName,
      }
    }
  });

  if (authError || !authData.user) {
    return { data: null, error: authError };
  }

  // 2. Crear perfil
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role,
      business_name: businessName,
    });

  if (profileError) {
    return { data: null, error: profileError };
  }

  return { data: authData, error: null };
}

/**
 * Cierra sesión
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

/**
 * Verifica si el email ya existe
 */
export async function emailExists(email: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email)
    .single();

  return !!data && !error;
}
