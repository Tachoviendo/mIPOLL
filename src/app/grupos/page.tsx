import Link from "next/link";

import {
  crearGrupoAction,
  LIMITE_DESCRIPCION_GRUPO,
  LIMITE_NOMBRE_GRUPO,
} from "@/app/grupos/actions";
import {
  nombreDeUsuario,
  obtenerGrupo,
  obtenerGruposParaRol,
  usuarioSimuladoDeRol,
} from "@/data/grupos";
import { obtenerEstudiantes } from "@/data/usuarios";
import { obtenerRolActual } from "@/lib/rol-actual";
import { puedeCrearGrupos, puedeVerGrupos } from "@/lib/roles";

function contarMiembros(grupoId: string): number {
  const grupo = obtenerGrupo(grupoId);
  // Incluye al docente: 1 + estudiantes miembros
  return grupo ? 1 + grupo.miembroIds.length : 0;
}

export default async function GruposPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; creado?: string }>;
}) {
  const { error, creado } = await searchParams;
  const rolActual = await obtenerRolActual();
  const usuarioId = usuarioSimuladoDeRol(rolActual);

  if (!puedeVerGrupos(rolActual)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-white/[.145] dark:bg-white/[.04]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            Grupos
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Acceso restringido</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Esta sección es solo para la comunidad educativa: estudiantes,
            docentes y administración.
          </p>
        </div>
      </div>
    );
  }

  const grupos = obtenerGruposParaRol(rolActual);
  const estudiantes = obtenerEstudiantes();
  const puedeCrear = puedeCrearGrupos(rolActual);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950 dark:bg-black sm:px-10 sm:py-16">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            Espacios de trabajo
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Grupos
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Compartimos novedades, materiales y tareas por curso y materia.
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

        {creado === "ok" && (
          <p
            role="status"
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            Grupo creado: ya aparece en “Mis grupos” de sus integrantes.
          </p>
        )}

        {puedeCrear && (
          <section
            aria-labelledby="crear-heading"
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-white/[.04]"
          >
            <h2 id="crear-heading" className="text-lg font-semibold">
              Crear un grupo
            </h2>
            <form action={crearGrupoAction} className="mt-4 flex flex-col gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label htmlFor="nombre" className="flex flex-col gap-1 text-sm font-medium">
                  Nombre
                  <input
                    id="nombre"
                    name="nombre"
                    required
                    maxLength={LIMITE_NOMBRE_GRUPO}
                    placeholder="Matemática 3° A"
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal text-zinc-900"
                  />
                </label>
                <label htmlFor="materia" className="flex flex-col gap-1 text-sm font-medium">
                  Materia
                  <input
                    id="materia"
                    name="materia"
                    required
                    placeholder="Matemática"
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal text-zinc-900"
                  />
                </label>
              </div>
              <label htmlFor="curso" className="flex flex-col gap-1 text-sm font-medium">
                Curso
                <input
                  id="curso"
                  name="curso"
                  required
                  placeholder="3° A"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal text-zinc-900"
                />
              </label>
              <label htmlFor="descripcion" className="flex flex-col gap-1 text-sm font-medium">
                Descripción (opcional)
                <textarea
                  id="descripcion"
                  name="descripcion"
                  maxLength={LIMITE_DESCRIPCION_GRUPO}
                  rows={2}
                  placeholder="¿Qué se va a trabajar en este grupo?"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal text-zinc-900"
                />
              </label>
              <fieldset>
                <legend className="text-sm font-medium">
                  Miembros
                  <span className="ml-2 text-xs font-normal text-zinc-500">
                    Elegí los estudiantes que formarán parte del grupo.
                  </span>
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {estudiantes.map((estudiante) => (
                    <label
                      key={estudiante.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-white/[.145] dark:hover:bg-white/[.04]"
                    >
                      <input
                        type="checkbox"
                        name="miembros"
                        value={estudiante.id}
                        defaultChecked={estudiante.id === "u1" || estudiante.id === "u5"}
                        className="h-4 w-4 accent-brand-600"
                      />
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {estudiante.nombre}
                      </span>
                      {estudiante.curso && (
                        <span className="text-xs text-zinc-500">{estudiante.curso}</span>
                      )}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button
                type="submit"
                className="self-end rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Crear grupo
              </button>
            </form>
          </section>
        )}

        <section aria-labelledby="grupos-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 id="grupos-heading" className="text-lg font-semibold">
              Mis grupos
            </h2>
            <span className="text-sm text-zinc-500">
              {grupos.length} {grupos.length === 1 ? "grupo" : "grupos"}
            </span>
          </div>

          {grupos.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-white/[.145] dark:bg-white/[.04]">
              {rolActual === "administracion"
                ? "Todavía no hay grupos creados."
                : "Todavía no formás parte de ningún grupo."}
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {grupos.map((grupo) => {
                const esDocenteOCreador = grupo.docenteId === usuarioId;
                return (
                  <li key={grupo.id}>
                    <Link
                      href={`/grupos/${grupo.id}`}
                      className="group block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-white/[.145] dark:bg-white/[.04] dark:hover:border-brand-700"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">
                            {grupo.materia} · {grupo.curso}
                          </p>
                          <h3 className="mt-2 text-xl font-semibold group-hover:text-brand-800 dark:group-hover:text-brand-200">
                            {grupo.nombre}
                          </h3>
                          {grupo.descripcion && (
                            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                              {grupo.descripcion}
                            </p>
                          )}
                          <p className="mt-3 text-sm text-zinc-500">
                            Docente:{" "}
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                              {nombreDeUsuario(grupo.docenteId)}
                            </span>
                            {esDocenteOCreador && (
                              <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                                {rolActual === "administracion" ? "Creado por ti" : "Docente"}
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {contarMiembros(grupo.id)}{" "}
                            {contarMiembros(grupo.id) === 1 ? "integrante" : "integrantes"}
                          </p>
                        </div>
                        <span className="mt-1 shrink-0 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white">
                          Ver muro
                        </span>
                      </div>
                    </Link>
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