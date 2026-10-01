import Link from "next/link";

import {
  crearTareaAction,
  LIMITE_CONSIGNA_TAREA,
  LIMITE_TITULO_TAREA,
} from "@/app/grupos/actions";
import { EstadoVacio } from "@/components/EstadoVacio";
import {
  contarEntregadas,
  obtenerGrupo,
  obtenerMiembrosDeGrupo,
  obtenerSeguimientoTarea,
  obtenerTareasDeGrupo,
  usuarioSimuladoDeRol,
} from "@/data/grupos";
import { obtenerRolActual } from "@/lib/rol-actual";
import { puedeCrearTareas, puedeVerGrupos } from "@/lib/roles";

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

export default async function TareasPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; crear?: string }>;
}) {
  const { id: grupoId } = await params;
  const { error, crear } = await searchParams;
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
  if (!grupo) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold">Grupo no encontrado</h1>
          <Link
            href="/grupos"
            className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Volver a Grupos
          </Link>
        </div>
      </div>
    );
  }

  const tareas = obtenerTareasDeGrupo(grupoId);
  const usuarioId = usuarioSimuladoDeRol(rolActual);
  const esDocenteDelGrupo =
    grupo.docenteId === usuarioId && puedeCrearTareas(rolActual);
  const puedeCrear = esDocenteDelGrupo;
  const totalMiembros = obtenerMiembrosDeGrupo(grupo).filter(
    (m) => m.rol === "estudiante",
  ).length;

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950 dark:bg-black sm:px-10 sm:py-16">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header>
          <Link
            href={`/grupos/${grupoId}`}
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            ← Volver al muro
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            {grupo.materia} · {grupo.curso}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Tareas
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Acá están las tareas del grupo. {esDocenteDelGrupo
              ? "Como docente podés crear tareas nuevas y ver quiénes ya entregaron."
              : "Abri una tarea para leer la consigna completa."}
          </p>
        </header>

        {error && (
          <p
            role="status"
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            No se pudo completar la acción: revisá los datos e intentá de nuevo.
          </p>
        )}

        {puedeCrear && (
          <section
            id="crearTarea"
            aria-labelledby="crear-tarea-heading"
            className="scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-white/[.04]"
          >
            <h2 id="crear-tarea-heading" className="text-lg font-semibold">
              {tareas.length === 0 ? "Crear la primera tarea" : "Crear tarea"}
            </h2>
            {crear === "1" && tareas.length === 0 && (
              <p role="status" className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Este grupo todavía no tiene tareas: creá la primera para que los
                estudiantes empiecen a trabajarla.
              </p>
            )}
            <form action={crearTareaAction} className="mt-4 flex flex-col gap-3">
              <input type="hidden" name="grupoId" value={grupo.id} />
              <label htmlFor="titulo" className="flex flex-col gap-1 text-sm font-medium">
                Título
                <input
                  id="titulo"
                  name="titulo"
                  required
                  maxLength={LIMITE_TITULO_TAREA}
                  placeholder="Actividad: sistemas de ecuaciones"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal text-zinc-900"
                />
              </label>
              <label htmlFor="consigna" className="flex flex-col gap-1 text-sm font-medium">
                Consigna
                <textarea
                  id="consigna"
                  name="consigna"
                  required
                  maxLength={LIMITE_CONSIGNA_TAREA}
                  rows={5}
                  placeholder="Detallá los pasos, el formato de entrega y lo que se evalúa…"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal text-zinc-900"
                />
              </label>
              <label htmlFor="fechaEntrega" className="flex flex-col gap-1 text-sm font-medium">
                Fecha de entrega
                <input
                  id="fechaEntrega"
                  name="fechaEntrega"
                  type="datetime-local"
                  required
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal text-zinc-900"
                />
              </label>
              <button
                type="submit"
                className="self-end rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Crear tarea
              </button>
            </form>
          </section>
        )}

        <section aria-labelledby="tareas-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 id="tareas-heading" className="text-lg font-semibold">
              Tareas del grupo
            </h2>
            <span className="text-sm text-zinc-500">
              {tareas.length} {tareas.length === 1 ? "tarea" : "tareas"}
            </span>
          </div>

          {tareas.length === 0 ? (
            esDocenteDelGrupo ? (
              <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-white/[.145] dark:bg-white/[.04]">
                <EstadoVacio
                  titulo="Todavía no hay tareas cargadas"
                  descripcion="Recién creaste este grupo. Creá la primera tarea para que tus estudiantes sepan qué tienen que hacer."
                  accion={{ href: `#crearTarea`, etiqueta: "Crear la primera tarea" }}
                />
              </div>
            ) : (
              <EstadoVacio
                titulo="Todavía no hay tareas"
                descripcion="El docente todavía no cargó tareas en este grupo."
              />
            )
          ) : (
            <ul className="flex flex-col gap-4">
              {tareas.map((tarea) => {
                const entregadas = contarEntregadas(tarea);
                const seguimiento = obtenerSeguimientoTarea(tarea);
                return (
                  <li
                    key={tarea.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/[.145] dark:bg-white/[.04]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold">
                          <Link
                            href={`/grupos/${grupoId}/tareas/${tarea.id}`}
                            className="hover:text-brand-800 dark:hover:text-brand-200"
                          >
                            {tarea.titulo}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-600 line-clamp-2 dark:text-zinc-400">
                          {tarea.consigna}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                          <span>
                            Entrega:{" "}
                            {new Date(tarea.fechaEntrega).toLocaleDateString("es-UY", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                          {esDocenteDelGrupo && (
                            <span className="rounded-full border border-zinc-300 bg-zinc-50 px-2 py-0.5 font-medium text-zinc-700">
                              {entregadas} de {totalMiembros} entregaron
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/grupos/${grupoId}/tareas/${tarea.id}`}
                        className="mt-1 shrink-0 rounded-lg border border-brand-600 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                      >
                        Ver
                      </Link>
                    </div>

                    {esDocenteDelGrupo && (
                      <div className="mt-4 rounded-xl bg-zinc-50 p-4 dark:bg-white/[.03]">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          Seguimiento de entregas
                        </p>
                        <ul className="mt-3 flex flex-col gap-1.5">
                          {seguimiento.map(({ entrega, estudiante }) => {
                            const s = estadosDeEntrega(entrega.estado);
                            return (
                              <li
                                key={entrega.estudianteId}
                                className="flex items-center justify-between gap-3"
                              >
                                <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                                  {estudiante.nombre}
                                  <span className="ml-2 text-xs text-zinc-500">
                                    ({estudiante.curso})
                                  </span>
                                </span>
                                <span
                                  className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${s.clases}`}
                                >
                                  {s.etiqueta}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}