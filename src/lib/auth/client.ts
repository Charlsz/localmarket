import { createClient } from '../supabase/client';
import type { Profile, UserRole } from '../types/database';

/**
 * Hook para obtener el usuario autenticado en el cliente
 */
export async function getCurrentUser() {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    // No hay usuario autenticado - esto no es un error, es el estado normal
    return { user: null, profile: null, error: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Si no hay perfil, intentar crearlo
  if (profileError) {
    console.log('Perfil no encontrado para usuario autenticado, creando perfil...');

    try {
      // Intentar crear perfil con la información disponible
      const profileData = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || '',
        role: (user.user_metadata?.role as UserRole) || 'client',
        
        // Información personal
        phone: user.user_metadata?.phone || null,
        bio: user.user_metadata?.bio || null,
        website: user.user_metadata?.website || null,
        
        // Dirección personal
        address_street: user.user_metadata?.address_street || null,
        address_city: user.user_metadata?.address_city || null,
        address_state: user.user_metadata?.address_state || null,
        address_postal_code: user.user_metadata?.address_postal_code || null,
        
        // Información del negocio
        business_name: user.user_metadata?.business_name || null,
        business_description: user.user_metadata?.business_description || null,
        business_phone: user.user_metadata?.business_phone || null,
        business_email: user.user_metadata?.business_email || null,
        business_website: user.user_metadata?.business_website || null,
        business_address: user.user_metadata?.business_address || null,
      };

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (!createError && newProfile) {
        console.log('Perfil creado exitosamente');
        return { user, profile: newProfile as Profile, error: null };
      } else {
        console.error('Error creando perfil:', createError);
        return { user, profile: null, error: createError };
      }
    } catch (createError) {
      console.error('Error creando perfil:', createError);
      return { user, profile: null, error: createError as Error };
    }
  }

  return {
    user,
    profile: profile as Profile | null,
    error: null
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
  businessName?: string,
  additionalData?: {
    // Información personal
    phone?: string;
    bio?: string;
    website?: string;
    
    // Dirección personal
    addressStreet?: string;
    addressCity?: string;
    addressState?: string;
    addressPostalCode?: string;
    
    // Información del negocio
    businessDescription?: string;
    businessPhone?: string;
    businessEmail?: string;
    businessWebsite?: string;
    businessAddress?: string;
  }
) {
  const supabase = createClient();

  try {
    // Crear usuario en auth con metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // Información básica
          full_name: fullName,
          role,
          
          // Información personal
          phone: additionalData?.phone,
          bio: additionalData?.bio,
          website: additionalData?.website,
          
          // Dirección personal
          address_street: additionalData?.addressStreet,
          address_city: additionalData?.addressCity,
          address_state: additionalData?.addressState,
          address_postal_code: additionalData?.addressPostalCode,
          
          // Información del negocio
          business_name: businessName,
          business_description: additionalData?.businessDescription,
          business_phone: additionalData?.businessPhone,
          business_email: additionalData?.businessEmail,
          business_website: additionalData?.businessWebsite,
          business_address: additionalData?.businessAddress,
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return { data: null, error: authError };
    }

    if (!authData.user) {
      return { data: null, error: new Error('No se pudo crear el usuario') };
    }

    // El perfil se crea automáticamente por el trigger en la base de datos
    // En lugar de verificar inmediatamente, confiamos en que el trigger funciona
    // y devolvemos los datos del usuario. El perfil estará disponible en el próximo login.

    console.log('Usuario creado exitosamente:', authData.user.email);

    return { data: authData, error: null };
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return { data: null, error: error as Error };
  }
}/**
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
