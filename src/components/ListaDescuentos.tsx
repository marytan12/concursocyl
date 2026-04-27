'use client';

import { useMemo, useState } from 'react';
import TarjetaDescuento from './TarjetaDescuento';
import GeonotisSearchBar from './GeonotisSearchBar';
import { COLORES_CATEGORIA } from '@/lib/utils';
import { CategoryIcon, IconSparkles } from '@/components/Icons';

interface Descuento {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  direccion: string;
  localidad: string;
  provincia: string;
  porcentaje?: number | null;
  enlace?: string | null;
  latitud: number;
  longitud: number;
}

interface Props {
  descuentos: Descuento[];
  onSelect?: (descuento: Descuento) => void;
}

export default function ListaDescuentos({ descuentos, onSelect }: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    return descuentos.filter((d) => {
      const term = busqueda.toLowerCase();
      const matchBusqueda =
        !busqueda ||
        d.nombre.toLowerCase().includes(term) ||
        d.descripcion.toLowerCase().includes(term) ||
        d.localidad.toLowerCase().includes(term);
      const matchCategoria = !categoriaActiva || d.categoria === categoriaActiva;
      return matchBusqueda && matchCategoria;
    });
  }, [descuentos, busqueda, categoriaActiva]);

  const categoriasDisponibles = useMemo(
    () =>
      Array.from(new Set(descuentos.map((descuento) => descuento.categoria))).sort((a, b) =>
        a.localeCompare(b, 'es')
      ),
    [descuentos]
  );

  return (
    <div className="lista-descuentos">
      <div className="filter-section">
        <GeonotisSearchBar
          value={busqueda}
          onChange={setBusqueda}
          onClear={() => setBusqueda('')}
          placeholder="Buscar ofertas..."
        />

        <div className="category-scroller">
          <button
            className={`chip all ${!categoriaActiva ? 'active' : ''}`}
            onClick={() => setCategoriaActiva(null)}
          >
            <IconSparkles size={16} />
            Todas
          </button>
          {categoriasDisponibles.map((categoria) => (
            <button
              key={categoria}
              className={`chip ${categoriaActiva === categoria ? 'active' : ''}`}
              onClick={() => setCategoriaActiva(categoriaActiva === categoria ? null : categoria)}
              style={
                categoriaActiva === categoria
                  ? {
                    background: COLORES_CATEGORIA[categoria] || '#6B7280',
                    borderColor: 'transparent',
                    color: '#fff',
                    boxShadow: `0 8px 20px ${COLORES_CATEGORIA[categoria]}44`,
                  }
                  : ({
                    '--chip-color': COLORES_CATEGORIA[categoria] || '#6B7280',
                  } as React.CSSProperties)
              }
            >
              <CategoryIcon category={categoria} size={16} />
              {categoria}
            </button>
          ))}
        </div>

        <div className="results-info">
          <span className="badge">
            {filtrados.length} {filtrados.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
          </span>
        </div>
      </div>

      <div className="discounts-grid">
        {filtrados.map((d) => (
          <div key={d.id} onClick={() => onSelect?.(d)}>
            <TarjetaDescuento descuento={d} variant="card" />
          </div>
        ))}

        {filtrados.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="icon">ðŸ”</div>
            <h3>No encontramos nada</h3>
            <p>Prueba con otros tÃ©rminos o cambia de categorÃ­a.</p>
            <button
              className="btn-pill btn-primary"
              onClick={() => {
                setBusqueda('');
                setCategoriaActiva(null);
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .lista-descuentos {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .filter-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .search-box {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          gap: 12px;
          border-radius: 24px;
          background: var(--surface-strong);
          transition: all 0.3s;
        }

        .search-box:focus-within {
          border-color: var(--border-active);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-accent) 10%, transparent);
        }

        .search-box .icon {
          color: var(--text-muted);
          display: flex;
        }

        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 12px 0;
          font-size: 1.05rem;
          color: var(--text-primary);
          outline: none;
        }

        .search-box .clear {
          background: var(--surface-soft);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
        }

        .category-scroller {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px;
          margin: 0 -4px;
          scrollbar-width: none;
        }

        .category-scroller::-webkit-scrollbar {
          display: none;
        }

        .chip {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 99px;
          border: 1px solid var(--border-subtle);
          background: var(--surface-soft);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chip.all.active {
          background: var(--brand-accent-strong);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-accent) 30%, transparent);
        }

        .chip:not(.active):hover {
          border-color: var(--chip-color, var(--border-active));
          color: var(--text-primary);
          transform: translateY(-2px);
        }

        .results-info {
          padding-left: 4px;
        }

        .results-info .badge {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-muted);
          background: color-mix(in srgb, var(--text-muted) 8%, transparent);
          padding: 4px 12px;
          border-radius: 8px;
        }

        .discounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px;
          text-align: center;
          border-radius: 32px;
        }

        .empty-state .icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        @media (max-width: 640px) {
          .discounts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
