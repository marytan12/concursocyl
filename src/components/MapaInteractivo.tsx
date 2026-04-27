'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { COLORES_CATEGORIA, CYL_CENTER, CYL_ZOOM } from '@/lib/utils';
import type { MarkerData } from '@/types';
import 'leaflet/dist/leaflet.css';

interface Props {
  markers: MarkerData[];
  onMarkerClick?: (marker: MarkerData) => void;
  center?: [number, number];
  zoom?: number;
}

function createCustomIcon(color: string): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="
        width: 36px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      ">
        <svg width="32" height="40" viewBox="0 0 28 36" fill="none">
          <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="${color}"/>
          <circle cx="14" cy="13" r="6" fill="white" opacity="0.95"/>
          <circle cx="14" cy="13" r="3" fill="${color}"/>
        </svg>
      </div>
    `,
    className: '',
    iconSize: [36, 40],
    iconAnchor: [18, 40],
    popupAnchor: [0, -40],
  });
}

function createClusterIcon(cluster: { getChildCount: () => number }): L.DivIcon {
  const count = cluster.getChildCount();
  let size = 40;
  let bgColor = 'rgba(201, 95, 60, 0.85)';

  if (count >= 50) {
    size = 56;
    bgColor = 'rgba(201, 95, 60, 0.95)';
  } else if (count >= 20) {
    size = 50;
    bgColor = 'rgba(201, 95, 60, 0.9)';
  } else if (count >= 10) {
    size = 46;
    bgColor = 'rgba(201, 95, 60, 0.87)';
  }

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: ${bgColor};
        backdrop-filter: blur(8px);
        border: 2px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 6px 20px rgba(201, 95, 60, 0.35), 0 0 0 4px rgba(201, 95, 60, 0.15);
        color: white;
        font-weight: 800;
        font-size: ${count >= 100 ? '13' : '14'}px;
        font-family: inherit;
        letter-spacing: -0.02em;
        transition: transform 0.2s ease;
      ">
        ${count}
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function RecenterMap({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);

  return null;
}

const GLOBAL_ICON_CACHE: Record<string, L.DivIcon> = {};

function getIcon(categoria: string) {
  if (!GLOBAL_ICON_CACHE[categoria]) {
    const color = COLORES_CATEGORIA[categoria] || '#6B7280';
    GLOBAL_ICON_CACHE[categoria] = createCustomIcon(color);
  }
  return GLOBAL_ICON_CACHE[categoria];
}

export default function MapaInteractivo({
  markers,
  onMarkerClick,
  center = CYL_CENTER,
  zoom = CYL_ZOOM,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleMarkerClick = useCallback(
    (marker: MarkerData) => {
      onMarkerClick?.(marker);
    },
    [onMarkerClick]
  );

  if (!isMounted) {
    return (
      <div className="map-skeleton">
        <div className="shimmer" style={{ width: '100%', height: '100%' }} />
        <style jsx>{`
          .map-skeleton {
            width: 100%;
            height: 100%;
            min-height: 400px;
            overflow: hidden;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="mapa-wrapper">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <RecenterMap center={center} zoom={zoom} />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={55}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          iconCreateFunction={createClusterIcon}
          animate
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={getIcon(marker.categoria)}
              eventHandlers={{
                click: () => handleMarkerClick(marker),
              }}
            >
              <Popup>
                <div className="popup-content">
                  <div
                    className="popup-badge"
                    style={{
                      background: `${COLORES_CATEGORIA[marker.categoria] || '#6B7280'}18`,
                      color: COLORES_CATEGORIA[marker.categoria] || '#6B7280',
                    }}
                  >
                    {marker.categoria}
                  </div>
                  <h4 className="popup-title">{marker.titulo}</h4>
                  <p className="popup-desc">{marker.descripcion.slice(0, 100)}...</p>
                  <button className="popup-btn" onClick={() => handleMarkerClick(marker)}>
                    Ver detalles →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <style jsx>{`
        .mapa-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      `}</style>

      <style jsx global>{`
        /* ─── Custom cluster styling ─── */
        .custom-cluster-icon {
          background: transparent !important;
          border: none !important;
        }

        .marker-cluster {
          background: transparent !important;
          border: none !important;
        }

        .marker-cluster div {
          background: transparent !important;
        }

        .marker-cluster span {
          display: none !important;
        }

        /* ─── Leaflet zoom controls ─── */
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 14px !important;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
        }

        .leaflet-control-zoom a {
          background: color-mix(in srgb, var(--bg-primary, #f6efe6) 85%, transparent) !important;
          backdrop-filter: blur(12px);
          color: var(--text-primary, #20140d) !important;
          border: none !important;
          border-bottom: 1px solid var(--border-subtle, rgba(95, 65, 42, 0.12)) !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 16px !important;
          font-weight: 700 !important;
        }

        .leaflet-control-zoom a:last-child {
          border-bottom: none !important;
        }

        .leaflet-control-zoom a:hover {
          background: var(--surface-strong, rgba(255, 255, 255, 0.88)) !important;
        }

        /* ─── Popup styling ─── */
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          overflow: hidden;
          border-radius: 18px !important;
          background: color-mix(in srgb, var(--bg-primary, #f6efe6) 92%, transparent) !important;
          backdrop-filter: blur(20px) saturate(160%) !important;
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
          border: 1px solid var(--border-subtle, rgba(95, 65, 42, 0.12)) !important;
        }

        .leaflet-popup-tip {
          background: color-mix(in srgb, var(--bg-primary, #f6efe6) 92%, transparent) !important;
          border: 1px solid var(--border-subtle, rgba(95, 65, 42, 0.12)) !important;
          border-top: none !important;
          border-left: none !important;
          box-shadow: none !important;
        }

        .leaflet-popup-close-button {
          top: 10px !important;
          right: 10px !important;
          width: 24px !important;
          height: 24px !important;
          font-size: 18px !important;
          color: var(--text-muted, #9b7f6d) !important;
          background: var(--surface-soft, rgba(255, 255, 255, 0.78)) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
          padding: 0 0 0 1px !important;
          line-height: 24px !important;
        }

        .leaflet-popup-content {
          margin: 0 !important;
        }

        .popup-content {
          padding: 20px;
          min-width: 250px;
          max-width: 280px;
        }

        .popup-badge {
          display: inline-flex;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 800;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .popup-title {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 6px;
          color: var(--text-primary, #20140d);
          line-height: 1.28;
          letter-spacing: -0.01em;
        }

        .popup-desc {
          font-size: 13px;
          color: var(--text-muted, #9b7f6d);
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .popup-btn {
          width: 100%;
          background: var(--text-primary, #20140d);
          color: var(--bg-primary, #f6efe6);
          border: none;
          padding: 11px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.15s ease, opacity 0.15s ease;
          letter-spacing: 0.01em;
        }

        .popup-btn:hover {
          opacity: 0.88;
        }

        .popup-btn:active {
          transform: scale(0.97);
        }

        /* ─── Attribution ─── */
        .leaflet-control-attribution {
          background: color-mix(in srgb, var(--bg-primary, #f6efe6) 70%, transparent) !important;
          backdrop-filter: blur(8px) !important;
          border-radius: 8px 0 0 0 !important;
          padding: 2px 8px !important;
          font-size: 10px !important;
          color: var(--text-muted, #9b7f6d) !important;
        }

        .leaflet-control-attribution a {
          color: var(--brand-accent, #b24f28) !important;
        }
      `}</style>
    </div>
  );
}
