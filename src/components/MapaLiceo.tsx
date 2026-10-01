"use client";

import { useState } from "react";
import { obtenerPlanta } from "@/data/planos";
import {
  puntosPorPiso,
  type Piso,
  type PuntoInteres,
  type TipoPuntoInteres,
} from "@/data/puntos-interes";

const ETIQUETAS_TIPO: Record<TipoPuntoInteres, string> = {
  aula: "Aula",
  biblioteca: "Biblioteca",
  laboratorio: "Laboratorio",
  direccion: "Dirección",
  comedor: "Comedor",
  banos: "Baños",
  entrada: "Entrada",
  escalera: "Escaleras",
  patio: "Patio",
};

const COLOR_TIPO: Record<TipoPuntoInteres, string> = {
  aula: "#0f4c81",
  biblioteca: "#1b7fb0",
  laboratorio: "#f5a623",
  direccion: "#2f855a",
  comedor: "#0ea5e9",
  banos: "#64748b",
  entrada: "#16a34a",
  escalera: "#94a3b8",
  patio: "#65a30d",
};

function puntoAlPorcentaje(punto: PuntoInteres, viewBox: { anchoPx: number; altoPx: number }) {
  return {
    left: (punto.coordenadas.x / viewBox.anchoPx) * 100,
    top: (punto.coordenadas.y / viewBox.altoPx) * 100,
  };
}

export function MapaLiceo({
  piso = "planta-baja",
}: {
  piso?: Piso;
}) {
  const planta = obtenerPlanta("planta-baja");
  const puntos = puntosPorPiso(piso);
  const [seleccionado, setSeleccionado] = useState<PuntoInteres | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
        style={{ aspectRatio: `${planta.viewBox.anchoPx} / ${planta.viewBox.altoPx}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático del plano */}
        <img
          src={planta.assetPath}
          alt={planta.nombre}
          className="absolute inset-0 h-full w-full object-contain"
        />

        {puntos.map((puntoItem) => {
          const pos = puntoAlPorcentaje(puntoItem, planta.viewBox);
          const color = COLOR_TIPO[puntoItem.tipo];
          const activo = seleccionado?.id === puntoItem.id;
          return (
            <button
              key={puntoItem.id}
              type="button"
              onClick={() => setSeleccionado(activo ? null : puntoItem)}
              aria-label={`${puntoItem.nombre} (${ETIQUETAS_TIPO[puntoItem.tipo]})`}
              aria-pressed={activo}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-125"
                style={{ backgroundColor: color }}
              >
                <span className="h-2 w-2 rounded-full bg-white/90" />
              </span>
              <span
                className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900/90 px-2 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                {puntoItem.nombre}
              </span>
            </button>
          );
        })}
      </div>

      {seleccionado && (
        <div
          className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          role="dialog"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: COLOR_TIPO[seleccionado.tipo] }}
              >
                {ETIQUETAS_TIPO[seleccionado.tipo]}
              </span>
              <h3 className="mt-2 text-base font-semibold text-zinc-900">
                {seleccionado.nombre}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSeleccionado(null)}
              aria-label="Cerrar detalle"
              className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-zinc-600">{seleccionado.descripcion}</p>
          {seleccionado.horario && (
            <p className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-900">Horario: </span>
              {seleccionado.horario}
            </p>
          )}
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            {planta.nombre}
          </p>
        </div>
      )}
    </div>
  );
}