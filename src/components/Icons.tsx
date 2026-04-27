import * as React from 'react';
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (size = 20): Partial<IconProps> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

export function IconHome({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function IconMap({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

export function IconTag({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export function IconInfo({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function IconSun({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function IconMoon({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function IconCastle({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M2 20h20M4 20V8l2-2V3h2v3h2V3h2v3h4V3h2v3h2V3h2v3l2 2v12" />
      <rect x="9" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

export function IconMusic({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export function IconTheater({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
    </svg>
  );
}

export function IconPalette({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" stroke="none" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.23-.29-.38-.63-.38-1.04 0-.93.76-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.17-4.49-9-10-9z" />
    </svg>
  );
}

export function IconBook({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export function IconMic({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

export function IconCalendar({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function IconPin({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function IconSearch({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function IconFilter({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}

export function IconX({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function IconExternalLink({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function IconGlobe({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function IconList({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2.5" />
      <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2.5" />
      <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2.5" />
    </svg>
  );
}

export function IconBed({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v3" />
    </svg>
  );
}

export function IconUtensils({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  );
}

export function IconDumbbell({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M6.5 6.5h11M3 11h18M6.5 17.5h11" />
      <rect x="2" y="6.5" width="4" height="11" rx="1" />
      <rect x="18" y="6.5" width="4" height="11" rx="1" />
    </svg>
  );
}

export function IconGraduationCap({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
      <line x1="22" y1="10" x2="22" y2="16" />
    </svg>
  );
}

export function IconHeart({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function IconBriefcase({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export function IconShoppingBag({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export function IconPlane({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

export function IconSparkles({ size, ...p }: IconProps = {}) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, React.FC<IconProps>> = {
  Conciertos: IconMusic,
  Espectaculos: IconTheater,
  'Espectáculos': IconTheater,
  Exposiciones: IconPalette,
  'Libros y Lectura': IconBook,
  'Conferencias y Cursos': IconMic,
  Otros: IconSparkles,
  Alojamiento: IconBed,
  'Comer y beber': IconUtensils,
  'Cultura y ocio': IconPalette,
  Deportes: IconDumbbell,
  Formacion: IconGraduationCap,
  Formación: IconGraduationCap,
  Restauracion: IconUtensils,
  Restauración: IconUtensils,
  'Salud y belleza': IconHeart,
  Servicios: IconBriefcase,
  Ventas: IconShoppingBag,
  'Viajes y Transporte': IconPlane,
  Tecnologia: IconSparkles,
  Tecnología: IconSparkles,
  Gastronomia: IconUtensils,
  Gastronomía: IconUtensils,
};

export function CategoryIcon({
  category,
  ...props
}: IconProps & { category: string }) {
  const Icon = CATEGORY_ICONS[category] || IconSparkles;
  return <Icon {...props} />;
}
