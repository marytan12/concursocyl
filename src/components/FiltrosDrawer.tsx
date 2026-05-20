'use client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CATEGORIAS_DESCUENTO,
  CATEGORIAS_EVENTO,
  COLORES_CATEGORIA,
  PROVINCIAS,
} from '@/lib/utils';
import {
  CategoryIcon,
  IconCalendar,
  IconFilter,
  IconSearch,
  IconSparkles,
  IconX,
} from '@/components/Icons';

interface Props {
  tipo: 'eventos' | 'descuentos';
  filtros: {
    categoria?: string;
    provincia?: string;
    desde?: string;
    hasta?: string;
    busqueda?: string;
  };
  onFiltrosChange: (filtros: Props['filtros']) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FiltrosDrawer({
  tipo,
  filtros,
  onFiltrosChange,
  isOpen,
  onClose,
}: Props) {
  const categorias = tipo === 'eventos' ? CATEGORIAS_EVENTO : CATEGORIAS_DESCUENTO;

  const updateFiltro = (key: string, value: string | undefined) => {
    const updated = { ...filtros, [key]: value || undefined };
    onFiltrosChange(updated);
  };

  const limpiarFiltros = () => {
    onFiltrosChange({});
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            className="filtros-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="filtros-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
          >
            <div className="drawer-header">
              <h3>
                <IconFilter size={18} />
                Filtros
              </h3>
              <button type="button" onClick={onClose} className="close-btn" aria-label="Cerrar filtros">
                <IconX size={15} />
              </button>
            </div>

            <div className="filter-section">
              <label className="filter-label" htmlFor="filtro-busqueda">Buscar</label>
              <div className="input-shell">
                <span className="input-icon" aria-hidden="true">
                  <IconSearch size={15} />
                </span>
                <input
                  id="filtro-busqueda"
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={filtros.busqueda || ''}
                  onChange={(e) => updateFiltro('busqueda', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-section">
              <label className="filter-label">Categoria</label>
              <div className="filter-chips">
                {Object.entries(categorias).map(([key, label]) => (
                  <button
                    type="button"
                    key={key}
                    className={`filter-chip ${filtros.categoria === key ? 'active' : ''}`}
                    aria-pressed={filtros.categoria === key}
                    onClick={() =>
                      updateFiltro('categoria', filtros.categoria === key ? undefined : key)
                    }
                    style={
                      filtros.categoria === key
                        ? {
                            background: `${COLORES_CATEGORIA[key]}20`,
                            borderColor: COLORES_CATEGORIA[key],
                            color: COLORES_CATEGORIA[key],
                          }
                        : undefined
                    }
                  >
                    <CategoryIcon category={label} size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <label className="filter-label" htmlFor="filtro-provincia">Provincia</label>
              <select
                id="filtro-provincia"
                value={filtros.provincia || ''}
                onChange={(e) => updateFiltro('provincia', e.target.value)}
                className="filter-select"
              >
                <option value="">Todas las provincias</option>
                {PROVINCIAS.map((provincia) => (
                  <option key={provincia} value={provincia}>
                    {provincia}
                  </option>
                ))}
              </select>
            </div>

            {tipo === 'eventos' ? (
              <div className="filter-section">
                <span className="filter-label">Fechas</span>
                <div className="date-range">
                  <div className="input-shell">
                    <span className="input-icon" aria-hidden="true">
                      <IconCalendar size={15} />
                    </span>
                    <input
                      aria-label="Fecha desde"
                      type="date"
                      value={filtros.desde || ''}
                      onChange={(e) => updateFiltro('desde', e.target.value)}
                      className="filter-input"
                    />
                  </div>
                  <div className="input-shell">
                    <span className="input-icon" aria-hidden="true">
                      <IconCalendar size={15} />
                    </span>
                    <input
                      aria-label="Fecha hasta"
                      type="date"
                      value={filtros.hasta || ''}
                      onChange={(e) => updateFiltro('hasta', e.target.value)}
                      className="filter-input"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <button type="button" className="btn-pill btn-secondary clear-btn" onClick={limpiarFiltros}>
              <IconSparkles size={14} />
              Limpiar filtros
            </button>

            <style jsx>{`
              .filtros-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: calc(var(--z-modal) - 1);
              }

              .filtros-drawer {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                width: 320px;
                max-width: 90vw;
                background: var(--bg-secondary);
                border-left: 1px solid var(--border-subtle);
                z-index: var(--z-modal);
                padding: 24px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 20px;
              }

              .drawer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }

              .drawer-header h3 {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                font-size: 20px;
                font-weight: 700;
              }

              .close-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: var(--bg-glass);
                border: 1px solid var(--border-subtle);
                color: var(--text-secondary);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .filter-section {
                display: flex;
                flex-direction: column;
                gap: 8px;
              }

              .filter-label {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--text-muted);
              }

              .input-shell {
                position: relative;
              }

              .input-icon {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-muted);
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .filter-input {
                width: 100%;
                padding: 10px 14px 10px 38px;
                border-radius: var(--radius-md);
                background: var(--bg-glass);
                border: 1px solid var(--border-subtle);
                color: var(--text-primary);
                font-size: 14px;
                outline: none;
                transition: border-color var(--duration-fast);
                font-family: inherit;
              }

              .filter-input:focus {
                border-color: var(--accent-purple);
              }

              .filter-select {
                padding: 10px 14px;
                border-radius: var(--radius-md);
                background: var(--bg-glass);
                border: 1px solid var(--border-subtle);
                color: var(--text-primary);
                font-size: 14px;
                outline: none;
                font-family: inherit;
                cursor: pointer;
              }

              .filter-chips {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
              }

              .filter-chip {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 6px 12px;
                border-radius: var(--radius-pill);
                background: var(--bg-glass);
                border: 1px solid var(--border-subtle);
                color: var(--text-secondary);
                font-size: 12px;
                cursor: pointer;
                transition: all var(--duration-fast) var(--ease-smooth);
                font-family: inherit;
              }

              .filter-chip:hover {
                border-color: var(--border-active);
              }

              .filter-chip.active {
                font-weight: 600;
              }

              .date-range {
                display: flex;
                flex-direction: column;
                gap: 8px;
              }

              .clear-btn {
                margin-top: auto;
                display: inline-flex;
                align-items: center;
                gap: 8px;
              }
            `}</style>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
