import Image from 'next/image';
import Link from 'next/link';
import { CategoryIcon } from '@/components/Icons';
import EventCards from '@/components/EventCards';
import { getHomeCatalogo } from '@/lib/catalogo';
import { formatearFecha, formatLocation, getDomainLabel } from '@/lib/utils';
import styles from './page.module.css';

const EVENT_LABELS: Record<string, string> = {
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

const DISCOUNT_LABELS: Record<string, string> = {
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

function toPercent(value: number | null) {
  if (!value) return null;
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function getDiscountSummary(localidad: string, provincia: string, enlace?: string | null) {
  return formatLocation(localidad, provincia) ?? getDomainLabel(enlace) ?? 'Mas informacion en la ficha';
}

export default async function HomePage() {
  const {
    eventosTotal,
    descuentosTotal,
    eventosConImagen,
    descuentosDestacados,
  } = await getHomeCatalogo();

  const spotlight = eventosConImagen[0];
  const agenda = eventosConImagen.slice(1);

  return (
    <div className={styles.planazoPage}>
      <section className={styles.heroPanel}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Datos publicos de Castilla y Leon para descubrir actividades y servicios</span>
          <h1>
            CyL Joven
            <span>agenda de actividades, descuentos y propuestas de interes juvenil.</span>
          </h1>
          <p className={styles.heroText}>
            Datos abiertos de Castilla y Leon convertidos en una guia movil
            para encontrar eventos, ofertas y planes cercanos.
          </p>
          <div className={styles.heroActions}>
            <Link href="/mapa" className="btn-pill btn-primary">
              Ver mapa de eventos
            </Link>
            <Link href="/descuentos" className="btn-pill btn-secondary">
              Consultar descuentos
            </Link>
          </div>
        </div>

        <div className={styles.heroSide}>
          <div className={styles.heroStats}>
            <article className={styles.statCard}>
              <strong>{eventosTotal}</strong>
              <span>eventos disponibles</span>
            </article>
            <article className={styles.statCard}>
              <strong>{descuentosTotal}</strong>
              <span>descuentos disponibles</span>
            </article>
            <article className={styles.statCard}>
              <strong>9</strong>
              <span>provincias de Castilla y Leon</span>
            </article>
          </div>

          {spotlight ? (
            <article className={styles.spotlightCard}>
              <Image
                src={spotlight.imagen ?? ''}
                alt={spotlight.titulo}
                width={1200}
                height={800}
                className={styles.spotlightImage}
              />
              <div className={styles.spotlightOverlay} />
              <div className={styles.spotlightContent}>
                <span className={styles.spotlightTag}>
                  <CategoryIcon category={EVENT_LABELS[spotlight.categoria] ?? spotlight.categoria} size={14} />
                  {EVENT_LABELS[spotlight.categoria] ?? spotlight.categoria}
                </span>
                <h2>{spotlight.titulo}</h2>
                <p>
                  {spotlight.localidad}, {spotlight.provincia} -{' '}
                  {formatearFecha(spotlight.fechaInicio.toISOString(), {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          <section className={styles.sectionCard}>
            <div className={styles.sectionHead}>
              <div>
                <span className={styles.sectionKicker}>Agenda cultural</span>
                <h3>Eventos destacados</h3>
              </div>
              <Link href="/mapa" className={styles.sectionLink}>
                Ir al mapa
              </Link>
            </div>

            <EventCards eventos={agenda} />
          </section>

          <section className={`${styles.sectionCard} ${styles.warmCard}`}>
            <div className={styles.sectionHead}>
              <div>
                <span className={styles.sectionKicker}>Carnet Joven</span>
                <h3>Descuentos destacados</h3>
              </div>
              <Link href="/descuentos" className={styles.sectionLink}>
                Ver todo
              </Link>
            </div>

            <div className={styles.discountGrid}>
              {descuentosDestacados.slice(0, 3).map((descuento) => (
                <article key={descuento.id} className={styles.discountCard}>
                  <div className={styles.discountTop}>
                    <span className={styles.miniTag}>
                      <CategoryIcon category={DISCOUNT_LABELS[descuento.categoria] ?? descuento.categoria} size={14} />
                      {DISCOUNT_LABELS[descuento.categoria] ?? descuento.categoria}
                    </span>
                    {descuento.porcentaje ? (
                      <strong>-{toPercent(descuento.porcentaje)}%</strong>
                    ) : (
                      <strong>Oferta</strong>
                    )}
                  </div>
                  <h4>{descuento.nombre}</h4>
                  <p>{getDiscountSummary(descuento.localidad, descuento.provincia, descuento.enlace)}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
