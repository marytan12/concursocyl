import NavegacionMovil from '@/components/NavegacionMovil';
import styles from './AppChrome.module.css';

export default function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className={`main-content ${styles.appShell}`}>{children}</main>
      <NavegacionMovil />
    </>
  );
}
