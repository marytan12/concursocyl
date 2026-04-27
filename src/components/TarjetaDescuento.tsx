import {
  COLORES_CATEGORIA,
  CATEGORIAS_DESCUENTO,
  formatLocation,
  getDomainLabel,
} from '@/lib/utils';
import {
  CategoryIcon,
  IconExternalLink,
  IconGlobe,
  IconPin,
  IconSparkles,
  IconX,
} from '@/components/Icons';
import type { CategoriaDescuento } from '@/types';

interface Props {
  descuento: {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    direccion: string;
    localidad: string;
    provincia: string;
    porcentaje?: number | null;
    enlace?: string | null;
  };
  onClose?: () => void;
  variant?: 'card' | 'detail';
}

export default function TarjetaDescuento({
  descuento,
  onClose,
  variant = 'card',
}: Props) {
  const color = COLORES_CATEGORIA[descuento.categoria] || '#6B7280';
  const catLabel =
    CATEGORIAS_DESCUENTO[descuento.categoria as CategoriaDescuento] ||
    descuento.categoria;
  const location = formatLocation(descuento.localidad, descuento.provincia);
  const address = descuento.direccion?.trim() || null;
  const domain = getDomainLabel(descuento.enlace);

  if (variant === 'detail') {
    return (
      <div className="tarjeta-descuento-detail">
        <div className="drag-handle" />

        {onClose ? (
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            <IconX size={15} />
          </button>
        ) : null}

        <div className="content">
          {descuento.porcentaje ? (
            <div className="discount-badge" style={{ background: color }}>
              -{descuento.porcentaje}%
            </div>
          ) : null}

          <span
            className="badge"
            style={{
              background: `${color}20`,
              color,
              border: `1px solid ${color}40`,
            }}
          >
            <CategoryIcon category={catLabel} size={14} />
            {catLabel}
          </span>

          <h3 className="nombre">{descuento.nombre}</h3>

          <div className="meta">
            {address ? (
              <span className="meta-item">
                <IconPin size={14} />
                {address}
              </span>
            ) : null}
            {location ? (
              <span className="meta-item">
                <IconPin size={14} />
                {location}
              </span>
            ) : null}
            {!address && !location && domain ? (
              <span className="meta-item">
                <IconGlobe size={14} />
                {domain}
              </span>
            ) : null}
            {!address && !location && !domain ? (
              <span className="meta-item">
                <IconSparkles size={14} />
                Informacion general del colaborador
              </span>
            ) : null}
          </div>

          <p className="descripcion">{descuento.descripcion}</p>

          {descuento.enlace ? (
            <a
              href={descuento.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-primary action-link"
            >
              <IconExternalLink size={14} />
              Ver oferta
            </a>
          ) : null}
        </div>

        <style jsx>{`
          .tarjeta-descuento-detail {
            position: fixed;
            bottom: 80px;
            left: 8px;
            right: 8px;
            max-width: 480px;
            margin: 0 auto;
            background: var(--surface-highlight);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-card);
            overflow: hidden;
            z-index: var(--z-modal);
            max-height: 70vh;
            overflow-y: auto;
          }

          .drag-handle {
            width: 36px;
            height: 4px;
            background: var(--text-muted);
            border-radius: 2px;
            margin: 12px auto 0;
            opacity: 0.5;
          }

          .close-btn {
            position: absolute;
            top: 12px;
            right: 16px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--surface-soft);
            border: 1px solid var(--border-subtle);
            color: var(--text-secondary);
            cursor: pointer;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .content {
            padding: 16px 20px 24px;
          }

          .discount-badge {
            display: inline-flex;
            padding: 6px 16px;
            border-radius: var(--radius-pill);
            color: var(--text-on-accent);
            font-weight: 800;
            font-size: 18px;
            margin-bottom: 12px;
            box-shadow: 0 10px 20px rgba(116, 83, 53, 0.14);
          }

          .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .nombre {
            font-size: 20px;
            font-weight: 700;
            margin: 10px 0 8px;
            line-height: 1.3;
          }

          .meta {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 12px;
          }

          .meta-item {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: var(--text-secondary);
          }

          .descripcion {
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          .action-link {
            margin-top: 12px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="tarjeta-descuento-card glass-card">
      <div className="card-header">
        <span
          className="category-pill"
          style={{
            background: `${color}15`,
            color,
            borderColor: `${color}30`,
          }}
        >
          <CategoryIcon category={catLabel} size={14} />
          {catLabel}
        </span>
        {descuento.porcentaje ? (
          <div className="discount-tag" style={{ background: color }}>
            {descuento.porcentaje}%
          </div>
        ) : null}
      </div>

      <div className="card-body">
        <h4 className="title">{descuento.nombre}</h4>
        <p className="excerpt">{descuento.descripcion}</p>
      </div>

      <div className="card-footer">
        {location && (
          <div className="location">
            <IconPin size={12} />
            <span>{location}</span>
          </div>
        )}
        {!location && domain && (
          <div className="location">
            <IconGlobe size={12} />
            <span>{domain}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .tarjeta-descuento-card {
          padding: 28px;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
          border-radius: 32px;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-secondary) 85%, rgba(240, 135, 74, 0.05)) 0%,
            color-mix(in srgb, var(--bg-secondary) 75%, rgba(240, 135, 74, 0.1)) 100%
          );
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid color-mix(in srgb, var(--border-subtle) 80%, rgba(240, 135, 74, 0.2));
          box-shadow:
            0 8px 32px color-mix(in srgb, var(--bg-secondary) 60%, rgba(0, 0, 0, 0.3)),
            0 4px 16px color-mix(in srgb, var(--bg-secondary) 40%, rgba(0, 0, 0, 0.2)),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tarjeta-descuento-card:hover {
          border-color: color-mix(in srgb, var(--brand-accent-strong) 40%, var(--border-active));
          transform: translateY(-6px) scale(1.02);
          box-shadow:
            0 12px 48px color-mix(in srgb, var(--brand-accent-strong) 30%, var(--bg-secondary) 50%),
            0 6px 24px color-mix(in srgb, var(--bg-secondary) 60%, rgba(0, 0, 0, 0.3)),
            0 0 0 1px rgba(255, 255, 255, 0.12) inset,
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .tarjeta-descuento-card:active {
          transform: translateY(-2px) scale(0.98);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .category-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .discount-tag {
          font-size: 16px;
          font-weight: 900;
          color: #fff;
          padding: 6px 12px;
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .card-body {
          flex: 1;
        }

        .title {
          font-size: 1.25rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 10px;
          color: var(--text-primary);
        }

        .excerpt {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-footer {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .location {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
