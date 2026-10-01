import type { ReactNode } from "react";
import Link from "next/link";

type IconoEstado = "vacio" | "busqueda" | "calendario" | "mensaje";

const ICONOS: Record<IconoEstado, ReactNode> = {
  vacio: (
    <svg
      className="h-10 w-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  busqueda: (
    <svg
      className="h-10 w-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
      />
    </svg>
  ),
  calendario: (
    <svg
      className="h-10 w-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  mensaje: (
    <svg
      className="h-10 w-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
};

export function EstadoVacio({
  titulo,
  descripcion,
  accion,
  icono = "vacio",
}: {
  titulo: string;
  descripcion: string;
  accion?: { href: string; etiqueta: string };
  icono?: IconoEstado;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
      <span className="text-zinc-300 dark:text-zinc-600" aria-hidden="true">
        {ICONOS[icono]}
      </span>
      <p className="text-base font-semibold text-zinc-800 dark:text-zinc-100">{titulo}</p>
      <p className="max-w-sm text-sm text-zinc-500">{descripcion}</p>
      {accion && (
        <Link
          href={accion.href}
          className="mt-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {accion.etiqueta}
        </Link>
      )}
    </div>
  );
}
