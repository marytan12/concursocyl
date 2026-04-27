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
            <span>Todas</span>
            <strong>{descuentos.length}</strong>
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
              <span>{categoria}</span>
              <strong>{descuentos.filter((descuento) => descuento.categoria === categoria).length}</strong>
            </button>
          ))}
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

        .category-scroller {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          overflow-x: auto;
          padding: 2px;
          scrollbar-width: none;
        }

        .category-scroller::-webkit-scrollbar {
          display: none;
        }

        .chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-height: 48px;
          padding: 10px 12px;
          border-radius: 18px;
          border: 1px solid var(--border-subtle);
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--surface-strong) 92%, transparent), color-mix(in srgb, var(--surface-soft) 78%, transparent));
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 22px rgba(116, 83, 53, 0.06);
          text-align: left;
        }

        .chip span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .chip strong {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--chip-color, var(--brand-accent)) 14%, transparent);
          color: var(--chip-color, var(--brand-accent-strong));
          font-size: 12px;
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
