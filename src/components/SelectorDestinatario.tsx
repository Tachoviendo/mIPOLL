"use client";

import { useState } from "react";
import {
  personas,
  cursos,
  departamentos,
  type Persona,
  type Curso,
  type Departamento,
} from "@/data/destinatarios";

type TipoDestinatario = "persona" | "curso" | "departamento";

export type DestinatarioSeleccionado =
  | { tipo: "persona"; data: Persona }
  | { tipo: "curso"; data: Curso }
  | { tipo: "departamento"; data: Departamento };

type Props = {
  onSeleccionar: (destinatarios: DestinatarioSeleccionado[]) => void;
};

const TABS: { key: TipoDestinatario; label: string }[] = [
  { key: "persona", label: "Persona" },
  { key: "curso", label: "Curso" },
  { key: "departamento", label: "Departamento" },
];

function etiqueta(d: DestinatarioSeleccionado): string {
  switch (d.tipo) {
    case "persona":
      return d.data.nombre;
    case "curso":
      return `Curso ${d.data.nombre}`;
    case "departamento":
      return d.data.nombre;
  }
}

export function SelectorDestinatario({ onSeleccionar }: Props) {
  const [tipoActivo, setTipoActivo] = useState<TipoDestinatario>("persona");
  const [busqueda, setBusqueda] = useState("");
  const [seleccionados, setSeleccionados] = useState<DestinatarioSeleccionado[]>([]);

  const q = busqueda.toLowerCase().trim();

  const resultados: DestinatarioSeleccionado[] =
    tipoActivo === "persona"
      ? personas
          .filter((p) => p.nombre.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
          .map((data) => ({ tipo: "persona" as const, data }))
      : tipoActivo === "curso"
        ? cursos
            .filter((c) => c.nombre.toLowerCase().includes(q))
            .map((data) => ({ tipo: "curso" as const, data }))
        : departamentos
            .filter((d) => d.nombre.toLowerCase().includes(q))
            .map((data) => ({ tipo: "departamento" as const, data }));

  function toggle(destino: DestinatarioSeleccionado) {
    setSeleccionados((prev) => {
      const existe = prev.find((s) => s.tipo === destino.tipo && s.data.id === destino.data.id);
      const nuevos = existe
        ? prev.filter((s) => !(s.tipo === destino.tipo && s.data.id === destino.data.id))
        : [...prev, destino];
      onSeleccionar(nuevos);
      return nuevos;
    });
  }

  function estaSeleccionado(tipo: TipoDestinatario, id: string) {
    return seleccionados.some((s) => s.tipo === tipo && s.data.id === id);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 rounded-lg border border-black/[.08] p-1 dark:border-white/[.145]">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => {
              setTipoActivo(tab.key);
              setBusqueda("");
            }}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tipoActivo === tab.key
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder={`Buscar ${tipoActivo}...`}
        className="rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100"
      />

      {seleccionados.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {seleccionados.map((s) => (
            <span
              key={`${s.tipo}-${s.data.id}`}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              {etiqueta(s)}
              <button
                type="button"
                onClick={() => toggle(s)}
                aria-label={`Quitar ${etiqueta(s)}`}
                className="ml-0.5 rounded-full hover:bg-white/20 dark:hover:bg-zinc-900/20"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <ul className="max-h-48 overflow-y-auto rounded-lg border border-black/[.08] dark:border-white/[.145]">
        {resultados.length === 0 ? (
          <li className="px-3 py-2 text-sm text-zinc-500">No se encontraron resultados</li>
        ) : (
          resultados.map((item) => (
            <li key={`${item.tipo}-${item.data.id}`}>
              <button
                type="button"
                onClick={() => toggle(item)}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                  estaSeleccionado(item.tipo, item.data.id)
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                <span className="text-zinc-950 dark:text-zinc-50">
                  {item.tipo === "curso" && "Curso "}
                  {item.data.nombre}
                  {item.tipo === "persona" && (
                    <span className="ml-2 text-zinc-500">{(item.data as Persona).email}</span>
                  )}
                </span>
                {estaSeleccionado(item.tipo, item.data.id) && (
                  <span className="text-xs text-zinc-500">✓</span>
                )}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
