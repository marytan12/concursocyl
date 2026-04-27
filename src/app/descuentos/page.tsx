'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ListaDescuentos from '@/components/ListaDescuentos';
import TarjetaDescuento from '@/components/TarjetaDescuento';
import type { MarkerData } from '@/types';

const MapaInteractivo = dynamic(() => import('@/components/MapaInteractivo'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="shimmer" style={{ width: '100%', height: '100%' }} />
    </div>
  ),
});

interface Descuento {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  direccion: string;
  latitud: number;
  longitud: number;
  localidad: string;
  provincia: string;
  porcentaje?: number | null;
  enlace?: string | null;
}

export default function DescuentosPage() {
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [selectedDescuento, setSelectedDescuento] = useState<Descuento | null>(null);
  const [vista, setVista] = useState<'lista' | 'mapa'>('lista');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDescuentos = async () => {
      try {
        const res = await fetch('/api/descuentos');
        const data = await res.json();
        setDescuentos(data.data || []);
      } catch (err) {
        console.error('Error fetching descuentos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDescuentos();
  }, []);

  const markers: MarkerData[] = descuentos.map((d) => ({
    id: d.id,
    lat: d.latitud,
    lng: d.longitud,
    tipo: 'descuento' as const,
    titulo: d.nombre,
    categoria: d.categoria,
    descripcion: d.descripcion,
    extra: d as unknown as Record<string, unknown>,
  }));

  const handleMarkerClick = useCallback(
    (marker: MarkerData) => {
      const desc = descuentos.find((d) => d.id === marker.id);
      if (desc) setSelectedDescuento(desc);
    },
    [descuentos]
  );

  return (
    <div className="descuentos-page">
      <header className="page-header">
        <div className="header-content">
          <div className="brand-badge">
            <span className="eyebrow">Exclusivo Carnet Joven</span>
          </div>
          <h1>
            Descuentos que te <span className="text-gradient">mueven</span>
          </h1>
          <p className="page-description">
            Ahorra en tus planes favoritos: cultura, ocio, viajes y mucho más por toda Castilla y León.
          </p>
        </div>

        <div className="header-actions">
          <div className="stats-pill">
            <span className="count">{loading ? '...' : descuentos.length}</span>
            <span className="label">ofertas activas</span>
          </div>

          <div className="view-selector">
            <button
              className={`selector-btn ${vista === 'lista' ? 'active' : ''}`}
              onClick={() => setVista('lista')}
              title="Ver lista"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button
              className={`selector-btn ${vista === 'mapa' ? 'active' : ''}`}
              onClick={() => setVista('mapa')}
              title="Ver mapa"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="page-content">
        {loading ? (
          <div className="loading-state">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="shimmer loading-card" />
            ))}
          </div>
        ) : (
          <div className="view-wrapper">
            {vista === 'lista' ? (
              <ListaDescuentos descuentos={descuentos} onSelect={(d) => setSelectedDescuento(d)} />
            ) : (
              <div className="map-container-wrapper glass-card">
                <MapaInteractivo markers={markers} onMarkerClick={handleMarkerClick} />
              </div>
            )}
          </div>
        )}
      </main>

      {selectedDescuento ? (
        <TarjetaDescuento
          descuento={selectedDescuento}
          variant="detail"
          onClose={() => setSelectedDescuento(null)}
        />
      ) : null}

      <style jsx>{`
        .descuentos-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 20px 100px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          min-height: 100dvh;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          padding: 12px 4px;
        }

        .header-content {
          flex: 1;
        }

        .brand-badge {
          display: inline-block;
          margin-bottom: 12px;
        }

        .eyebrow {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brand-accent-strong);
          background: color-mix(in srgb, var(--brand-accent) 12%, transparent);
          padding: 6px 14px;
          border-radius: 99px;
          border: 1px solid color-mix(in srgb, var(--brand-accent) 20%, transparent);
        }

        .page-header h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .text-gradient {
          background: var(--gradient-hero);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .page-description {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 48ch;
          line-height: 1.5;
        }

        .header-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
        }

        .stats-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          background: var(--surface-warm);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .stats-pill .count {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .stats-pill .label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          line-height: 1.2;
          width: 60px;
        }

        .view-selector {
          position: relative;
          display: flex;
          background: var(--surface-strong);
          padding: 4px;
          border-radius: 99px;
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-soft);
        }

        .selector-btn {
          position: relative;
          z-index: 1;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.3s;
        }

        .selector-btn.active {
          color: var(--brand-accent-strong);
        }

        .selector-pill {
          position: absolute;
          top: 4px;
          left: 0;
          width: 40px;
          height: 40px;
          background: var(--bg-primary);
          border-radius: 99px;
          border: 1px solid var(--border-active);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .page-content {
          flex: 1;
        }

        .map-container-wrapper {
          height: calc(100dvh - 360px);
          min-height: 500px;
          overflow: hidden;
          padding: 12px;
          background: var(--bg-glass);
        }

        .loading-state {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .loading-card {
          height: 220px;
          border-radius: 32px;
        }

        @media (max-width: 860px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .stats-pill {
            padding: 8px 16px;
          }

          .stats-pill .count {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .descuentos-page {
            padding: 16px 12px 90px;
            gap: 24px;
          }

          .page-header h1 {
            font-size: 2.2rem;
          }

          .header-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .stats-pill {
            justify-content: center;
          }

          .view-selector {
            align-self: center;
          }
        }
      `}</style>
    </div>
  );
}
