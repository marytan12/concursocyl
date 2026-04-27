import type { CategoriaDescuento, CategoriaEvento } from '@/types';

export const CATEGORIAS_EVENTO: Record<CategoriaEvento, string> = {
  conciertos: 'Conciertos',
  exposiciones: 'Exposiciones',
  teatro: 'Teatro',
  cine: 'Cine',
  festivales: 'Festivales',
  talleres: 'Talleres',
  deportes: 'Deportes',
  gastronomia: 'Gastronomia',
  otros: 'Otros',
};

export const CATEGORIAS_DESCUENTO: Record<CategoriaDescuento, string> = {
  restauracion: 'Restauracion',
  ocio: 'Ocio',
  cultura: 'Cultura',
  deporte: 'Deporte',
  transporte: 'Transporte',
  formacion: 'Formacion',
  salud: 'Salud',
  moda: 'Moda',
  tecnologia: 'Tecnologia',
  otros: 'Otros',
};

export const PROVINCIAS = [
  'Ávila',
  'Burgos',
  'León',
  'Palencia',
  'Salamanca',
  'Segovia',
  'Soria',
  'Valladolid',
  'Zamora',
] as const;

export const CYL_CENTER: [number, number] = [41.65, -4.73];
export const CYL_ZOOM = 8;

export const COLORES_CATEGORIA: Record<string, string> = {
  conciertos: '#EC4899',
  exposiciones: '#8B5CF6',
  teatro: '#F59E0B',
  cine: '#06B6D4',
  festivales: '#10B981',
  talleres: '#F97316',
  deportes: '#3B82F6',
  gastronomia: '#EF4444',
  restauracion: '#F97316',
  ocio: '#EC4899',
  cultura: '#8B5CF6',
  deporte: '#3B82F6',
  transporte: '#06B6D4',
  formacion: '#10B981',
  salud: '#EF4444',
  moda: '#D946EF',
  tecnologia: '#6366F1',
  otros: '#6B7280',
};

export function formatearFecha(
  dateStr: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const fecha = new Date(dateStr);
  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  });
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatLocation(localidad?: string | null, provincia?: string | null) {
  const parts = [localidad?.trim(), provincia?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

export function getDomainLabel(url?: string | null) {
  if (!url) return null;

  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}
