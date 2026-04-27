// =============================================================================
// CyL App — TypeScript Interfaces
// =============================================================================

/** Evento cultural (concierto, exposición, teatro, etc.) */
export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: CategoriaEvento;
  fechaInicio: string;    // ISO date string
  fechaFin?: string;      // ISO date string, optional
  latitud: number;
  longitud: number;
  localidad: string;
  provincia: Provincia;
  imagen?: string;        // URL to event image
  enlace?: string;        // External link
  fuente: string;         // Data source identifier
  createdAt?: string;
  updatedAt?: string;
}

/** Descuento para jóvenes con Carné Joven */
export interface Descuento {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaDescuento;
  direccion: string;
  latitud: number;
  longitud: number;
  localidad: string;
  provincia: Provincia;
  porcentaje?: number;    // Discount percentage (e.g., 10 = 10%)
  enlace?: string;
  fuente: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Categorías disponibles para eventos */
export type CategoriaEvento =
  | 'conciertos'
  | 'exposiciones'
  | 'teatro'
  | 'cine'
  | 'festivales'
  | 'talleres'
  | 'deportes'
  | 'gastronomia'
  | 'otros';

/** Categorías disponibles para descuentos */
export type CategoriaDescuento =
  | 'restauracion'
  | 'ocio'
  | 'cultura'
  | 'deporte'
  | 'transporte'
  | 'formacion'
  | 'salud'
  | 'moda'
  | 'tecnologia'
  | 'otros';

/** Provincias de Castilla y León */
export type Provincia =
  | 'Ávila'
  | 'Burgos'
  | 'León'
  | 'Palencia'
  | 'Salamanca'
  | 'Segovia'
  | 'Soria'
  | 'Valladolid'
  | 'Zamora';

/** Filtros para la búsqueda de eventos */
export interface FiltrosEvento {
  categoria?: CategoriaEvento;
  provincia?: Provincia;
  desde?: string;  // ISO date
  hasta?: string;  // ISO date
  busqueda?: string;
}

/** Filtros para la búsqueda de descuentos */
export interface FiltrosDescuento {
  categoria?: CategoriaDescuento;
  provincia?: Provincia;
  localidad?: string;
  busqueda?: string;
}

/** API response wrapper */
export interface ApiResponse<T> {
  data: T;
  total: number;
  error?: string;
}

/** Marker data for map display */
export interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  tipo: 'evento' | 'descuento';
  titulo: string;
  categoria: string;
  descripcion: string;
  extra?: Record<string, unknown>;
}
