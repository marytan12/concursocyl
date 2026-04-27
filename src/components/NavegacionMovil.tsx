'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';
import { IconHome, IconInfo, IconMap, IconTag } from '@/components/Icons';

const TABS = [
  { href: '/', label: 'Inicio', icon: IconHome },
  { href: '/mapa', label: 'Mapa', icon: IconMap },
  { href: '/descuentos', label: 'Ofertas', icon: IconTag },
  { href: '/info', label: 'Info', icon: IconInfo },
] as const;

export default function NavegacionMovil() {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    TABS.findIndex((tab) => (tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)))
  );

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegacion principal">
      <div className="nav-dock" style={{ '--active-index': activeIndex } as CSSProperties & Record<string, number>}>
        <span className="nav-indicator" aria-hidden="true" />
        {TABS.map((tab, index) => {
          const isActive = index === activeIndex;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`dock-item ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
            >
              <span className="dock-icon">
                <Icon size={22} strokeWidth={isActive ? 2.25 : 1.7} />
              </span>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 5000;
          display: flex;
          justify-content: center;
          padding: 0 20px calc(18px + env(safe-area-inset-bottom, 0px));
          pointer-events: none;
        }

        .nav-dock {
          --item-size: 54px;
          --dock-gap: 18px;
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--dock-gap);
          padding: 10px 14px;
          border-radius: 34px;
          pointer-events: auto;
          background: color-mix(in srgb, var(--bg-secondary) 56%, rgba(35, 48, 56, 0.42));
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
            0 14px 42px rgba(45, 35, 25, 0.32),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
        }

        .nav-indicator {
          position: absolute;
          top: 10px;
          left: 14px;
          width: var(--item-size);
          height: var(--item-size);
          border-radius: 50% 48% 55% 45% / 45% 55% 46% 54%;
          background:
            radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.72), transparent 22%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.1));
          border: 1px solid rgba(255, 255, 255, 0.34);
          box-shadow:
            0 12px 28px rgba(201, 95, 60, 0.22),
            inset 0 0 18px rgba(255, 255, 255, 0.22);
          backdrop-filter: blur(10px) saturate(170%);
          -webkit-backdrop-filter: blur(10px) saturate(170%);
          transform: translateX(calc(var(--active-index) * (var(--item-size) + var(--dock-gap))));
          transition: transform 0.42s cubic-bezier(0.175, 0.885, 0.32, 1.18), border-radius 0.42s ease;
        }

        .dock-item {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--item-size);
          height: var(--item-size);
          border-radius: 999px;
          text-decoration: none;
          color: color-mix(in srgb, var(--text-primary) 54%, transparent);
          transition: color 0.2s ease, transform 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .dock-item:hover {
          color: var(--brand-accent-strong);
          transform: translateY(-2px);
        }

        .dock-item.active {
          color: var(--brand-accent-strong);
        }

        .dock-item:active {
          transform: scale(0.92);
        }

        .dock-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 480px) {
          .nav-dock {
            --item-size: 48px;
            --dock-gap: 14px;
            padding: 9px 12px;
          }
        }
      `}</style>
    </nav>
  );
}
