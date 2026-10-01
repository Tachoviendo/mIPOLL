"use client";

import { useState } from "react";
import Link from "next/link";

import { AdminLogin } from "@/components/AdminLogin";
import { NovedadTransporteForm } from "@/components/NovedadTransporteForm";
import { RequireRole } from "@/components/RequireRole";
import {
  SelectorDestinatario,
  type DestinatarioSeleccionado,
} from "@/components/SelectorDestinatario";
import { anuncios } from "@/data/ejemplo";
import { novedadesTransporte } from "@/data/novedades";
import { lineas } from "@/data/transporte";
import { formatearFecha } from "@/lib/date";

/**
 * `src/app/anuncios`: listado de anuncios y novedades de transporte.
 * Incluye formulario de publicación para administradores.
 */
export default function AnunciosPage() {
  const [destinatarios, setDestinatarios] = useState<DestinatarioSeleccionado[]>([]);

  // Combinar anuncios y novedades, ordenar por fecha descendente
  const todosLosAnuncios = [
    ...anuncios.map((a) => ({ ...a, tipo: "anuncio" as const, lineaId: undefined })),
    ...novedadesTransporte.map((n) => ({
      id: n.id,
      titulo: n.titulo,
      descripcion: n.descripcion,
      fecha: n.fecha,
      tipo: "novedad" as const,
      novedadTipo: n.tipo,
      prioridad: n.prioridad,
      lineaId: n.lineaId,
    })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20";
      case "media":
        return "border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20";
      case "baja":
        return "border-l-4 border-brand-500 bg-brand-50 dark:bg-brand-900/20";
      default:
        return "";
    }
  };

  const getTipoBadge = (tipo: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      demora: { label: "Demora", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
      cambio_ruta: { label: "Cambio ruta", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
      suspension: { label: "Suspensión", className: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400" },
      otro: { label: "Otro", className: "bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-300" },
    };
    return badges[tipo] || { label: tipo, className: "bg-zinc-100 text-zinc-800" };
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Anuncios y novedades
          </h1>
          <div className="flex items-center gap-4">
            <AdminLogin />
            <Link
              href="/lineas"
              className="text-sm text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
            >
              Ver líneas →
            </Link>
          </div>
        </div>

        {/* Formulario de publicación (solo admin) */}
        <NovedadTransporteForm />

        {/* Nuevo aviso: selección de destinatarios (solo administración) */}
        <RequireRole roles={["administracion"]}>
          <section className="rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-900">
            <h2 className="mb-3 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              Nuevo aviso
            </h2>
            <SelectorDestinatario onSeleccionar={setDestinatarios} />
            {destinatarios.length > 0 && (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                Enviando a:{" "}
                {destinatarios
                  .map((d) => (d.tipo === "curso" ? `Curso ${d.data.nombre}` : d.data.nombre))
                  .join(", ")}
              </p>
            )}
          </section>
        </RequireRole>

        <div className="flex flex-col gap-3">
          {todosLosAnuncios.length === 0 ? (
            <p className="py-8 text-center text-zinc-600 dark:text-zinc-400">
              No hay anuncios ni novedades disponibles
            </p>
          ) : (
            todosLosAnuncios.map((item) => {
              const isNovedad = item.tipo === "novedad";
              const linea = item.lineaId ? lineas.find((l) => l.id === item.lineaId) : null;

              return (
                <article
                  key={item.id}
                  className={`rounded-lg border border-black/[.08] p-5 dark:border-white/[.145] ${
                    isNovedad ? getPrioridadColor(item.prioridad) : ""
                  }`}
                >
                  <div className="flex flex-wrap items-start gap-2">
                    <h2 className="flex-1 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                      {item.titulo}
                    </h2>
                    {isNovedad && (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTipoBadge(
                          item.novedadTipo
                        ).className}`}
                      >
                        {getTipoBadge(item.novedadTipo).label}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.descripcion}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <time dateTime={item.fecha}>
                      {formatearFecha(item.fecha)}
                    </time>
                    {linea && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                        style={{ backgroundColor: `${linea.color}20`, color: linea.color }}
                      >
                        {linea.nombre}
                      </span>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}