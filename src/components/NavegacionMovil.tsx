'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';
import { IconHome, IconInfo, IconMap, IconTag } from '@/components/Icons';
import ToggleTema from '@/components/ToggleTema';

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
        <div className="dock-tabs">
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
                  <Icon size={28} strokeWidth={isActive ? 2.25 : 1.7} />
                </span>
              </Link>
            );
          })}
        </div>
        <span className="dock-separator" aria-hidden="true" />
        <ToggleTema />
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
          padding: 0 calc(5vw) calc(18px + env(safe-area-inset-bottom, 0px));
          pointer-events: none;
        }

        .nav-dock {
          --item-size: 58px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          width: min(90vw, 460px);
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 42px;
          transition: border-radius 0.45s ease;
          pointer-events: auto;
          background: color-mix(in srgb, var(--bg-secondary) 56%, rgba(35, 48, 56, 0.42));
          backdrop-filter: blur(18px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
            0 14px 42px rgba(45, 35, 25, 0.32),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
        }

        :global(body.panel-open) .bottom-nav {
          z-index: 8000;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 768px) {
          :global(body.panel-open) .bottom-nav {
            padding: 0;
          }

          :global(body.panel-open) .nav-dock {
            width: 100%;
            border-radius: 0 !important;
            border-bottom: none;
            border-left: none;
            border-right: none;
            box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.18);
          }
        }

        /* En desktop seguimos con el estilo flotante pero con radius de arriba a cero */
        @media (min-width: 769px) {
          :global(body.panel-open) .nav-dock {
            border-radius: 0 0 42px 42px !important;
          }
        }



        .dock-tabs {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, var(--item-size));
          flex: 1;
          justify-content: space-between;
          align-items: center;
          height: var(--item-size);
        }

        .nav-indicator {
          position: absolute;
          top: 50%;
          left: calc(
            var(--active-index) * ((100% - var(--item-size)) / 3)
          );
          width: var(--item-size);
          height: var(--item-size);
          border-radius: 54% 46% 51% 49% / 48% 55% 45% 52%;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.07)),
            color-mix(in srgb, var(--brand-accent) 14%, transparent);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow:
            0 10px 24px color-mix(in srgb, var(--brand-accent) 12%, transparent),
            inset 0 1px 6px rgba(255, 255, 255, 0.12),
            inset 0 -10px 18px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          transform: translateY(-50%);
          transition: left 0.4s, border-radius 0.4s ease;
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

        .dock-separator {
          margin-left: 10px;
          margin-right: 10px;
          width: 1px;
          height: 34px;
          background: color-mix(in srgb, var(--text-primary) 18%, transparent);
        }

        .nav-dock :global(.toggle-tema) {
          min-width: 62px;
          width: 62px;
          height: 62px;
          padding: 0;
          margin-right: 10px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--surface-strong) 58%, transparent);
        }

        @media (min-width: 768px) {
          .nav-dock {
            --item-size: 70px;
          }

          .nav-dock :global(.toggle-tema) {
            min-width: 70px;
            width: 70px;
            height: 70px;
          }
        }

        @media (max-width: 480px) {
          .nav-dock {
            --item-size: 52px;
            width: min(90vw, 460px);
            padding: 9px 12px;
          }

          .nav-dock :global(.toggle-tema) {
            min-width: 54px;
            width: 54px;
            height: 54px;
          }
        }
      `}</style>
    </nav>
  );
}
