// =============================================================================
// Seed — Import real JSON data from Junta de Castilla y León
// =============================================================================

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Strip HTML tags from descriptions
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&iexcl;/g, '¡')
    .replace(/&iquest;/g, '¿')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeHtmlEntities(value: string | null | undefined) {
  if (!value) return null;

  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

async function main() {
  console.log('🔄 Importing real JSON data...');

  // ─── Events ─────────────────────────────────────────────────────────────────
  const eventosPath = path.join(process.cwd(), 'eventos-de-la-agenda-cultural-categorizados-y-geolocalizados.json');
  const eventosRaw = JSON.parse(fs.readFileSync(eventosPath, 'utf-8'));
  console.log(`  Found ${eventosRaw.length} events`);

  let eventCount = 0;
  for (const record of eventosRaw) {
    const f = record.fields;
    if (!f || !f.latitud || !f.longitud || !f.titulo) continue;

    try {
      await prisma.evento.upsert({
        where: { id: record.recordid },
        update: {
          titulo: f.titulo,
          descripcion: stripHtml(f.descripcion || ''),
          categoria: f.categoria || 'Otros',
          fechaInicio: f.fecha_inicio ? new Date(f.fecha_inicio) : new Date(),
          fechaFin: f.fecha_fin ? new Date(f.fecha_fin) : null,
          latitud: f.latitud,
          longitud: f.longitud,
          localidad: f.nombre_localidad || '',
          provincia: f.nombre_provincia || '',
          imagen: normalizeHtmlEntities(f.imagen_evento),
          enlace: normalizeHtmlEntities(f.enlace_contenido),
          fuente: 'json_jcyl',
          fuenteId: f.identificador || record.recordid,
        },
        create: {
          id: record.recordid,
          titulo: f.titulo,
          descripcion: stripHtml(f.descripcion || ''),
          categoria: f.categoria || 'Otros',
          fechaInicio: f.fecha_inicio ? new Date(f.fecha_inicio) : new Date(),
          fechaFin: f.fecha_fin ? new Date(f.fecha_fin) : null,
          latitud: f.latitud,
          longitud: f.longitud,
          localidad: f.nombre_localidad || '',
          provincia: f.nombre_provincia || '',
          imagen: normalizeHtmlEntities(f.imagen_evento),
          enlace: normalizeHtmlEntities(f.enlace_contenido),
          fuente: 'json_jcyl',
          fuenteId: f.identificador || record.recordid,
        },
      });
      eventCount++;
    } catch (e) {
      // Skip duplicates / errors silently
    }
  }
  console.log(`  ✅ Imported ${eventCount} events`);

  // ─── Discounts (Colaboradores) ──────────────────────────────────────────────
  const descPath = path.join(process.cwd(), 'colaboradores-carnet-joven.json');
  const descRaw = JSON.parse(fs.readFileSync(descPath, 'utf-8'));
  console.log(`  Found ${descRaw.length} discount partners`);

  let descCount = 0;
  for (const record of descRaw) {
    if (!record.colaborador) continue;

    // Create a slug-based ID from the name
    const id = record.colaborador
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);

    try {
      await prisma.descuento.upsert({
        where: { id },
        update: {
          nombre: record.colaborador,
          descripcion: `Colaborador del Carné Joven CyL — ${record.actividad}`,
          categoria: record.actividad || 'Servicios',
          enlace: normalizeHtmlEntities(record.web_colab),
          direccion: '',
          localidad: '',
          provincia: '',
          latitud: 0,
          longitud: 0,
          fuente: 'json_jcyl',
          fuenteId: id,
        },
        create: {
          id,
          nombre: record.colaborador,
          descripcion: `Colaborador del Carné Joven CyL — ${record.actividad}`,
          categoria: record.actividad || 'Servicios',
          enlace: normalizeHtmlEntities(record.web_colab),
          direccion: '',
          localidad: '',
          provincia: '',
          latitud: 0,
          longitud: 0,
          fuente: 'json_jcyl',
          fuenteId: id,
        },
      });
      descCount++;
    } catch (e) {
      // Skip duplicates / errors silently
    }
  }
  console.log(`  ✅ Imported ${descCount} discount partners`);
  console.log('✨ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
