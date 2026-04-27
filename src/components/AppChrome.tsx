'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import NavegacionMovil from '@/components/NavegacionMovil';
import ToggleTema from '@/components/ToggleTema';
import styles from './AppChrome.module.css';

export default function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 24) {
        setHeaderVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      if (currentY > lastScrollY.current + 10) {
        setHeaderVisible(false);
      } else if (currentY < lastScrollY.current - 10) {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`${styles.topbar} ${headerVisible ? styles.visible : styles.hidden}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark} />
          <span className={styles.brandCopy}>
            <strong>CyL Joven</strong>
            <small>agenda, descuentos y actividades</small>
          </span>
        </Link>
        <ToggleTema />
      </header>

      <main className={`main-content ${styles.appShell}`}>{children}</main>
      <NavegacionMovil />
    </>
  );
}
