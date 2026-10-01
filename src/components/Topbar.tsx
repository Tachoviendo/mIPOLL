"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMensajeria } from "@/lib/mensajeria-context";

const NAV_ITEMS = [
  { href: "/lineas", label: "Líneas" },
  { href: "/anuncios", label: "Anuncios" },
  { href: "/calendario", label: "Calendario" },
];

export function Topbar() {
  const { totalNoLeidos } = useMensajeria();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[.08] bg-white/80 backdrop-blur-sm dark:border-white/[.145] dark:bg-zinc-900/80">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
        aria-label="Navegación principal"
      >
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-brand-800 dark:text-brand-200"
          >
            <span className="h-8 w-8 rounded-lg bg-brand-600" aria-hidden="true" />
            <span>MiPol</span>
          </Link>
          <div className="hidden md:flex md:gap-1">
            <Link href="/lineas" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]">
              Líneas
            </Link>
            <Link href="/anuncios" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]">
              Anuncios
            </Link>
            <Link href="/calendario" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]">
              Calendario
            </Link>
            <Link href="/mapa" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]">
              Mapa
            </Link>
            <Link href="/grupos" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]">
              Grupos
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/mensajes"
            className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-brand-50/60 hover:text-brand-700 dark:text-zinc-400 dark:hover:bg-brand-900/30 dark:hover:text-brand-200"
            aria-label="Mensajes"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="hidden sm:inline">Mensajes</span>
            {totalNoLeidos > 0 && (
              <span
                className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white"
                aria-label={`${totalNoLeidos} mensajes no leídos`}
              >
                {totalNoLeidos > 9 ? "9+" : totalNoLeidos}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2 rounded-lg bg-black/[.06] px-3 py-2 text-sm font-medium text-zinc-600 dark:bg-white/[.08] dark:text-zinc-400">
            <span
              className="h-2 w-2 rounded-full bg-teal-500"
              aria-hidden="true"
            />
            <span>Usuario Demo</span>
          </div>
        </div>
      </nav>
    </header>
  );
}