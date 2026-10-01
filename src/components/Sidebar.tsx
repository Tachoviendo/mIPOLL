"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, esRutaActiva } from "@/lib/navegacion";

const ITEMS = [{ href: "/", label: "Inicio" }, ...NAV_ITEMS, { href: "/mensajes", label: "Mensajes" }];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/** Menú lateral para pantallas chicas; en desktop la navegación vive en el Topbar. */
export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="menu-lateral"
        aria-label="Menú"
        aria-hidden={!open}
        inert={!open}
        className={`
          fixed top-0 left-0 z-[70] h-full w-64 bg-white border-r border-zinc-200
          transition-transform duration-200 ease-in-out
          dark:bg-zinc-900 dark:border-zinc-800
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Link
            href="/"
            className="text-lg font-bold text-zinc-950 dark:text-zinc-50"
            onClick={onClose}
          >
            MiPol
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Cerrar menú"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {ITEMS.map((item) => {
            const isActive = esRutaActiva(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`
                  rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
