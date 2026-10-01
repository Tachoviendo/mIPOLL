/**
 * Roles del sistema. Hasta que exista autenticación real, el rol actual se
 * simula con un selector guardado en una cookie (ver `RolSwitcher`).
 */
export type Rol = "estudiante" | "docente" | "administracion" | "publico";

export const ROLES: { valor: Rol; etiqueta: string }[] = [
  { valor: "estudiante", etiqueta: "Estudiante" },
  { valor: "docente", etiqueta: "Docente" },
  { valor: "administracion", etiqueta: "Administración" },
  { valor: "publico", etiqueta: "Público" },
];

export const AUTOR_SIMULADO: Record<Rol, string> = {
  estudiante: "Estudiante (vos)",
  docente: "Docente (vos)",
  administracion: "Administración (vos)",
  publico: "Público",
};

export const ROL_COOKIE = "mipol_rol";
export const ROL_POR_DEFECTO: Rol = "estudiante";

export const NOMBRE_COOKIE = "mipol_nombre";
export const NOMBRE_MAX_LENGTH = 60;

export function esRolValido(valor: string | undefined | null): valor is Rol {
  return ROLES.some((rol) => rol.valor === valor);
}

// FO-10 (Spike): el rol Público tiene acceso de solo lectura a los foros.
// Puede ver categorías, hilos y mensajes, pero no crear hilos, responder ni
// moderar. Estudiantes y Docentes participan; Administración además modera.
export function puedeParticiparEnForos(rol: Rol): boolean {
  return rol === "estudiante" || rol === "docente" || rol === "administracion";
}

export function puedeModerarForos(rol: Rol): boolean {
  return rol === "administracion";
}

// GR: espacios de trabajo por curso/materia (similar a CREA o Google
// Classroom). Docentes y administración crean grupos; los docentes crean
// tareas y hacen seguimiento de entregas; cualquier miembro ve el listado de
// integrantes (con su rol: docente o estudiante) y el público no accede.
export function puedeVerGrupos(rol: Rol): boolean {
  return rol !== "publico";
}

export function puedeVerMiembros(rol: Rol): boolean {
  return (
    rol === "estudiante" || rol === "docente" || rol === "administracion"
  );
}

export function puedeCrearGrupos(rol: Rol): boolean {
  return rol === "docente" || rol === "administracion";
}

export function puedeCrearTareas(rol: Rol): boolean {
  return rol === "docente";
}

export function puedeComentarEnGrupos(rol: Rol): boolean {
  return rol === "estudiante" || rol === "docente" || rol === "administracion";
}

// La entrega de tareas es una acción del estudiante sobre su propio trabajo.
export function puedeEntregarTareas(rol: Rol): boolean {
  return rol === "estudiante";
}
