import Link from "next/link";

import {
  etiquetaRolEnGrupo,
  obtenerGrupo,
  obtenerMiembrosDeGrupo,
  usuarioSimuladoDeRol,
} from "@/data/grupos";
import { obtenerRolActual } from "@/lib/rol-actual";
import { puedeVerGrupos, puedeVerMiembros } from "@/lib/roles";

export default async function MiembrosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: grupoId } = await params;
  const rolActual = await obtenerRolActual();

  if (!puedeVerGrupos(rolActual) || !puedeVerMiembros(rolActual)) {
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

  const miembros = obtenerMiembrosDeGrupo(grupo);
  const usuarioId = usuarioSimuladoDeRol(rolActual);
  const totalDocentes = miembros.filter((m) => m.rol === "docente").length;
  const totalEstudiantes = miembros.filter((m) => m.rol === "estudiante").length;

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
            Miembros
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Estas son las personas que integran el grupo y su rol dentro de él.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {miembros.length} {miembros.length === 1 ? "integrante" : "integrantes"} ·{" "}
            {totalDocentes} {totalDocentes === 1 ? "docente" : "docentes"} ·{" "}
            {totalEstudiantes} {totalEstudiantes === 1 ? "estudiante" : "estudiantes"}
          </p>
        </header>

        <section aria-labelledby="miembros-heading">
          <h2 id="miembros-heading" className="mb-4 text-lg font-semibold">
            Integrantes
          </h2>
          <ul className="flex flex-col gap-3">
            {miembros.map(({ usuario, rol }) => {
              const soyYo = usuario.id === usuarioId;
              return (
                <li
                  key={usuario.id}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/[.145] dark:bg-white/[.04]"
                >
                  {usuario.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={usuario.avatar}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white">
                      {usuario.nombre.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {usuario.nombre}
                      {soyYo && (
                        <span className="ml-2 text-xs font-medium text-brand-700 dark:text-brand-200">
                          (vos)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {rol === "docente"
                        ? usuario.departamento
                          ? `Docente del grupo · ${usuario.departamento}`
                          : "Docente del grupo"
                        : usuario.curso
                          ? `Estudiante · ${usuario.curso}`
                          : "Estudiante"}
                    </p>
                  </div>
                  <span
                    className={
                      rol === "docente"
                        ? "shrink-0 rounded-full border border-brand-300 bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700"
                        : "shrink-0 rounded-full border border-zinc-300 bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:border-white/[.145] dark:bg-white/[.04]"
                    }
                  >
                    {etiquetaRolEnGrupo(rol)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}