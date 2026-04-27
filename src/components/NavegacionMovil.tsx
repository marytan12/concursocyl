'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconInfo, IconMap, IconTag } from '@/components/Icons';

const TABS = [
  { href: '/', label: 'Inicio', icon: IconHome },
  { href: '/mapa', label: 'Mapa', icon: IconMap },
  { href: '/descuentos', label: 'Ofertas', icon: IconTag },
  { href: '/info', label: 'Info', icon: IconInfo },
] as const;

export default function NavegacionMovil() {
  const pathname = usePathname();

  const activeIndex = TABS.findIndex((tab) =>
    tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
  );

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegacion principal">
      <div className="nav-dock">
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
                <Icon size={30} strokeWidth={isActive ? 2.5 : 1.6} />
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
          z-index: 5000; /* Extra high for map visibility */
          display: flex;
          justify-content: center;
          padding: 0 24px calc(24px + env(safe-area-inset-bottom, 0px));
          pointer-events: none;
        }

        .nav-dock {
          display: flex;
          align-items: center;
          gap: 48px;
          padding: 20px 56px;
          border-radius: 36px;
          pointer-events: auto;

          /* Enhanced glassmorphism with theme adaptation */
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-secondary) 90%, rgba(45, 35, 25, 0.1)) 0%,
            color-mix(in srgb, var(--bg-secondary) 80%, rgba(60, 45, 30, 0.1)) 100%
          );
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow:
            0 12px 48px rgba(45, 35, 25, 0.5),
            0 4px 16px rgba(60, 45, 30, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .dock-item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 72px;
          border-radius: 24px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
        }

        .dock-item:hover {
          color: rgba(240, 135, 74, 0.9);
          transform: translateY(-2px);
          background: rgba(240, 135, 74, 0.1);
        }







        .dock-icon {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }



        .dock-item.active {
          color: var(--brand-accent-strong, #f0874a);
        }



        .dock-item:active {
          transform: scale(0.9);
        }

        @media (max-width: 480px) {
          .nav-dock {
            gap: 40px;
            padding: 16px 44px;
            border-radius: 32px;
          }

          .dock-item {
            width: 78px;
            height: 70px;
          }



          .dock-item:hover {
            transform: none; /* Disable hover on mobile */
          }
        }

          .dock-item {
            width: 60px;
            height: 50px;
          }



          .dock-item:hover {
            transform: none; /* Disable hover on mobile */
          }
        }
      `}</style>
    </nav>
  );
}
