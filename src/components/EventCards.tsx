'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CategoryIcon, IconInfo } from '@/components/Icons';
import TarjetaEvento from '@/components/TarjetaEvento';
import { formatearFecha } from '@/lib/utils';
import styles from './EventCards.module.css';

const EVENT_LABELS: Record<string, string> = {
  conciertos: 'Conciertos',
  exposiciones: 'Exposiciones',
  teatro: 'Teatro',
  cine: 'Cine',
  festivales: 'Festivales',
  talleres: 'Talleres',
  deportes: 'Deportes',
  gastronomia: 'Gastronomia',
  otros: 'Otros',
};

interface EventCardsProps {
  eventos: Array<{
    id: string;
    titulo: string;
    categoria: string;
    fechaInicio: Date;
    fechaFin: Date | null;
    localidad: string;
    provincia: string;
    imagen: string | null;
    descripcion: string;
    enlace: string | null;
  }>;
}

export default function EventCards({ eventos }: EventCardsProps) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  return (
    <>
      <div className={styles.agendaGrid}>
        {eventos.map((evento) => (
          <article key={evento.id} className={styles.eventCard}>
            <Image
              src={evento.imagen ?? ''}
              alt={evento.titulo}
              width={1200}
              height={800}
              className={styles.eventImage}
            />
            <div className={styles.eventBody}>
              <div className={styles.eventHeader}>
                <span className={styles.miniTag}>
                  <CategoryIcon category={EVENT_LABELS[evento.categoria] ?? evento.categoria} size={14} />
                  {EVENT_LABELS[evento.categoria] ?? evento.categoria}
                </span>
                <button
                  className={styles.infoButton}
                  onClick={() => setSelectedEvent(evento)}
                  aria-label="Más detalles"
                >
                  <IconInfo size={16} />
                </button>
              </div>
              <h4>{evento.titulo}</h4>
              <p>
                {evento.localidad}, {evento.provincia}
              </p>
              <small>{formatearFecha(evento.fechaInicio.toISOString())}</small>
            </div>
          </article>
        ))}
      </div>

      {selectedEvent && (
        <div className={styles.popupOverlay} onClick={() => setSelectedEvent(null)}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <TarjetaEvento
              evento={{
                id: selectedEvent.id,
                titulo: selectedEvent.titulo,
                descripcion: selectedEvent.descripcion || 'Descripción no disponible',
                categoria: selectedEvent.categoria,
                fechaInicio: selectedEvent.fechaInicio.toISOString(),
                fechaFin: selectedEvent.fechaFin?.toISOString() || null,
                localidad: selectedEvent.localidad,
                provincia: selectedEvent.provincia,
                imagen: selectedEvent.imagen,
                enlace: selectedEvent.enlace,
              }}
              onClose={() => setSelectedEvent(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}