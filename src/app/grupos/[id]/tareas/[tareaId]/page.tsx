import Link from "next/link";

import { entregarTareaAction } from "@/app/grupos/actions";
import {
  obtenerGrupo,
  obtenerSeguimientoTarea,
  obtenerTarea,
  usuarioSimuladoDeRol,
} from "@/data/grupos";
import { formatearFecha, formatearFechaHora } from "@/lib/date";
import { obtenerRolActual } from "@/lib/rol-actual";
import { puedeEntregarTareas, puedeVerGrupos } from "@/lib/roles";

function estadosDeEntrega(estado: string): { etiqueta: string; clases: string } {
  switch (estado) {
    case "entregada":
      return {
        etiqueta: "Entregada",
        clases: "border-sky-300 bg-sky-50 text-sky-800",
      };
    case "calificada":
      return {
        etiqueta: "Calificada",
        clases: "border-emerald-300 bg-emerald-50 text-emerald-800",
      };
    default:
      return {
        etiqueta: "Pendiente",
        clases: "border-amber-300 bg-amber-50 text-amber-800",
      };
  }
}

export default async function TareaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; tareaId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id: grupoId, tareaId } = await params;
  const { error } = await searchParams;
  const rolActual = await obtenerRolActual();

  if (!puedeVerGrupos(rolActual)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          Acceso restringido.
        </p>
      </div>
    );
  }

  const grupo = obtenerGrupo(grupoId);
  const tarea = obtenerTarea(tareaId);

  if (!grupo || !tarea || tarea.grupoId !== grupoId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold">Tarea no encontrada</h1>
          <Link
            href={`/grupos/${grupoId}/tareas`}
            className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Volver a Tareas
          </Link>
        </div>
      </div>
    );
  }

  const usuarioId = usuarioSimuladoDeRol(rolActual);
  const esDocenteDelGrupo =
    grupo.docenteId === usuarioId && rolActual === "docente";
  const seguimiento = obtenerSeguimientoTarea(tarea);
  const total = tarea.entregas.length;

  const miEntrega =
    rolActual === "estudiante"
      ? tarea.entregas.find((e) => e.estudianteId === usuarioId)
      : undefined;
  const puedeEntregar =
    puedeEntregarTareas(rolActual) && miEntrega?.estado === "pendiente";

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950 dark:bg-black sm:px-10 sm:py-16">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header>
          <Link
            href={`/grupos/${grupoId}/tareas`}
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            ← Volver a Tareas
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            {grupo.materia} · {grupo.curso}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {tarea.titulo}
          </h1>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Entrega: <span className="font-medium">{formatearFecha(tarea.fechaEntrega)}</span>
          </p>
        </header>

        {error && (
          <p
            role="status"
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            No se pudo completar la acción.
          </p>
        )}

        <section
          aria-labelledby="consigna-heading"
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-white/[.04]"
        >
          <h2 id="consigna-heading" className="text-lg font-semibold">
            Consigna
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-800 dark:text-zinc-200">
            {tarea.consigna}
          </p>
          <p className="mt-6 border-t border-zinc-100 pt-4 text-xs text-zinc-500 dark:border-white/[.06]">
            Publicada por el docente · {formatearFechaHora(tarea.fechaCreacion)}
          </p>
        </section>

        {rolActual === "estudiante" && (
          <section
            aria-labelledby="entrega-heading"
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-white/[.04]"
          >
            <h2 id="entrega-heading" className="text-lg font-semibold">
              Tu entrega
            </h2>
            {miEntrega && (
              <>
                <div className="mt-4 flex items-center gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-medium ${
                      estadosDeEntrega(miEntrega.estado).clases
                    }`}
                  >
                    {estadosDeEntrega(miEntrega.estado).etiqueta}
                  </span>
                  {miEntrega.nota !== undefined && (
                    <span className="text-sm font-semibold text-emerald-700">
                      Nota: {miEntrega.nota}
                    </span>
                  )}
                </div>
                {miEntrega.entregadaEn && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Entregada el {formatearFechaHora(miEntrega.entregadaEn)}
                  </p>
                )}
                {puedeEntregar && (
                  <form action={entregarTareaAction} className="mt-4">
                    <input type="hidden" name="grupoId" value={grupo.id} />
                    <input type="hidden" name="tareaId" value={tarea.id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                    >
                      Marcar como entregada
                    </button>
                  </form>
                )}
              </>
            )}
          </section>
        )}

        {esDocenteDelGrupo && (
          <section
            aria-labelledby="seguimiento-heading"
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-white/[.04]"
          >
            <h2 id="seguimiento-heading" className="text-lg font-semibold">
              Seguimiento de entregas
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {total - tarea.entregas.filter((e) => e.estado === "pendiente").length} de{" "}
              {total} estudiantes entregaron la tarea.
            </p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {seguimiento.map(({ entrega, estudiante }) => {
                const s = estadosDeEntrega(entrega.estado);
                return (
                  <li
                    key={entrega.estudianteId}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5"
                  >
                    <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                      {estudiante.nombre}
                      <span className="ml-2 text-xs text-zinc-500">({estudiante.curso})</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {entrega.nota !== undefined && (
                        <span className="text-sm font-semibold text-emerald-700">
                          Nota: {entrega.nota}
                        </span>
                      )}
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${s.clases}`}
                      >
                        {s.etiqueta}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}