import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validación mejorada
  if (!supabaseUrl || !supabaseKey || 
      supabaseUrl.includes('placeholder') || 
      supabaseKey.includes('placeholder')) {
    console.warn(
      '⚠️ Supabase no está configurado correctamente.\n' +
      'Por favor, configura tus credenciales en .env.local\n' +
      'Lee README_SETUP.md para más información.'
    )
    // Retornar un cliente con valores dummy para evitar crashes
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}