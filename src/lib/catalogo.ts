import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '@/lib/prisma';

const EVENTOS_FILE = 'eventos-de-la-agenda-cultural-categorizados-y-geolocalizados.json';
const DESCUENTOS_FILE = 'colaboradores-carnet-joven.json';

type EventoRecord = {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  fechaInicio: Date;
  fechaFin: Date | null;
  latitud: number;
  longitud: number;
  localidad: string;
  provincia: string;
  imagen: string | null;
  enlace: string | null;
};

type DescuentoRecord = {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  direccion: string;
  latitud: number;
  longitud: number;
  localidad: string;
  provincia: string;
  porcentaje: number | null;
  enlace: string | null;
};

type EventosParams = {
  categoria?: string | null;
  provincia?: string | null;
  desde?: string | null;
  hasta?: string | null;
  busqueda?: string | null;
  limite?: number;
};

type DescuentosParams = {
  categoria?: string | null;
  provincia?: string | null;
  localidad?: string | null;
  busqueda?: string | null;
  limite?: number;
};

let eventosCache: Promise<EventoRecord[]> | undefined;
let descuentosCache: Promise<DescuentoRecord[]> | undefined;

export async function getEventosCatalogo(params: EventosParams = {}) {
  const limite = Math.min(params.limite ?? 100, 500);

  try {
    const where = buildEventosWhere(params);
    const [eventos, total] = await Promise.all([
      prisma.evento.findMany({
        where,
        orderBy: { fechaInicio: 'asc' },
        take: limite,
      }),
      prisma.evento.count({ where }),
    ]);

    if (total > 0) {
      return { data: eventos, total, source: 'database' as const };
    }
  } catch (error) {
    console.error('Fallo consultando eventos en base de datos, usando JSON local:', error);
  }

  const eventos = await getBundledEventos();
  const filtrados = filterEventos(eventos, params);
  return { data: filtrados.slice(0, limite), total: filtrados.length, source: 'bundled' as const };
}

export async function getDescuentosCatalogo(params: DescuentosParams = {}) {
  const limite = Math.min(params.limite ?? 100, 500);

  try {
    const where = buildDescuentosWhere(params);
    const [descuentos, total] = await Promise.all([
      prisma.descuento.findMany({
        where,
        orderBy: { nombre: 'asc' },
        take: limite,
      }),
      prisma.descuento.count({ where }),
    ]);

    if (total > 0) {
      return { data: descuentos, total, source: 'database' as const };
    }
  } catch (error) {
    console.error('Fallo consultando descuentos en base de datos, usando JSON local:', error);
  }

  const descuentos = await getBundledDescuentos();
  const filtrados = filterDescuentos(descuentos, params);
  return { data: filtrados.slice(0, limite), total: filtrados.length, source: 'bundled' as const };
}

export async function getHomeCatalogo() {
  try {
    const [
      eventosTotal,
      descuentosTotal,
      eventosConImagen,
      descuentosDestacados,
      categoriasEvento,
      categoriasDescuento,
    ] = await Promise.all([
      prisma.evento.count(),
      prisma.descuento.count(),
      prisma.evento.findMany({
        where: { imagen: { not: null } },
        orderBy: { fechaInicio: 'asc' },
        take: 4,
        select: {
          id: true,
          titulo: true,
          categoria: true,
          fechaInicio: true,
          fechaFin: true,
          localidad: true,
          provincia: true,
          imagen: true,
          descripcion: true,
          enlace: true,
        },
      }),
      prisma.descuento.findMany({
        orderBy: [{ porcentaje: 'desc' }, { nombre: 'asc' }],
        take: 6,
        select: {
          id: true,
          nombre: true,
          categoria: true,
          localidad: true,
          provincia: true,
          porcentaje: true,
          enlace: true,
        },
      }),
      prisma.evento.groupBy({
        by: ['categoria'],
        _count: { categoria: true },
        orderBy: { _count: { categoria: 'desc' } },
        take: 5,
      }),
      prisma.descuento.groupBy({
        by: ['categoria'],
        _count: { categoria: true },
        orderBy: { _count: { categoria: 'desc' } },
        take: 5,
      }),
    ]);

    if (eventosTotal > 0 || descuentosTotal > 0) {
      return {
        eventosTotal,
        descuentosTotal,
        eventosConImagen,
        descuentosDestacados,
        categoriasEvento,
        categoriasDescuento,
        source: 'database' as const,
      };
    }
  } catch (error) {
    console.error('Fallo cargando portada desde base de datos, usando JSON local:', error);
  }

  const [eventos, descuentos] = await Promise.all([getBundledEventos(), getBundledDescuentos()]);
  const eventosConImagen = eventos
    .filter((evento) => Boolean(evento.imagen))
    .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime())
    .slice(0, 4)
    .map((evento) => ({
      id: evento.id,
      titulo: evento.titulo,
      categoria: evento.categoria,
      fechaInicio: evento.fechaInicio,
      fechaFin: evento.fechaFin,
      localidad: evento.localidad,
      provincia: evento.provincia,
      imagen: evento.imagen,
      descripcion: evento.descripcion,
      enlace: evento.enlace,
    }));

  const descuentosDestacados = descuentos
    .slice()
    .sort((a, b) => {
      const porcentajeA = a.porcentaje ?? -1;
      const porcentajeB = b.porcentaje ?? -1;
      if (porcentajeB !== porcentajeA) return porcentajeB - porcentajeA;
      return a.nombre.localeCompare(b.nombre, 'es');
    })
    .slice(0, 6)
    .map((descuento) => ({
      id: descuento.id,
      nombre: descuento.nombre,
      categoria: descuento.categoria,
      localidad: descuento.localidad,
      provincia: descuento.provincia,
      porcentaje: descuento.porcentaje,
      enlace: descuento.enlace,
    }));

  return {
    eventosTotal: eventos.length,
    descuentosTotal: descuentos.length,
    eventosConImagen,
    descuentosDestacados,
    categoriasEvento: buildCategorySummary(eventos.map((evento) => evento.categoria)),
    categoriasDescuento: buildCategorySummary(descuentos.map((descuento) => descuento.categoria)),
    source: 'bundled' as const,
  };
}

function buildEventosWhere(params: EventosParams) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (params.categoria) where.categoria = params.categoria;
  if (params.provincia) where.provincia = params.provincia;
  if (params.desde || params.hasta) {
    where.fechaInicio = {};
    if (params.desde) where.fechaInicio.gte = new Date(params.desde);
    if (params.hasta) where.fechaInicio.lte = new Date(params.hasta);
  }
  if (params.busqueda) {
    where.OR = [
      { titulo: { contains: params.busqueda } },
      { descripcion: { contains: params.busqueda } },
      { localidad: { contains: params.busqueda } },
    ];
  }

  return where;
}

function buildDescuentosWhere(params: DescuentosParams) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (params.categoria) where.categoria = params.categoria;
  if (params.provincia) where.provincia = params.provincia;
  if (params.localidad) where.localidad = { contains: params.localidad };
  if (params.busqueda) {
    where.OR = [
      { nombre: { contains: params.busqueda } },
      { descripcion: { contains: params.busqueda } },
      { localidad: { contains: params.busqueda } },
      { direccion: { contains: params.busqueda } },
    ];
  }

  return where;
}

async function getBundledEventos() {
  eventosCache ??= readBundledJson(EVENTOS_FILE).then((records) =>
    records
      .map((record) => {
        const fields = getFields(record);
        const id = String(record.recordid ?? fields.id_evento ?? fields.titulo ?? '');
        const latitud = Number(fields.latitud ?? 0);
        const longitud = Number(fields.longitud ?? 0);
        const titulo = String(fields.titulo ?? '').trim();

        if (!id || !titulo || latitud === 0 || longitud === 0) return null;

        return {
          id,
          titulo,
          descripcion: stripHtml(String(fields.descripcion ?? '')),
          categoria: String(fields.categoria ?? 'Otros'),
          fechaInicio: fields.fecha_inicio ? new Date(String(fields.fecha_inicio)) : new Date(),
          fechaFin: fields.fecha_fin ? new Date(String(fields.fecha_fin)) : null,
          latitud,
          longitud,
          localidad: String(fields.nombre_localidad ?? ''),
          provincia: String(fields.nombre_provincia ?? ''),
          imagen: normalizeHtmlEntities(fields.imagen_evento),
          enlace: normalizeHtmlEntities(fields.enlace_contenido),
        } satisfies EventoRecord;
      })
      .filter((evento): evento is EventoRecord => Boolean(evento))
  );

  return eventosCache;
}

async function getBundledDescuentos() {
  descuentosCache ??= readBundledJson(DESCUENTOS_FILE).then((records) =>
    records
      .map((record) => {
        const nombre = String(record.colaborador ?? '').trim();
        if (!nombre) return null;

        const descuento: DescuentoRecord = {
          id: slugify(nombre),
          nombre,
          descripcion: `Colaborador del Carnet Joven CyL — ${String(record.actividad ?? 'Servicios')}`,
          categoria: String(record.actividad ?? 'Servicios'),
          direccion: '',
          latitud: 0,
          longitud: 0,
          localidad: '',
          provincia: '',
          porcentaje: null,
          enlace: normalizeHtmlEntities(record.web_colab),
        };

        return descuento;
      })
      .filter((descuento): descuento is DescuentoRecord => descuento !== null)
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  );

  return descuentosCache;
}

function filterEventos(eventos: EventoRecord[], params: EventosParams) {
  const busqueda = params.busqueda?.toLowerCase().trim();
  const desde = params.desde ? new Date(params.desde) : null;
  const hasta = params.hasta ? new Date(params.hasta) : null;

  return eventos.filter((evento) => {
    if (params.categoria && evento.categoria !== params.categoria) return false;
    if (params.provincia && evento.provincia !== params.provincia) return false;
    if (desde && evento.fechaInicio < desde) return false;
    if (hasta && evento.fechaInicio > hasta) return false;
    if (
      busqueda &&
      ![evento.titulo, evento.descripcion, evento.localidad].some((value) =>
        value.toLowerCase().includes(busqueda)
      )
    ) {
      return false;
    }
    return true;
  });
}

function filterDescuentos(descuentos: DescuentoRecord[], params: DescuentosParams) {
  const busqueda = params.busqueda?.toLowerCase().trim();
  const localidad = params.localidad?.toLowerCase().trim();

  return descuentos.filter((descuento) => {
    if (params.categoria && descuento.categoria !== params.categoria) return false;
    if (params.provincia && descuento.provincia !== params.provincia) return false;
    if (localidad && !descuento.localidad.toLowerCase().includes(localidad)) return false;
    if (
      busqueda &&
      ![descuento.nombre, descuento.descripcion, descuento.localidad, descuento.direccion].some((value) =>
        value.toLowerCase().includes(busqueda)
      )
    ) {
      return false;
    }
    return true;
  });
}

function buildCategorySummary(categorias: string[]) {
  return [...categorias.reduce((acc, categoria) => {
    acc.set(categoria, (acc.get(categoria) ?? 0) + 1);
    return acc;
  }, new Map<string, number>()).entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([categoria, total]) => ({
      categoria,
      _count: { categoria: total },
    }));
}

async function readBundledJson(fileName: string) {
  const filePath = path.join(process.cwd(), fileName);
  const contents = await readFile(filePath, 'utf-8');
  return JSON.parse(contents) as Record<string, unknown>[];
}

function getFields(record: Record<string, unknown>) {
  if (record.fields && typeof record.fields === 'object') {
    return record.fields as Record<string, unknown>;
  }
  return record;
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&iexcl;/g, '!')
    .replace(/&iquest;/g, '?')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeHtmlEntities(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;

  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}
