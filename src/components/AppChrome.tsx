import NavegacionMovil from '@/components/NavegacionMovil';
import styles from './AppChrome.module.css';

export default function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#contenido-principal" className={styles.skipLink}>
        Saltar al contenido principal
      </a>
      <main id="contenido-principal" className={`main-content ${styles.appShell}`} tabIndex={-1}>
        {children}
      </main>
      <NavegacionMovil />
    </>
  );
}
