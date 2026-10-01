"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
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

/** Minúsculas y sin tildes, para comparar "Química" con "quimica". */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Coincide si cada palabra buscada aparece en el nombre o el tipo del punto. */
export function buscarPuntos(puntos: PuntoInteres[], consulta: string): PuntoInteres[] {
  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return [];
  return puntos.filter((p) => {
    const texto = normalizar(`${p.nombre} ${ETIQUETAS_TIPO[p.tipo]}`);
    return palabras.every((palabra) => texto.includes(palabra));
  });
}

const ZOOM_BUSQUEDA = 2;

/**
 * Transform que acerca el plano sobre el punto, manteniéndolo centrado
 * salvo cerca de los bordes, donde se limita para no mostrar zonas vacías.
 */
function transformZoom(pos: { left: number; top: number }, escala: number) {
  const margen = 50 / escala;
  const cx = Math.min(Math.max(pos.left, margen), 100 - margen);
  const cy = Math.min(Math.max(pos.top, margen), 100 - margen);
  return {
    transformOrigin: `${cx}% ${cy}%`,
    transform: `translate(${50 - cx}%, ${50 - cy}%) scale(${escala})`,
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
  const [consulta, setConsulta] = useState("");
  const [resultadoActivo, setResultadoActivo] = useState(0);
  const [zoom, setZoom] = useState(false);
  const mapaRef = useRef<HTMLDivElement>(null);
  const idBuscador = useId();
  const idResultados = `${idBuscador}-resultados`;

  const buscando = consulta.trim().length > 0;
  const resultados = buscarPuntos(puntos, consulta);
  const idsResultado = new Set(resultados.map((p) => p.id));
  const escala = zoom && seleccionado ? ZOOM_BUSQUEDA : 1;

  function seleccionarDesdeBusqueda(puntoItem: PuntoInteres) {
    setSeleccionado(puntoItem);
    setZoom(true);
    setConsulta("");
    setResultadoActivo(0);
    mapaRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function cerrarDetalle() {
    setSeleccionado(null);
    setZoom(false);
  }

  function manejarTeclas(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && resultados.length > 0) {
      e.preventDefault();
      setResultadoActivo((i) => (i + 1) % resultados.length);
    } else if (e.key === "ArrowUp" && resultados.length > 0) {
      e.preventDefault();
      setResultadoActivo((i) => (i - 1 + resultados.length) % resultados.length);
    } else if (e.key === "Enter" && resultados[resultadoActivo]) {
      e.preventDefault();
      seleccionarDesdeBusqueda(resultados[resultadoActivo]);
    } else if (e.key === "Escape") {
      setConsulta("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <label htmlFor={idBuscador} className="sr-only">
          Buscar ambiente
        </label>
        <input
          id={idBuscador}
          type="search"
          role="combobox"
          autoComplete="off"
          value={consulta}
          onChange={(e) => {
            setConsulta(e.target.value);
            setResultadoActivo(0);
          }}
          onKeyDown={manejarTeclas}
          placeholder="Buscar ambiente (ej. Laboratorio de Química)"
          aria-expanded={buscando}
          aria-controls={idResultados}
          aria-activedescendant={
            resultados[resultadoActivo] ? `${idResultados}-${resultados[resultadoActivo].id}` : undefined
          }
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30"
        />
        {buscando && (
          <ul
            id={idResultados}
            role="listbox"
            aria-label="Ambientes encontrados"
            className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
          >
            {resultados.length === 0 ? (
              <li className="px-4 py-3 text-sm text-zinc-500">
                No encontramos ambientes con “{consulta.trim()}”.
              </li>
            ) : (
              resultados.map((puntoItem, i) => (
                <li
                  key={puntoItem.id}
                  id={`${idResultados}-${puntoItem.id}`}
                  role="option"
                  aria-selected={i === resultadoActivo}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => seleccionarDesdeBusqueda(puntoItem)}
                  onMouseEnter={() => setResultadoActivo(i)}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm ${
                    i === resultadoActivo ? "bg-zinc-100" : ""
                  }`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: COLOR_TIPO[puntoItem.tipo] }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-zinc-900">{puntoItem.nombre}</span>
                  <span className="ml-auto text-xs text-zinc-500">
                    {ETIQUETAS_TIPO[puntoItem.tipo]}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div
        ref={mapaRef}
        className="relative w-full scroll-mt-24 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
        style={{ aspectRatio: `${planta.viewBox.anchoPx} / ${planta.viewBox.altoPx}` }}
      >
        <div
          className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out"
          style={
            escala > 1 && seleccionado
              ? transformZoom(puntoAlPorcentaje(seleccionado, planta.viewBox), escala)
              : undefined
          }
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
            const atenuado = buscando && !idsResultado.has(puntoItem.id);
            return (
              <button
                key={puntoItem.id}
                type="button"
                onClick={() => (activo ? cerrarDetalle() : setSeleccionado(puntoItem))}
                aria-label={`${puntoItem.nombre} (${ETIQUETAS_TIPO[puntoItem.tipo]})`}
                aria-pressed={activo}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  activo ? "z-20" : "z-10"
                } ${atenuado ? "opacity-30" : ""}`}
                style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              >
                {/* Contraescala: los marcadores mantienen su tamaño al acercar el plano. */}
                <span className="relative block" style={{ transform: `scale(${1 / escala})` }}>
                  {activo && (
                    <span
                      className="absolute inset-0 rounded-full motion-safe:animate-ping"
                      style={{ backgroundColor: color, opacity: 0.6 }}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-125 ${
                      activo ? "scale-125 ring-4 ring-zinc-900/30" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    <span className="h-2 w-2 rounded-full bg-white/90" />
                  </span>
                  <span
                    className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900/90 px-2 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {puntoItem.nombre}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {zoom && seleccionado && (
          <button
            type="button"
            onClick={() => setZoom(false)}
            className="absolute bottom-3 right-3 z-30 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-md hover:bg-white"
          >
            Ver mapa completo
          </button>
        )}
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
              onClick={cerrarDetalle}
              aria-label="Cerrar detalle"
              className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-zinc-600">{seleccionado.descripcion}</p>
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            {planta.nombre}
          </p>
        </div>
      )}
    </div>
  );
}