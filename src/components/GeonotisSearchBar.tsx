'use client';

import { FormEvent } from 'react';
import { IconMic, IconSearch, IconX } from '@/components/Icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isSearching?: boolean;
  className?: string;
  variant?: 'embedded' | 'floating';
}

export default function GeonotisSearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Buscar...',
  isSearching = false,
  className = '',
  variant = 'embedded',
}: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(value.trim());
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`geonotis-search ${variant} ${className}`}>
      <div className="search-shell">
        <div className="search-glow" />
        <form onSubmit={handleSubmit} className="search-form">
          <span className="search-icon">
            <IconSearch size={22} strokeWidth={2.5} />
          </span>
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
          />
          {value && !isSearching ? (
            <button type="button" className="icon-button clear-button" onClick={handleClear} aria-label="Limpiar busqueda">
              <IconX size={18} strokeWidth={2.5} />
            </button>
          ) : null}
          {isSearching ? (
            <span className="spinner" aria-label="Buscando" />
          ) : (
            <button type="submit" className="icon-button submit-button" aria-label="Buscar">
              <IconMic size={22} strokeWidth={2.5} />
            </button>
          )}
        </form>
      </div>

      <style jsx>{`
        .geonotis-search {
          width: 100%;
          max-width: 460px;
        }

        .geonotis-search.floating {
          position: absolute;
          left: 50%;
          top: 124px;
          bottom: auto;
          transform: translateX(-50%);
          z-index: 950;
          width: min(90%, 460px);
          pointer-events: auto;
        }

        .search-shell {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
        }

        .search-glow {
          position: absolute;
          inset: -1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.42), transparent);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.7s ease;
        }

        .search-shell:hover .search-glow,
        .search-shell:focus-within .search-glow {
          opacity: 1;
          animation: shimmer 1.8s linear infinite;
        }

        .search-form {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: color-mix(in srgb, var(--bg-primary) 82%, transparent);
          backdrop-filter: blur(32px) saturate(220%);
          -webkit-backdrop-filter: blur(32px) saturate(220%);
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .geonotis-search.embedded .search-form {
          background: color-mix(in srgb, var(--surface-strong) 72%, transparent);
          border-color: color-mix(in srgb, var(--border-subtle) 70%, rgba(255, 255, 255, 0.35));
        }

        .search-form:focus-within {
          border-color: rgba(255, 255, 255, 0.66);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-accent) 14%, transparent);
        }

        .search-icon {
          display: flex;
          flex: 0 0 auto;
          padding-left: 20px;
          color: var(--text-primary);
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.18));
        }

        .geonotis-search.floating .search-icon,
        .geonotis-search.floating input,
        .geonotis-search.floating .icon-button {
          color: var(--text-primary);
        }

        input {
          min-width: 0;
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: var(--text-primary);
          padding: 14px 12px;
          font: inherit;
          font-size: 17px;
          font-weight: 650;
        }

        input::placeholder {
          color: color-mix(in srgb, currentColor 62%, transparent);
        }

        .icon-button {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.18s ease, transform 0.18s ease;
        }

        .icon-button:hover {
          color: var(--text-primary);
        }

        .icon-button:active {
          transform: scale(0.94);
        }

        .clear-button {
          padding: 0 10px 0 4px;
        }

        .submit-button {
          padding: 0 20px 0 6px;
          opacity: 0.78;
        }

        .spinner {
          flex: 0 0 auto;
          width: 20px;
          height: 20px;
          margin-right: 20px;
          border-radius: 50%;
          border: 2px solid currentColor;
          border-top-color: transparent;
          color: var(--text-primary);
          animation: spin 0.8s linear infinite;
        }

        .geonotis-search.floating .spinner {
          color: var(--text-primary);
        }

        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .geonotis-search.floating {
            top: 146px;
          }

          input {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
