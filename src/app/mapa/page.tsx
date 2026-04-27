'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import TarjetaEvento from '@/components/TarjetaEvento';
import FiltrosDrawer from '@/components/FiltrosDrawer';
import GeonotisSearchBar from '@/components/GeonotisSearchBar';
import { CategoryIcon, IconFilter } from '@/components/Icons';
import type { MarkerData } from '@/types';

const MapaInteractivo = dynamic(() => import('@/components/MapaInteractivo'), {
  ssr: false,
  loading: () => (
    <div className="map-loading-state">
      <div className="map-loading-pulse" />
      <div className="map-loading-text">Cargando mapa...</div>
    </div>
  ),
});

interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  fechaInicio: string;
  fechaFin?: string | null;
  latitud: number;
  longitud: number;
  localidad: string;
  provincia: string;
  imagen?: string | null;
  enlace?: string | null;
}

export default function MapaPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [filtros, setFiltros] = useState<Record<string, string | undefined>>({});
  const [mapSearch, setMapSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEventos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.categoria) params.set('categoria', filtros.categoria);
      if (filtros.provincia) params.set('provincia', filtros.provincia);
      if (filtros.desde) params.set('desde', filtros.desde);
      if (filtros.hasta) params.set('hasta', filtros.hasta);
      if (filtros.busqueda) params.set('busqueda', filtros.busqueda);

      const res = await fetch(`/api/eventos?${params.toString()}`);
      const data = await res.json();
      setEventos(data.data || []);
    } catch (err) {
      console.error('Error fetching eventos:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchEventos();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchEventos]);

  const markers: MarkerData[] = eventos.map((e) => ({
    id: e.id,
    lat: e.latitud,
    lng: e.longitud,
    tipo: 'evento' as const,
    titulo: e.titulo,
    categoria: e.categoria,
    descripcion: e.descripcion,
    extra: e as unknown as Record<string, unknown>,
  }));

  const handleMarkerClick = useCallback(
    (marker: MarkerData) => {
      const evento = eventos.find((e) => e.id === marker.id);
      if (evento) setSelectedEvento(evento);
    },
    [eventos]
  );

  const activeFilterCount = Object.values(filtros).filter(Boolean).length;
  const categoriasVisibles = Array.from(new Set(eventos.map((evento) => evento.categoria))).slice(0, 5);
  const handleMapSearch = useCallback((value: string) => {
    setFiltros((actuales) => ({
      ...actuales,
      busqueda: value || undefined,
    }));
  }, []);

  const clearMapSearch = useCallback(() => {
    setFiltros((actuales) => ({
      ...actuales,
      busqueda: undefined,
    }));
  }, []);

  const handleFiltrosChange = useCallback((nextFiltros: Record<string, string | undefined>) => {
    setFiltros(nextFiltros);
    setMapSearch(nextFiltros.busqueda || '');
  }, []);

  return (
    <div className="mapa-page">
      {/* â”€â”€â”€ Floating top bar â”€â”€â”€ */}
      <div className="floating-bar">
        <div className="bar-left">
          <div className="bar-title-group">
            <h1>Explorar</h1>
            <span className="event-counter">
              <span className="counter-dot" />
              {loading ? '...' : eventos.length}
            </span>
          </div>
        </div>
        <button
          className="filter-btn-glass"
          onClick={() => setFiltrosOpen(true)}
        >
          <IconFilter size={16} />
          <span>Filtros</span>
          {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
        </button>
      </div>

      {/* â”€â”€â”€ Map viewport â”€â”€â”€ */}
      <div className="map-viewport">
        <div className="map-inner">
          <MapaInteractivo markers={markers} onMarkerClick={handleMarkerClick} />
        </div>


        <GeonotisSearchBar
          value={mapSearch}
          onChange={setMapSearch}
          onSubmit={handleMapSearch}
          onClear={clearMapSearch}
          placeholder="Buscar en el mapa..."
          isSearching={loading}
          variant="floating"
        />
        {/* â”€â”€â”€ Floating category chips â”€â”€â”€ */}
        <div className="floating-chips">
          {categoriasVisibles.map((cat) => (
            <button key={cat} className="chip-glass">
              <CategoryIcon category={cat} size={14} />
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* â”€â”€â”€ Event detail panel â”€â”€â”€ */}
        {selectedEvento && (
          <>
            <div
              className="panel-backdrop"
              onClick={() => setSelectedEvento(null)}
            />
            <TarjetaEvento
              evento={selectedEvento}
              onClose={() => setSelectedEvento(null)}
            />
          </>
        )}
      </div>

      <FiltrosDrawer
        tipo="eventos"
        filtros={filtros}
        onFiltrosChange={handleFiltrosChange}
        isOpen={filtrosOpen}
        onClose={() => setFiltrosOpen(false)}
      />

      <style jsx>{`
        .mapa-page {
          display: flex;
          flex-direction: column;
          height: calc(100dvh - 72px);
          position: relative;
          overflow: hidden;
        }

        /* â”€â”€â”€ Floating top bar â”€â”€â”€ */
        .floating-bar {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 10px 10px 20px;
          border-radius: 20px;
          background: color-mix(in srgb, var(--bg-primary) 72%, transparent);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid color-mix(in srgb, var(--border-subtle) 60%, transparent);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset;
          pointer-events: auto;
        }

        .bar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bar-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        h1 {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .event-counter {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          background: color-mix(in srgb, var(--surface-soft) 60%, transparent);
          border: 1px solid var(--border-subtle);
        }

        .counter-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-emerald);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .filter-btn-glass {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 14px;
          border: 1px solid var(--border-subtle);
          background: color-mix(in srgb, var(--surface-soft) 60%, transparent);
          color: var(--text-primary);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn-glass:hover {
          background: color-mix(in srgb, var(--surface-strong) 80%, transparent);
          border-color: var(--border-active);
        }

        .filter-btn-glass:active {
          transform: scale(0.96);
        }

        .filter-count {
          background: var(--brand-accent);
          color: white;
          min-width: 18px;
          height: 18px;
          font-size: 10px;
          font-weight: 800;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* â”€â”€â”€ Map viewport â”€â”€â”€ */
        .map-viewport {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .map-inner {
          width: 100%;
          height: 100%;
        }

        /* â”€â”€â”€ Floating chips â”€â”€â”€ */
        .floating-chips {
          position: absolute;
          bottom: 24px;
          left: 16px;
          right: 16px;
          z-index: 800;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          pointer-events: auto;
          padding: 2px;
          mask-image: linear-gradient(to right, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%);
        }

        .floating-chips::-webkit-scrollbar {
          display: none;
        }

        .chip-glass {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 14px;
          border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
          background: color-mix(in srgb, var(--bg-primary) 78%, transparent);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          color: var(--text-primary);
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          cursor: default;
          box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.04),
            0 0 0 1px rgba(255, 255, 255, 0.06) inset;
          text-transform: capitalize;
          transition: all 0.2s ease;
        }

        .chip-glass:hover {
          border-color: var(--border-active);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        /* â”€â”€â”€ Panel backdrop â”€â”€â”€ */
        .panel-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(2px);
          z-index: 1500;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* â”€â”€â”€ Responsive â”€â”€â”€ */
        @media (max-width: 768px) {
          .mapa-page {
            height: calc(100dvh - 68px);
          }

          .floating-bar {
            top: 10px;
            left: 10px;
            right: 10px;
            padding: 8px 8px 8px 16px;
            border-radius: 16px;
          }

          h1 {
            font-size: 1rem;
          }

          .floating-chips {
            bottom: 80px;
            left: 10px;
            right: 10px;
          }
        }
      `}</style>

      <style jsx>{`
        .map-loading-state {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: var(--bg-secondary);
        }

        .map-loading-pulse {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--gradient-hero);
          animation: loadPulse 1.5s ease infinite;
        }

        @keyframes loadPulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .map-loading-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
