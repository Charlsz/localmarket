import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database, Profile, UserRole } from '../types/database';

/**
 * Crea un cliente de Supabase para Server Components y Route Handlers
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Puede fallar en Route Handlers, pero no es crítico
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Puede fallar en Route Handlers, pero no es crítico
          }
        },
      },
    }
  );
}

/**
 * Obtiene el usuario autenticado y su perfil
 */
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  
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
 * Verifica si el usuario tiene un rol específico
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const { profile } = await getCurrentUser();
  return profile?.role === role;
}

/**
 * Verifica si el usuario es proveedor
 */
export async function isProvider(): Promise<boolean> {
  return hasRole('provider');
}

/**
 * Verifica si el usuario es cliente
 */
export async function isClient(): Promise<boolean> {
  return hasRole('client');
}

/**
 * Verifica si el usuario es admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * Middleware para proteger rutas que requieren autenticación
 */
export async function requireAuth() {
  const { user, profile } = await getCurrentUser();
  
  if (!user || !profile) {
    throw new Error('No autorizado. Debes iniciar sesión.');
  }
  
  return { user, profile };
}

/**
 * Middleware para proteger rutas que requieren un rol específico
 */
export async function requireRole(role: UserRole) {
  const { user, profile } = await requireAuth();
  
  if (profile.role !== role) {
    throw new Error(`No autorizado. Se requiere rol: ${role}`);
  }
  
  return { user, profile };
}

/**
 * Verifica si el usuario es proveedor y está verificado
 */
export async function isVerifiedProvider(): Promise<boolean> {
  const { profile } = await getCurrentUser();
  return profile?.role === 'provider' && profile?.is_verified === true;
}
