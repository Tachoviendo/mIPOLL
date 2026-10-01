"use client";

import { useMemo, useState } from "react";
import { EstadoVacio } from "@/components/EstadoVacio";
import {
  type EventoCalendario,
  type TipoEvento,
  eventosCalendario,
  colorPorTipo,
} from "@/data/eventos";

const DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function diasDelMes(anio: number, mes: number): Date[] {
  const primerDia = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0);
  const dias: Date[] = [];

  const inicio = new Date(primerDia);
  inicio.setDate(inicio.getDate() - primerDia.getDay());

  const fin = new Date(ultimoDia);
  fin.setDate(fin.getDate() + (6 - ultimoDia.getDay()));

  const actual = new Date(inicio);
  while (actual <= fin) {
    dias.push(new Date(actual));
    actual.setDate(actual.getDate() + 1);
  }

  return dias;
}

function esMismoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatearDiaISO(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function eventosDelDia(eventos: EventoCalendario[], fecha: Date): EventoCalendario[] {
  const iso = formatearDiaISO(fecha);
  return eventos.filter((ev) => ev.fechaInicio.startsWith(iso));
}

type CalendarioGrillaProps = {
  eventos?: EventoCalendario[];
  filtros?: TipoEvento[];
  onEventoClick?: (evento: EventoCalendario) => void;
};

export function CalendarioGrilla({
  eventos = eventosCalendario,
  filtros = [],
  onEventoClick,
}: CalendarioGrillaProps) {
  const hoy = new Date();
  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());

  const eventosFiltrados = useMemo(() => {
    if (filtros.length === 0) return eventos;
    return eventos.filter((ev) => filtros.includes(ev.tipo));
  }, [eventos, filtros]);

  const dias = useMemo(() => diasDelMes(anioActual, mesActual), [anioActual, mesActual]);

  const mesAnterior = () => {
    if (mesActual === 0) {
      setMesActual(11);
      setAnioActual(anioActual - 1);
    } else {
      setMesActual(mesActual - 1);
    }
  };

  const mesSiguiente = () => {
    if (mesActual === 11) {
      setMesActual(0);
      setAnioActual(anioActual + 1);
    } else {
      setMesActual(mesActual + 1);
    }
  };

  const irAHoy = () => {
    setMesActual(hoy.getMonth());
    setAnioActual(hoy.getFullYear());
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            {MESES[mesActual]} {anioActual}
          </h2>
          <button
            onClick={irAHoy}
            className="rounded-full border border-black/[.08] px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-400 dark:hover:bg-white/[.06]"
          >
            Hoy
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={mesAnterior}
            className="rounded-lg p-2 text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]"
            aria-label="Mes anterior"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={mesSiguiente}
            className="rounded-lg p-2 text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]"
            aria-label="Mes siguiente"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grilla */}
      {eventosFiltrados.length === 0 ? (
        <EstadoVacio
          icono="calendario"
          titulo="Todavía no hay eventos para mostrar"
          descripcion="No se encontraron eventos con los filtros seleccionados. Probá sacar filtros o elegir otro mes."
        />
      ) : (
      <div className="grid grid-cols-7 rounded-xl border border-black/[.08] dark:border-white/[.145] overflow-hidden">
        {/* Encabezados de días */}
        {DIAS_CORTOS.map((dia) => (
          <div
            key={dia}
            className="border-b border-r border-black/[.08] bg-zinc-100 px-2 py-2 text-center text-xs font-medium text-zinc-500 last:border-r-0 dark:border-white/[.145] dark:bg-zinc-800 dark:text-zinc-400"
          >
            {dia}
          </div>
        ))}

        {/* Celdas de días */}
        {dias.map((dia, i) => {
          const esHoy = esMismoDia(dia, hoy);
          const esMesActual = dia.getMonth() === mesActual;
          const eventosDelDiaActual = eventosDelDia(eventosFiltrados, dia);

          return (
            <div
              key={i}
              className={`relative min-h-[80px] border-b border-r border-black/[.08] p-1 last:border-r-0 dark:border-white/[.145] ${
                !esMesActual ? "bg-zinc-50/50 dark:bg-zinc-900/50" : ""
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  esHoy
                    ? "bg-brand-600 text-white"
                    : esMesActual
                      ? "text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {dia.getDate()}
              </span>

              <div className="mt-1 flex flex-col gap-0.5">
                {eventosDelDiaActual.slice(0, 3).map((evento) => (
                  <button
                    key={evento.id}
                    onClick={() => onEventoClick?.(evento)}
                    className="flex items-center gap-1 rounded px-1 py-0.5 text-left text-[10px] font-medium leading-tight text-white truncate hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: colorPorTipo(evento.tipo) }}
                    title={evento.titulo}
                  >
                    {evento.todoElDia ? (
                      <span className="truncate">{evento.titulo}</span>
                    ) : (
                      <>
                        <span className="shrink-0">
                          {new Date(evento.fechaInicio).toLocaleTimeString("es-UY", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                        <span className="truncate">{evento.titulo}</span>
                      </>
                    )}
                  </button>
                ))}
                {eventosDelDiaActual.length > 3 && (
                  <span className="px-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                    +{eventosDelDiaActual.length - 3} más
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
