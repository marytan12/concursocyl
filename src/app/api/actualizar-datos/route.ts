// =============================================================================
// API Route: /api/actualizar-datos
// =============================================================================
// Handles both automated cron updates (GET) and manual data pushes (POST).
//
// GET  - Triggered by Vercel Cron daily at 03:00 UTC. Fetches data from
//        configured external JSON sources and upserts into the database.
// POST - Accepts JSON body with { eventos: [], descuentos: [] } for manual
//        data imports via the UI refresh button or external integrations.

import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

const LOCAL_EVENTOS_FILE = 'eventos-de-la-agenda-cultural-categorizados-y-geolocalizados.json';
const LOCAL_DESCUENTOS_FILE = 'colaboradores-carnet-joven.json';

async function getPrismaClient() {
  const { prisma } = await import('@/lib/prisma');
  return prisma;
}

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return Response.json(
      { error: 'DATABASE_URL no configurada' },
      { status: 503 }
    );
  }

  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  const token = request.nextUrl.searchParams.get('token');

  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    token !== process.env.CRON_SECRET
  ) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const fuentesEventos = splitSources(process.env.FUENTES_EVENTOS);
    const fuentesDescuentos = splitSources(process.env.FUENTES_DESCUENTOS);

    let eventosActualizados = 0;
    let descuentosActualizados = 0;

    if (fuentesEventos.length > 0) {
      for (const url of fuentesEventos) {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          const data = await res.json();
          eventosActualizados += await upsertEventos(extractRecords(data), url);
        } catch (err) {
          console.error(`Error fetching eventos from ${url}:`, err);
        }
      }
    } else {
      const eventosLocales = await readBundledJson(LOCAL_EVENTOS_FILE);
      eventosActualizados += await upsertEventos(
        extractRecords(eventosLocales),
        'local-bundled-eventos'
      );
    }

    if (fuentesDescuentos.length > 0) {
      for (const url of fuentesDescuentos) {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          const data = await res.json();
          descuentosActualizados += await upsertDescuentos(extractRecords(data), url);
        } catch (err) {
          console.error(`Error fetching descuentos from ${url}:`, err);
        }
      }
    } else {
      const descuentosLocales = await readBundledJson(LOCAL_DESCUENTOS_FILE);
      descuentosActualizados += await upsertDescuentos(
        extractRecords(descuentosLocales),
        'local-bundled-descuentos'
      );
    }

    return Response.json({
      ok: true,
      mensaje: 'Datos actualizados correctamente',
      eventosActualizados,
      descuentosActualizados,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en actualizacion automatica:', error);
    return Response.json(
      { error: 'Error interno al actualizar datos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return Response.json(
      { error: 'DATABASE_URL no configurada' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { eventos = [], descuentos = [] } = body;

    const eventosActualizados = await upsertEventos(eventos, 'manual');
    const descuentosActualizados = await upsertDescuentos(descuentos, 'manual');

    return Response.json({
      ok: true,
      mensaje: 'Datos importados correctamente',
      eventosActualizados,
      descuentosActualizados,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en importacion manual:', error);
    return Response.json(
      { error: 'Error al procesar los datos enviados' },
      { status: 500 }
    );
  }
}

async function upsertEventos(
  eventos: Record<string, unknown>[],
  fuente: string
): Promise<number> {
  const prisma = await getPrismaClient();
  let count = 0;

  for (const evt of eventos) {
    try {
      const raw = getRecordPayload(evt);
      const data = {
        titulo: String(raw.titulo || raw.title || ''),
        descripcion: String(raw.descripcion || raw.description || ''),
        categoria: String(raw.categoria || raw.category || 'otros'),
        fechaInicio: new Date(
          String(raw.fechaInicio || raw.startDate || raw.fecha_inicio || raw.fecha || new Date())
        ),
        fechaFin:
          raw.fechaFin || raw.endDate || raw.fecha_fin
            ? new Date(String(raw.fechaFin || raw.endDate || raw.fecha_fin))
            : null,
        latitud: Number(raw.latitud || raw.lat || 0),
        longitud: Number(raw.longitud || raw.lng || raw.lon || 0),
        localidad: String(raw.localidad || raw.city || raw.nombre_localidad || ''),
        provincia: String(raw.provincia || raw.province || raw.nombre_provincia || ''),
        imagen:
          raw.imagen || raw.image || raw.imagen_evento
            ? normalizeHtmlEntities(String(raw.imagen || raw.image || raw.imagen_evento))
            : null,
        enlace:
          raw.enlace || raw.url || raw.enlace_contenido
            ? normalizeHtmlEntities(String(raw.enlace || raw.url || raw.enlace_contenido))
            : null,
        fuente,
        fuenteId: String(
          raw.id ||
            raw.fuenteId ||
            raw.identificador ||
            raw.id_evento ||
            evt.recordid ||
            `auto-${Date.now()}-${count}`
        ),
      };

      if (!data.titulo || data.latitud === 0 || data.longitud === 0) continue;

      await prisma.evento.upsert({
        where: { fuente_fuenteId: { fuente: data.fuente, fuenteId: data.fuenteId } },
        update: data,
        create: data,
      });

      count++;
    } catch (err) {
      console.error('Error upserting evento:', err);
    }
  }

  return count;
}

async function upsertDescuentos(
  descuentos: Record<string, unknown>[],
  fuente: string
): Promise<number> {
  const prisma = await getPrismaClient();
  let count = 0;

  for (const desc of descuentos) {
    try {
      const raw = getRecordPayload(desc);
      const generatedId = slugify(
        String(raw.colaborador || raw.nombre || raw.name || `auto-${count}`)
      );
      const data = {
        nombre: String(raw.nombre || raw.name || raw.colaborador || ''),
        descripcion: String(
          raw.descripcion ||
            raw.description ||
            (raw.actividad ? `Centro colaborador del Carnet Joven - ${raw.actividad}` : '')
        ),
        categoria: String(raw.categoria || raw.category || raw.actividad || 'otros'),
        direccion: String(raw.direccion || raw.address || ''),
        latitud: Number(raw.latitud || raw.lat || 0),
        longitud: Number(raw.longitud || raw.lng || raw.lon || 0),
        localidad: String(raw.localidad || raw.city || ''),
        provincia: String(raw.provincia || raw.province || ''),
        porcentaje:
          raw.porcentaje || raw.discount ? Number(raw.porcentaje || raw.discount) : null,
        enlace:
          raw.enlace || raw.url || raw.web_colab
            ? normalizeHtmlEntities(String(raw.enlace || raw.url || raw.web_colab))
            : null,
        fuente,
        fuenteId: String(raw.id || raw.fuenteId || generatedId || `auto-${Date.now()}-${count}`),
      };

      if (!data.nombre) continue;

      await prisma.descuento.upsert({
        where: { fuente_fuenteId: { fuente: data.fuente, fuenteId: data.fuenteId } },
        update: data,
        create: data,
      });

      count++;
    } catch (err) {
      console.error('Error upserting descuento:', err);
    }
  }

  return count;
}

function splitSources(value?: string) {
  return value?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];
}

function extractRecords(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];

  if (data && typeof data === 'object') {
    const maybeObject = data as Record<string, unknown>;
    if (Array.isArray(maybeObject.eventos)) return maybeObject.eventos as Record<string, unknown>[];
    if (Array.isArray(maybeObject.descuentos)) {
      return maybeObject.descuentos as Record<string, unknown>[];
    }
    if (Array.isArray(maybeObject.results)) return maybeObject.results as Record<string, unknown>[];
    if (Array.isArray(maybeObject.records)) return maybeObject.records as Record<string, unknown>[];
  }

  return [];
}

function getRecordPayload(record: Record<string, unknown>) {
  if (record.fields && typeof record.fields === 'object') {
    return record.fields as Record<string, unknown>;
  }

  return record;
}

async function readBundledJson(fileName: string) {
  const filePath = path.join(process.cwd(), fileName);
  const contents = await readFile(filePath, 'utf-8');
  return JSON.parse(contents) as unknown;
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

function normalizeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}
