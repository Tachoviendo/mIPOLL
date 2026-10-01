import Link from "next/link";

import { CategoriaForoCard } from "@/components/CategoriaForoCard";
import { EstadoVacio } from "@/components/EstadoVacio";
import { HiloForoRow } from "@/components/HiloForoRow";
import {
  buscarHilos,
  categoriasForo,
  contarHilosPorCategoria,
  obtenerCategoriaForo,
} from "@/data/foros";

type ForosPageProps = {
  searchParams: Promise<{ q?: string; categoria?: string; error?: string }>;
};

export default async function ForosPage({ searchParams }: ForosPageProps) {
  const { q, categoria, error } = await searchParams;
  const buscando = Boolean(q?.trim()) || Boolean(categoria);
  const resultados = buscando
    ? buscarHilos({ texto: q, categoriaId: categoria })
    : [];

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950 sm:px-10 sm:py-16">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Comunidad educativa
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Foros
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600 sm:text-lg">
            Explorá las categorías y encontrá el espacio adecuado para participar
            en las conversaciones del liceo.
          </p>
        </header>

        {error && (
          <p
            role="status"
            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            Revisá el formulario: falta completar algún campo.
          </p>
        )}

        <section
          aria-labelledby="buscador-heading"
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <h2 id="buscador-heading" className="text-lg font-semibold">
            Buscar hilos
          </h2>
          <form method="GET" className="mt-4 flex flex-col gap-3 sm:flex-row" role="search">
            <label htmlFor="buscador-texto" className="sr-only">
              Buscar por palabra clave
            </label>
            <input
              id="buscador-texto"
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Buscar por palabra clave..."
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <label htmlFor="buscador-categoria" className="sr-only">
              Filtrar por categoría
            </label>
            <select
              id="buscador-categoria"
              name="categoria"
              defaultValue={categoria ?? ""}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="">Todas las categorías</option>
              {categoriasForo.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Buscar
            </button>
            {buscando && (
              <Link
                href="/foros"
                className="rounded-lg px-4 py-2 text-center text-sm font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Limpiar
              </Link>
            )}
          </form>

          {buscando && (
            <div
              role="region"
              aria-live="polite"
              className="mt-5 overflow-hidden rounded-xl border border-zinc-200"
            >
              <p className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                {resultados.length}{" "}
                {resultados.length === 1 ? "resultado" : "resultados"}
              </p>
              {resultados.length > 0 ? (
                resultados.map((hilo) => (
                  <HiloForoRow
                    key={hilo.id}
                    hilo={hilo}
                    categoriaNombre={obtenerCategoriaForo(hilo.categoriaId)?.nombre}
                  />
                ))
              ) : (
                <EstadoVacio
                  icono="busqueda"
                  titulo="No encontramos hilos con esos criterios"
                  descripcion="Probá con otras palabras clave o cambiá de categoría."
                />
              )}
            </div>
          )}
        </section>

        <section aria-labelledby="categorias-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 id="categorias-heading" className="text-lg font-semibold">
              Categorías
            </h2>
            <span className="text-sm text-zinc-500">
              {categoriasForo.length} disponibles
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {categoriasForo.map((categoriaItem) => (
              <CategoriaForoCard
                key={categoriaItem.id}
                {...categoriaItem}
                cantidadHilos={contarHilosPorCategoria(categoriaItem.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}