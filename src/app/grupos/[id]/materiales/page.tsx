import Link from "next/link";

import {
  etiquetaTipoMaterial,
  obtenerGrupo,
  obtenerMaterialesPorTipo,
  TIPOS_MATERIAL,
  type TipoMaterial,
} from "@/data/grupos";
import { formatearFecha } from "@/lib/date";
import { obtenerRolActual } from "@/lib/rol-actual";
import { puedeVerGrupos } from "@/lib/roles";

export default async function MaterialesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tipo?: TipoMaterial }>;
}) {
  const { id: grupoId } = await params;
  const { tipo } = await searchParams;
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

  const materiales = obtenerMaterialesPorTipo(grupoId, tipo);

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
            Materiales
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Guías, apuntes, presentaciones y recursos compartidos por el docente.
          </p>
        </header>

        <nav aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
          <Link
            href={`/grupos/${grupoId}/materiales`}
            className={
              !tipo
                ? "rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white"
                : "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:border-white/[.145] dark:text-zinc-400 dark:hover:bg-white/[.06]"
            }
          >
            Todos
          </Link>
          {TIPOS_MATERIAL.map((t) => {
            const activo = tipo === t.valor;
            return (
              <Link
                key={t.valor}
                href={
                  activo
                    ? `/grupos/${grupoId}/materiales`
                    : `/grupos/${grupoId}/materiales?tipo=${t.valor}`
                }
                className={
                  activo
                    ? "rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white"
                    : "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:border-white/[.145] dark:text-zinc-400 dark:hover:bg-white/[.06]"
                }
              >
                {t.etiqueta}
              </Link>
            );
          })}
        </nav>

        <section aria-labelledby="materiales-heading">
          <h2 id="materiales-heading" className="mb-4 text-lg font-semibold">
            Recursos compartidos
          </h2>
          {materiales.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-white/[.145] dark:bg-white/[.04]">
              No hay materiales con ese filtro.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {materiales.map((material) => (
                <li
                  key={material.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/[.145] dark:bg-white/[.04]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">
                      {etiquetaTipoMaterial(material.tipo)}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{material.titulo}</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      Publicado el {formatearFecha(material.fecha)}
                      {material.tamanoKb ? ` · ${material.tamanoKb} KB` : ""}
                    </p>
                  </div>
                  <a
                    href={material.url}
                    className="shrink-0 rounded-lg border border-brand-600 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    Ver
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}