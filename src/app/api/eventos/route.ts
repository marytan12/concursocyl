// =============================================================================
// API Route: /api/eventos
// =============================================================================
// Queries events with optional filters: categoria, provincia, desde, hasta, busqueda
// Returns paginated results sorted by date.

import { NextRequest } from 'next/server';
import { getEventosCatalogo } from '@/lib/catalogo';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoria = searchParams.get('categoria');
    const provincia = searchParams.get('provincia');
    const desde = searchParams.get('desde');
    const hasta = searchParams.get('hasta');
    const busqueda = searchParams.get('busqueda');
    const limite = Math.min(Number(searchParams.get('limite') || 100), 500);

    const { data: eventos, total } = await getEventosCatalogo({
      categoria,
      provincia,
      desde,
      hasta,
      busqueda,
      limite,
    });

    return Response.json({ data: eventos, total });
  } catch (error) {
    console.error('Error querying eventos:', error);
    return Response.json(
      { error: 'Error al obtener eventos', data: [], total: 0 },
      { status: 500 }
    );
  }
}
