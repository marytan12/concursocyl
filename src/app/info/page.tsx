import Link from 'next/link';
import styles from './page.module.css';

export default function InfoPage() {
  return (
    <div className={styles.infoPage}>
      <section className={styles.heroCard}>
        <span className={styles.eyebrow}>Informacion</span>
        <h1>Sobre la aplicacion</h1>
        <p>
          CyL Joven es una propuesta de aplicacion web orientada a acercar los
          datos publicos de Castilla y Leon a un publico joven mediante una
          experiencia movil clara, visual y util.
        </p>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <span className={styles.sectionKicker}>Desarrollo</span>
          <h2>Autor</h2>
          <p>
            Esta aplicacion ha sido desarrollada por <strong>Mario Rodriguez</strong>.
          </p>
        </article>

        <article className={styles.panel}>
          <span className={styles.sectionKicker}>Objetivo</span>
          <h2>Finalidad</h2>
          <p>
            El proyecto transforma fuentes de datos abiertas en una interfaz que
            permite consultar eventos, descuentos y recursos de interes juvenil
            de una forma mas accesible.
          </p>
        </article>

        <article className={styles.panel}>
          <span className={styles.sectionKicker}>Fuentes</span>
          <h2>Datos utilizados</h2>
          <ul>
            <li>Relacion de eventos de la agenda cultural categorizados y geolocalizados.</li>
            <li>Centros colaboradores y descuentos del Carnet Joven de Castilla y Leon.</li>
            <li>Conjuntos de datos abiertos publicados por la Junta de Castilla y Leon.</li>
          </ul>
        </article>

        <article className={styles.panel}>
          <span className={styles.sectionKicker}>Tecnologia</span>
          <h2>Implementacion</h2>
          <ul>
            <li>Next.js 16 y React 19.</li>
            <li>Prisma para la gestion de datos.</li>
            <li>Leaflet para la visualizacion cartografica.</li>
            <li>Interfaz adaptada prioritariamente a movil.</li>
          </ul>
        </article>

        <article className={styles.panel}>
          <span className={styles.sectionKicker}>Actualizacion</span>
          <h2>Frecuencia de actualizacion</h2>
          <p>
            Los datos de la aplicacion se actualizan automaticamente todos los dias
            a las 03:00 UTC mediante una tarea programada.
          </p>
        </article>

        <article className={styles.panel}>
          <span className={styles.sectionKicker}>Catalogo abierto</span>
          <h2>Datos publicos de referencia</h2>
          <p>
            La aplicacion se apoya en el catalogo de datos abiertos de Castilla y
            Leon y selecciona especialmente los conjuntos con informacion util para
            actividades juveniles, cultura, ocio y descuentos.
          </p>
        </article>
      </section>

      <section className={`${styles.panel} ${styles.finalPanel}`}>
        <span className={styles.sectionKicker}>Navegacion</span>
        <h2>Accesos principales</h2>
        <div className={styles.links}>
          <Link href="/" className="btn-pill btn-secondary">
            Inicio
          </Link>
          <Link href="/mapa" className="btn-pill btn-primary">
            Mapa de eventos
          </Link>
          <Link href="/descuentos" className="btn-pill btn-secondary">
            Descuentos
          </Link>
        </div>
      </section>
    </div>
  );
}
