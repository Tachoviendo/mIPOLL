export type ItemNavegacion = { href: string; label: string };

/** Secciones principales; las comparten el Topbar (desktop) y el Sidebar (mobile). */
export const NAV_ITEMS: ItemNavegacion[] = [
  { href: "/lineas", label: "Líneas" },
  { href: "/anuncios", label: "Anuncios" },
  { href: "/calendario", label: "Calendario" },
  { href: "/mapa", label: "Mapa" },
  { href: "/grupos", label: "Grupos" },
  { href: "/foros", label: "Foros" },
  { href: "/oferta", label: "Oferta educativa" },
];

export function esRutaActiva(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
