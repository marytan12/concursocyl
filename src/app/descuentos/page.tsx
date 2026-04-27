'use client';

import { useEffect, useState } from 'react';
import ListaDescuentos from '@/components/ListaDescuentos';
import TarjetaDescuento from '@/components/TarjetaDescuento';

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

  return (
    <div className="descuentos-page">
      <header className="page-header">
        <div className="header-content">
          <div className="brand-badge">
            <span className="eyebrow">Exclusivo Carnet Joven</span>
          </div>
          <h1>
            Descuentos que te <span className="text-gradient">mueven</span>
            <small>{loading ? '(... Ofertas Activas)' : `(${descuentos.length} Ofertas Activas)`}</small>
          </h1>
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
          <ListaDescuentos descuentos={descuentos} onSelect={(d) => setSelectedDescuento(d)} />
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
          gap: 28px;
          min-height: 100dvh;
        }

        .page-header {
          display: flex;
          align-items: flex-end;
          padding: 12px 4px 0;
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
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 12px;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          line-height: 1.05;
          color: var(--text-primary);
        }

        .page-header h1 small {
          color: var(--brand-accent-strong);
          font-size: clamp(0.92rem, 2vw, 1.05rem);
          font-weight: 800;
          white-space: nowrap;
        }

        .text-gradient {
          background: var(--gradient-hero);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .page-content {
          flex: 1;
        }

        .loading-state {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .loading-card {
          height: 220px;
          border-radius: 28px;
        }

        @media (max-width: 480px) {
          .descuentos-page {
            padding: 16px 12px 90px;
            gap: 22px;
          }

          .page-header h1 {
            font-size: 2.1rem;
          }
        }
      `}</style>
    </div>
  );
}
