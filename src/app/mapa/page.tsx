'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import TarjetaEvento from '@/components/TarjetaEvento';
import FiltrosDrawer from '@/components/FiltrosDrawer';
import GeonotisSearchBar from '@/components/GeonotisSearchBar';
import { useFavorites } from '@/hooks/useFavorites';
import { CategoryIcon } from '@/components/Icons';
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
  const [nearMe, setNearMe] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite } = useFavorites('eventos');

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

  const distanceKm = useCallback((evento: Evento) => {
    if (!userLocation) return Number.POSITIVE_INFINITY;
    const toRad = (value: number) => (value * Math.PI) / 180;
    const radius = 6371;
    const dLat = toRad(evento.latitud - userLocation.lat);
    const dLng = toRad(evento.longitud - userLocation.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLocation.lat)) *
        Math.cos(toRad(evento.latitud)) *
        Math.sin(dLng / 2) ** 2;
    return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, [userLocation]);

  const eventosVisibles = eventos.filter((evento) => {
    if (onlyFavorites && !isFavorite(evento.id)) return false;
    if (nearMe && distanceKm(evento) > 35) return false;
    return true;
  });

  const markers: MarkerData[] = eventosVisibles.map((e) => ({
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
      const evento = eventosVisibles.find((e) => e.id === marker.id);
      if (evento) setSelectedEvento(evento);
    },
    [eventosVisibles]
  );

  const categoriasVisibles = Array.from(new Set(eventos.map((evento) => evento.categoria))).slice(0, 5);
  const applyToday = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    setFiltros((actuales) => ({ ...actuales, desde: today, hasta: today }));
  }, []);

  const applyWeekend = useCallback(() => {
    const now = new Date();
    const day = now.getDay();
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + ((6 - day + 7) % 7));
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    setFiltros((actuales) => ({
      ...actuales,
      desde: saturday.toISOString().slice(0, 10),
      hasta: sunday.toISOString().slice(0, 10),
    }));
  }, []);

  const toggleNearMe = useCallback(() => {
    if (nearMe) {
      setNearMe(false);
      return;
    }

    navigator.geolocation?.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setNearMe(true);
    });
  }, [nearMe]);
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
      <div className="map-viewport">
        <div className="map-inner">
          <MapaInteractivo markers={markers} onMarkerClick={handleMarkerClick} />
        </div>

        <div className="floating-chips">
          <button className="chip-glass quick" onClick={applyToday}>
            <span>Hoy</span>
          </button>
          <button className="chip-glass quick" onClick={applyWeekend}>
            <span>Este finde</span>
          </button>
          <button className={`chip-glass quick ${nearMe ? 'active' : ''}`} onClick={toggleNearMe}>
            <span>Cerca de mi</span>
          </button>
          <button className={`chip-glass quick ${onlyFavorites ? 'active' : ''}`} onClick={() => setOnlyFavorites((value) => !value)}>
            <span>Favoritos</span>
          </button>
          {categoriasVisibles.map((cat) => (
            <button
              key={cat}
              className={`chip-glass ${filtros.categoria === cat ? 'active' : ''}`}
              onClick={() =>
                setFiltros((actuales) => ({
                  ...actuales,
                  categoria: actuales.categoria === cat ? undefined : cat,
                }))
              }
            >
              <CategoryIcon category={cat} size={14} />
              <span>{cat}</span>
            </button>
          ))}
          <button className="chip-glass more" onClick={() => setFiltrosOpen(true)}>
            <span>Mas filtros</span>
          </button>
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
          height: 100dvh;
          position: relative;
          overflow: hidden;
        }

        .map-viewport {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .map-inner {
          width: 100%;
          height: 100%;
        }

        .floating-chips {
          position: absolute;
          bottom: 176px;
          left: 50%;
          width: min(90vw, 460px);
          transform: translateX(-50%);
          z-index: 960;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          pointer-events: auto;
          padding: 2px;
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

        .chip-glass.more {
          color: var(--brand-accent-strong);
          cursor: pointer;
        }

        .chip-glass.quick {
          cursor: pointer;
          background: color-mix(in srgb, var(--surface-strong) 86%, transparent);
        }

        .chip-glass.active {
          background: var(--brand-accent-strong);
          border-color: transparent;
          color: #fff;
        }

        .chip-glass:hover {
          border-color: var(--border-active);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

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

        @media (max-width: 768px) {
          .mapa-page {
            height: 100dvh;
          }

          .floating-chips {
            bottom: 176px;
            width: min(90vw, 460px);
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
