'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { formatearFecha, COLORES_CATEGORIA, CATEGORIAS_EVENTO } from '@/lib/utils';
import { getDirectionsUrl, shareContent } from '@/lib/clientActions';
import { useFavorites } from '@/hooks/useFavorites';
import { CategoryIcon, IconCalendar, IconExternalLink, IconHeart, IconPin, IconRoute, IconShare, IconX } from '@/components/Icons';
import type { CategoriaEvento } from '@/types';

interface Props {
  evento: {
    id: string;
    titulo: string;
    descripcion: string;
    categoria: string;
    fechaInicio: string;
    fechaFin?: string | null;
    latitud?: number;
    longitud?: number;
    localidad: string;
    provincia: string;
    imagen?: string | null;
    enlace?: string | null;
  };
  onClose?: () => void;
}

export default function TarjetaEvento({ evento, onClose }: Props) {
  const color = COLORES_CATEGORIA[evento.categoria] || '#6B7280';
  const catLabel = CATEGORIAS_EVENTO[evento.categoria as CategoriaEvento] || evento.categoria;
  const { isFavorite, toggleFavorite } = useFavorites('eventos');

  useEffect(() => {
    document.body.classList.add('panel-open');
    return () => {
      document.body.classList.remove('panel-open');
    };
  }, []);
  const directionsUrl = getDirectionsUrl({
    lat: evento.latitud,
    lng: evento.longitud,
    query: `${evento.titulo}, ${evento.localidad}, ${evento.provincia}`,
  });

  const handleShare = async () => {
    await shareContent({
      title: evento.titulo,
      text: `${catLabel} en ${evento.localidad}, ${evento.provincia}`,
      url: evento.enlace,
    });
  };

  return (
    <div className="event-panel">
      <div className="panel-scroll">
        {/* ─── Drag handle for mobile ─── */}
        <div className="drag-bar">
          <div className="drag-indicator" />
        </div>

        {/* ─── Header ─── */}
        <div className="panel-header">
          <div className="header-row">
            <span
              className="cat-tag"
              style={{
                background: `${color}14`,
                color,
              }}
            >
              <CategoryIcon category={catLabel} size={13} />
              {catLabel}
            </span>
            {onClose && (
              <button className="close-btn" onClick={onClose} aria-label="Cerrar">
                <IconX size={16} />
              </button>
            )}
          </div>
          <h3>{evento.titulo}</h3>
        </div>

        <div className="quick-actions">
          <button
            className={`round-action ${isFavorite(evento.id) ? 'active' : ''}`}
            onClick={() => toggleFavorite(evento.id)}
            aria-label="Guardar favorito"
          >
            <IconHeart size={16} fill={isFavorite(evento.id) ? 'currentColor' : 'none'} />
          </button>
          <button className="round-action" onClick={handleShare} aria-label="Compartir">
            <IconShare size={16} />
          </button>
          {directionsUrl ? (
            <a className="round-action" href={directionsUrl} target="_blank" rel="noopener noreferrer" aria-label="Como llegar">
              <IconRoute size={16} />
            </a>
          ) : null}
        </div>

        {/* ─── Image ─── */}
        {evento.imagen && (
          <div className="img-section">
            <div className="img-frame">
              <Image
                src={evento.imagen}
                alt={evento.titulo}
                fill
                sizes="420px"
                className="cover-img"
              />
            </div>
          </div>
        )}

        {/* ─── Details ─── */}
        <div className="details">
          <div className="meta-grid">
            <div className="meta-card">
              <div className="meta-icon">
                <IconCalendar size={16} />
              </div>
              <div className="meta-info">
                <span className="meta-label">Cuándo</span>
                <span className="meta-value">
                  {formatearFecha(evento.fechaInicio)}
                  {evento.fechaFin && ` — ${formatearFecha(evento.fechaFin)}`}
                </span>
              </div>
            </div>

            <div className="meta-card">
              <div className="meta-icon">
                <IconPin size={16} />
              </div>
              <div className="meta-info">
                <span className="meta-label">Dónde</span>
                <span className="meta-value">{evento.localidad}, {evento.provincia}</span>
              </div>
            </div>
          </div>

          <div className="desc-block">
            <h4>Descripción</h4>
            <p>{evento.descripcion}</p>
          </div>

          {evento.enlace && (
            <a
              href={evento.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn"
            >
              <span>Más información</span>
              <IconExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        .event-panel {
          position: fixed;
          bottom: calc(18px + env(safe-area-inset-bottom, 0px));
          right: 12px;
          width: min(90vw, 460px);
          height: calc(100vh - 18px - env(safe-area-inset-bottom, 0px));
          z-index: 6000;
          border-radius: 42px 42px 0 0;
          background: color-mix(in srgb, var(--bg-primary) 88%, transparent);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.06) inset;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: panelSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1);

        @media (max-width: 768px) {
          border-radius: 24px 24px 0 0;
          width: 90%;
          height: 78vh;
          animation: 0.4s cubic-bezier(0.16, 1, 0.3, 1) sheetSlideUp;
          position: fixed;
          inset: auto 0 90px;
        }
        }

        @keyframes panelSlideIn {
          from {
            opacity: 0;
            transform: translateY(100%) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes sheetSlideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .panel-scroll {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border-subtle) transparent;
        }

        .drag-bar {
          display: none;
        }

        .panel-header {
          position: relative;
          padding: 24px 24px 16px;
          text-align: center;
        }

        .quick-actions {
          display: flex;
          gap: 10px;
          padding: 0 24px 18px;
        }

        .round-action {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid var(--border-subtle);
          background: color-mix(in srgb, var(--surface-soft) 70%, transparent);
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.15s ease, color 0.15s ease, background 0.15s ease;
        }

        .round-action:hover,
        .round-action.active {
          background: color-mix(in srgb, var(--brand-accent) 14%, var(--surface-strong));
          color: var(--brand-accent-strong);
        }

        .round-action:active {
          transform: scale(0.94);
        }

        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 1px solid var(--border-subtle);
          background: color-mix(in srgb, var(--surface-soft) 70%, transparent);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease, color 0.15s ease, background 0.15s ease;
        }

        .close-btn:hover {
          background: color-mix(in srgb, var(--brand-accent) 14%, var(--surface-strong));
          color: var(--brand-accent-strong);
        }

        .close-btn:active {
          transform: scale(0.94);
        }

        .header-row {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 14px;
        }

        .cat-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .close-btn {
          background: color-mix(in srgb, var(--surface-soft) 70%, transparent);
          border: 1px solid var(--border-subtle);
          width: 30px;
          height: 30px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.15s ease;
        }

        .close-btn:hover {
          background: var(--surface-strong);
          color: var(--text-primary);
        }

        h3 {
          font-size: 1.3rem;
          font-weight: 800;
          line-height: 1.25;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .img-section {
          padding: 0 20px;
        }

        .img-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 14px;
          overflow: hidden;
          background: var(--surface-shell);
        }

        .cover-img {
          object-fit: cover;
        }

        .details {
          padding: 20px 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .meta-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .meta-card {
          display: flex;
          gap: 14px;
          padding: 14px;
          border-radius: 14px;
          background: color-mix(in srgb, var(--surface-soft) 50%, transparent);
          border: 1px solid var(--border-subtle);
        }

        .meta-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: color-mix(in srgb, var(--brand-accent) 12%, transparent);
          color: var(--brand-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .meta-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 800;
          color: var(--text-muted);
        }

        .meta-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .desc-block h4 {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .desc-block p {
          font-size: 14px;
          line-height: 1.65;
          color: var(--text-secondary);
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--text-primary);
          color: var(--bg-primary);
          padding: 14px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.15s ease;
          letter-spacing: 0.01em;
        }

        .action-btn:hover {
          opacity: 0.9;
        }

        .action-btn:active {
          transform: scale(0.98);
        }

        /* ─── Mobile: bottom sheet ─── */
        @media (max-width: 768px) {
          .event-panel {
            position: fixed;
            top: auto;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 78vh;
            border-radius: 24px 24px 0 0;
            animation: sheetSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes sheetSlideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .drag-bar {
            display: flex;
            justify-content: center;
            padding: 12px 0 4px;
          }

          .drag-indicator {
            width: 36px;
            height: 4px;
            border-radius: 2px;
            background: var(--text-muted);
            opacity: 0.35;
          }

          .panel-header {
            padding: 12px 20px 14px;
          }

          .img-section {
            padding: 0 16px;
          }

          .details {
            padding: 16px 20px 100px;
          }
        }
      `}</style>
    </div>
  );
}
