import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';

/**
 * GET /api/auth/me
 * Obtiene la información del usuario autenticado actual
 */
export async function GET() {
  try {
    const { user, profile, error } = await getCurrentUser();

    if (error || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      data: {
        user,
        profile
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error getting current user:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}
