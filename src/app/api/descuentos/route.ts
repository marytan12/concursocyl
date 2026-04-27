// =============================================================================
// API Route: /api/descuentos
// =============================================================================
// Queries discounts with optional filters: categoria, provincia, localidad, busqueda

import { NextRequest } from 'next/server';
import { getDescuentosCatalogo } from '@/lib/catalogo';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoria = searchParams.get('categoria');
    const provincia = searchParams.get('provincia');
    const localidad = searchParams.get('localidad');
    const busqueda = searchParams.get('busqueda');
    const limite = Math.min(Number(searchParams.get('limite') || 100), 500);

    const { data: descuentos, total } = await getDescuentosCatalogo({
      categoria,
      provincia,
      localidad,
      busqueda,
      limite,
    });

    return Response.json({ data: descuentos, total });
  } catch (error) {
    console.error('Error querying descuentos:', error);
    return Response.json(
      { error: 'Error al obtener descuentos', data: [], total: 0 },
      { status: 500 }
    );
  }
}
