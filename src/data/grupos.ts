/**
 * `src/data/grupos.ts`: datos mock del módulo de espacios de trabajo por
 * curso/materia (similar a CREA o Google Classroom).
 *
 * - Docentes y administración crean grupos con nombre, materia, curso y
 *   miembros; los docentes crean tareas y hacen seguimiento de entregas.
 * - Cualquier miembro puede ver el listado de integrantes con su rol dentro
 *   del grupo (docente o estudiante).
 * - Cuando un grupo recién creado no tiene publicaciones ni tareas, el
 *   docente ve un estado vacío (F-08) que lo invita a cargar el primer
 *   contenido.
 *
 * Cada tarea conserva las `entregas` por estudiante: estado (pendiente /
 * entregada / calificada), nota y fecha de entrega.
 *
 * Los arreglos son mutables en memoria (como `foros.ts`) para que las Server
 * Actions puedan mutarlos sin backend real.
 */

import { usuarios, type Usuario } from "@/data/usuarios";
import type { Rol } from "@/lib/roles";

export type Grupo = {
  id: string;
  nombre: string;
  materia: string;
  docenteId: string;
  curso: string;
  miembroIds: string[];
  descripcion?: string;
};

/** Rol de un usuario dentro de un grupo: quien lo dicta o un estudiante. */
export type RolEnGrupo = "docente" | "estudiante";

export type TipoMaterial =
  | "guia"
  | "apunte"
  | "presentacion"
  | "video"
  | "ejercicios"
  | "enlace";

export type Material = {
  id: string;
  grupoId: string;
  titulo: string;
  tipo: TipoMaterial;
  url?: string;
  publicadoPorId: string;
  fecha: string;
  tamanoKb?: number;
};

export type Publicacion = {
  id: string;
  grupoId: string;
  autorId: string;
  contenido: string;
  fecha: string;
};

export type Comentario = {
  id: string;
  publicacionId: string;
  autorId: string;
  contenido: string;
  fecha: string;
};

export type EstadoTarea = "pendiente" | "entregada" | "calificada";

/** Entrega de un estudiante dentro de una tarea. */
export type Entrega = {
  estudianteId: string;
  estado: EstadoTarea;
  nota?: number;
  entregadaEn?: string;
};

/**
 * Tarea del grupo. `entregas` guarda el estado de cada estudiante, lo que
 * permite al docente ver quiénes entregaron y quiénes faltan.
 */
export type Tarea = {
  id: string;
  grupoId: string;
  titulo: string;
  consigna: string;
  docenteId: string;
  fechaCreacion: string;
  fechaEntrega: string;
  entregas: Entrega[];
};

export const TIPOS_MATERIAL: { valor: TipoMaterial; etiqueta: string }[] = [
  { valor: "guia", etiqueta: "Guía" },
  { valor: "apunte", etiqueta: "Apunte" },
  { valor: "presentacion", etiqueta: "Presentación" },
  { valor: "video", etiqueta: "Video" },
  { valor: "ejercicios", etiqueta: "Ejercicios" },
  { valor: "enlace", etiqueta: "Enlace" },
];

export const ESTADOS_TAREA: { valor: EstadoTarea; etiqueta: string }[] = [
  { valor: "pendiente", etiqueta: "Pendiente" },
  { valor: "entregada", etiqueta: "Entregada" },
  { valor: "calificada", etiqueta: "Calificada" },
];

export function etiquetaEstadoTarea(estado: EstadoTarea): string {
  return ESTADOS_TAREA.find((e) => e.valor === estado)?.etiqueta ?? estado;
}

export function etiquetaTipoMaterial(tipo: TipoMaterial): string {
  return TIPOS_MATERIAL.find((t) => t.valor === tipo)?.etiqueta ?? tipo;
}

export function etiquetaRolEnGrupo(rol: RolEnGrupo): string {
  return rol === "docente" ? "Docente" : "Estudiante";
}

export const gruposMock: Grupo[] = [
  {
    id: "g-mate-3a",
    nombre: "Matemática 3° A",
    materia: "Matemática",
    docenteId: "u2",
    curso: "3° A",
    miembroIds: ["u1", "u5", "u11", "u15", "u16"],
    descripcion: "Funciones, sistemas de ecuaciones y geometría para 3° A.",
  },
  {
    id: "g-fisica-3b",
    nombre: "Física 3° B",
    materia: "Física",
    docenteId: "u12",
    curso: "3° B",
    miembroIds: ["u6"],
    descripcion: "Cinemática, movimiento rectilíneo y sus gráficas.",
  },
  {
    id: "g-literatura-4b",
    nombre: "Taller de Literatura 4° B",
    materia: "Literatura",
    docenteId: "u13",
    curso: "4° B",
    miembroIds: ["u7", "u8"],
    descripcion: "Lectura y análisis de cuentos: Quiroga, Benedetti y otros.",
  },
  {
    id: "g-historia-5c",
    nombre: "Historia 5° C",
    materia: "Historia",
    docenteId: "u14",
    curso: "5° C",
    miembroIds: ["u9", "u10"],
    descripcion: "Historia contemporánea: las guerras mundiales y el mundo bipolar.",
  },
];

export const publicacionesMock: Publicacion[] = [
  {
    id: "p-mate-3a-1",
    grupoId: "g-mate-3a",
    autorId: "u2",
    contenido:
      "¡Bienvenidos al grupo de Matemática 3° A! Acá van a estar las novedades, materiales y tareas del curso.",
    fecha: "2026-08-03T09:00:00-03:00",
  },
  {
    id: "p-mate-3a-2",
    grupoId: "g-mate-3a",
    autorId: "u2",
    contenido:
      "Recuerden que mañana vence la tarea de sistemas de ecuaciones. Desde Tareas pueden ver quién ya entregó.",
    fecha: "2026-09-09T08:15:00-03:00",
  },
  {
    id: "p-fisica-3b-1",
    grupoId: "g-fisica-3b",
    autorId: "u12",
    contenido:
      "El práctico de cinemática se entrega el viernes. Recuerden incluir unidades en todos los cálculos.",
    fecha: "2026-09-05T12:00:00-03:00",
  },
  {
    id: "p-literatura-4b-1",
    grupoId: "g-literatura-4b",
    autorId: "u13",
    contenido:
      "Mañana analizamos 'El almohadón de plumas'. Traigan el texto leído.",
    fecha: "2026-08-28T16:00:00-03:00",
  },
];

export const comentariosMock: Comentario[] = [
  {
    id: "c-mate-3a-2-1",
    publicacionId: "p-mate-3a-2",
    autorId: "u1",
    contenido:
      "Profe, ¿la tarea de sistemas se entrega en papel o por acá?",
    fecha: "2026-09-09T18:30:00-03:00",
  },
  {
    id: "c-mate-3a-2-2",
    publicacionId: "p-mate-3a-2",
    autorId: "u2",
    contenido:
      "Se entrega por acá: abrí la tarea, leé la consigna y marcá como entregada al terminar.",
    fecha: "2026-09-09T19:00:00-03:00",
  },
];

export const materialesMock: Material[] = [
  {
    id: "m-mate-guia-funciones",
    grupoId: "g-mate-3a",
    titulo: "Guía: funciones lineales y sistemas",
    tipo: "guia",
    url: "/materiales/mate-funciones-lineales.pdf",
    publicadoPorId: "u2",
    fecha: "2026-09-02T08:20:00-03:00",
    tamanoKb: 420,
  },
  {
    id: "m-mate-apunte-parcial",
    grupoId: "g-mate-3a",
    titulo: "Apunte de repaso para el parcial",
    tipo: "apunte",
    url: "/materiales/mate-repaso-parcial.pdf",
    publicadoPorId: "u2",
    fecha: "2026-09-08T11:00:00-03:00",
    tamanoKb: 580,
  },
  {
    id: "m-fisica-apunte-cinematica",
    grupoId: "g-fisica-3b",
    titulo: "Apunte de cinemática",
    tipo: "apunte",
    url: "/materiales/fisica-cinematica.pdf",
    publicadoPorId: "u12",
    fecha: "2026-08-25T11:00:00-03:00",
    tamanoKb: 890,
  },
  {
    id: "m-lit-quiroga",
    grupoId: "g-literatura-4b",
    titulo: "El almohadón de plumas (Quiroga)",
    tipo: "apunte",
    url: "/materiales/almohadon-quiroga.pdf",
    publicadoPorId: "u13",
    fecha: "2026-08-26T15:45:00-03:00",
    tamanoKb: 180,
  },
];

/** Entrega inicial pendiente para cada miembro del grupo. */
function entregasIniciales(miembroIds: string[]): Entrega[] {
  return miembroIds.map((estudianteId) => ({ estudianteId, estado: "pendiente" }));
}

/**
 * Tareas por grupo. Cada tarea tiene entregas por estudiante para que el
 * docente haga seguimiento. "Hoy" se simula 2026-09-10.
 */
export const tareasMock: Tarea[] = [
  // Matemática 3° A (grupo del docente y estudiante simulados)
  {
    id: "t-mate-sistemas",
    grupoId: "g-mate-3a",
    titulo: "Actividad: sistemas de ecuaciones",
    consigna:
      "Resolvé los 5 sistemas del ejercicio de la página 34 de la guía.\n\nPasos:\n1. Aplicá el método de igualación en los sistemas 1, 2 y 3.\n2. Aplicá el método de sustitución en los sistemas 4 y 5.\n3. Verificá cada solución reemplazando en ambas ecuaciones.\n4. Mostrá el desarrollo completo, no solo la respuesta.\n\nFormato: archivo PDF o foto clara del cuaderno.",
    docenteId: "u2",
    fechaCreacion: "2026-09-04T09:00:00-03:00",
    fechaEntrega: "2026-09-11T23:59:00-03:00",
    entregas: [
      { estudianteId: "u1", estado: "pendiente" },
      { estudianteId: "u5", estado: "entregada", entregadaEn: "2026-09-10T09:15:00-03:00" },
      { estudianteId: "u11", estado: "entregada", entregadaEn: "2026-09-10T10:00:00-03:00" },
      { estudianteId: "u15", estado: "entregada", entregadaEn: "2026-09-10T11:40:00-03:00" },
      { estudianteId: "u16", estado: "pendiente" },
    ],
  },
  {
    id: "t-mate-presencial",
    grupoId: "g-mate-3a",
    titulo: "Prueba presencial: funciones lineales",
    consigna:
      "Evaluación escrita en el salón de clase.\n\nContenidos:\n- Gráfica de funciones lineales.\n- Pendiente y ordenada al origen.\n- Ceros de la función.\n\nEstudiar con la guía de Materiales y el apunte de repaso.",
    docenteId: "u2",
    fechaCreacion: "2026-09-02T10:00:00-03:00",
    fechaEntrega: "2026-09-12T10:30:00-03:00",
    entregas: entregasIniciales(["u1", "u5", "u11", "u15", "u16"]),
  },
  {
    id: "t-mate-geometria",
    grupoId: "g-mate-3a",
    titulo: "Tarea: geometría del triángulo",
    consigna:
      "Completá los ejercicios de la guía de geometría (páginas 12 a 18).\n\nPara cada ejercicio: escribí el dato, la incógnita y el procedimiento usado. Solo se corrigen las tareas entregadas a tiempo.",
    docenteId: "u2",
    fechaCreacion: "2026-08-25T08:00:00-03:00",
    fechaEntrega: "2026-08-31T23:59:00-03:00",
    entregas: [
      { estudianteId: "u1", estado: "entregada", entregadaEn: "2026-08-30T20:15:00-03:00" },
      { estudianteId: "u5", estado: "calificada", nota: 9, entregadaEn: "2026-08-30T18:00:00-03:00" },
      { estudianteId: "u11", estado: "entregada", entregadaEn: "2026-08-31T21:00:00-03:00" },
      { estudianteId: "u15", estado: "entregada", entregadaEn: "2026-08-31T23:10:00-03:00" },
      { estudianteId: "u16", estado: "calificada", nota: 7, entregadaEn: "2026-08-31T22:05:00-03:00" },
    ],
  },
  {
    id: "t-mate-conjuntos",
    grupoId: "g-mate-3a",
    titulo: "Autoevaluación: conjuntos numéricos",
    consigna:
      "Resolvé el cuestionario online que está en el enlace de Materiales y revisá las claves al final.\n\nEsta tarea ya fue corregida: la nota figura en tu historial.",
    docenteId: "u2",
    fechaCreacion: "2026-08-14T09:00:00-03:00",
    fechaEntrega: "2026-08-21T23:59:00-03:00",
    entregas: [
      { estudianteId: "u1", estado: "calificada", nota: 9, entregadaEn: "2026-08-20T18:00:00-03:00" },
      { estudianteId: "u5", estado: "calificada", nota: 8, entregadaEn: "2026-08-21T19:30:00-03:00" },
      { estudianteId: "u11", estado: "calificada", nota: 5, entregadaEn: "2026-08-21T17:00:00-03:00" },
      { estudianteId: "u15", estado: "calificada", nota: 10, entregadaEn: "2026-08-21T12:00:00-03:00" },
      { estudianteId: "u16", estado: "calificada", nota: 6, entregadaEn: "2026-08-21T22:45:00-03:00" },
    ],
  },
  // Física 3° B
  {
    id: "t-fisica-cinematica",
    grupoId: "g-fisica-3b",
    titulo: "Práctico: gráficas de cinemática",
    consigna:
      "Resolver el práctico 2 de cinemática.\n\nRecordá: cada gráfica debe tener ejes rotulados y unidades.",
    docenteId: "u12",
    fechaCreacion: "2026-08-29T11:00:00-03:00",
    fechaEntrega: "2026-09-12T23:59:00-03:00",
    entregas: entregasIniciales(["u6"]),
  },
  // Literatura 4° B
  {
    id: "t-lit-cuento",
    grupoId: "g-literatura-4b",
    titulo: "Informe de lectura: Quiroga",
    consigna:
      "Escribí un informe de 2 carillas sobre 'El almohadón de plumas'.\n\nIncluí: tema, narrador, recursos literarios y conclusión personal.",
    docenteId: "u13",
    fechaCreacion: "2026-08-27T15:00:00-03:00",
    fechaEntrega: "2026-09-04T23:59:00-03:00",
    entregas: [
      { estudianteId: "u7", estado: "calificada", nota: 8, entregadaEn: "2026-09-03T21:00:00-03:00" },
      { estudianteId: "u8", estado: "calificada", nota: 6, entregadaEn: "2026-09-04T23:40:00-03:00" },
    ],
  },
];

export const USUARIO_POR_ROL: Record<Rol, string> = {
  estudiante: "u1",
  docente: "u2",
  administracion: "u3",
  publico: "u4",
};

export function usuarioSimuladoDeRol(rol: Rol): string {
  return USUARIO_POR_ROL[rol];
}

/* ------------------------- Consultas ------------------------- */

export function obtenerGrupo(grupoId: string): Grupo | undefined {
  return gruposMock.find((grupo) => grupo.id === grupoId);
}

export function obtenerGruposDeUsuario(usuarioId: string): Grupo[] {
  return gruposMock.filter(
    (grupo) =>
      grupo.miembroIds.includes(usuarioId) || grupo.docenteId === usuarioId,
  );
}

/** "Mis grupos" (GR-02): según el rol se ven los propios o todos. */
export function obtenerGruposParaRol(rol: Rol): Grupo[] {
  if (rol === "publico") return [];
  if (rol === "administracion") return [...gruposMock];
  return obtenerGruposDeUsuario(usuarioSimuladoDeRol(rol));
}

export function esMiembroDe(grupoId: string, usuarioId: string): boolean {
  const grupo = obtenerGrupo(grupoId);
  if (!grupo) return false;
  return grupo.miembroIds.includes(usuarioId) || grupo.docenteId === usuarioId;
}

/**
 * Rol de un usuario dentro del grupo: "docente" si es quien dicta el curso,
 * "estudiante" si forma parte de los miembros. Para el listado de integrantes.
 */
export function rolEnGrupoDe(grupo: Grupo, usuarioId: string): RolEnGrupo | undefined {
  if (grupo.docenteId === usuarioId) return "docente";
  if (grupo.miembroIds.includes(usuarioId)) return "estudiante";
  return undefined;
}

/** Listado de integrantes con su rol dentro del grupo (docente/estudiante). */
export function obtenerMiembrosDeGrupo(grupo: Grupo): {
  usuario: Usuario;
  rol: RolEnGrupo;
}[] {
  const resultado: { usuario: Usuario; rol: RolEnGrupo }[] = [];
  const docente = usuarioPorId(grupo.docenteId);
  if (docente) resultado.push({ usuario: docente, rol: "docente" });
  for (const id of grupo.miembroIds) {
    const miembro = usuarioPorId(id);
    if (miembro && miembro.id !== grupo.docenteId) {
      resultado.push({ usuario: miembro, rol: "estudiante" });
    }
  }
  return resultado.sort((a, b) => a.usuario.nombre.localeCompare(b.usuario.nombre, "es"));
}

export function obtenerPublicacionesDeGrupo(grupoId: string): Publicacion[] {
  return publicacionesMock
    .filter((publicacion) => publicacion.grupoId === grupoId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function obtenerPublicacion(publicacionId: string): Publicacion | undefined {
  return publicacionesMock.find((publicacion) => publicacion.id === publicacionId);
}

export function obtenerComentariosDePublicacion(
  publicacionId: string,
): Comentario[] {
  return comentariosMock
    .filter((comentario) => comentario.publicacionId === publicacionId)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

export function obtenerMaterialesDeGrupo(grupoId: string): Material[] {
  return materialesMock
    .filter((material) => material.grupoId === grupoId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

export function obtenerMaterialesPorTipo(
  grupoId: string,
  tipo?: TipoMaterial,
): Material[] {
  const materiales = obtenerMaterialesDeGrupo(grupoId);
  if (!tipo) return materiales;
  return materiales.filter((material) => material.tipo === tipo);
}

/**
 * Tareas de un grupo ordenadas por proximidad de vencimiento:
 * pendientes por fecha de entrega más cercana, luego entregadas y calificadas.
 */
export function obtenerTareasDeGrupo(grupoId: string): Tarea[] {
  return tareasMock
    .filter((tarea) => tarea.grupoId === grupoId)
    .sort((a, b) => {
      const ordenEstado: Record<EstadoTarea, number> = {
        pendiente: 0,
        entregada: 1,
        calificada: 2,
      };
      const estadoA = estadoDeTarea(a);
      const estadoB = estadoDeTarea(b);
      if (ordenEstado[estadoA] !== ordenEstado[estadoB]) {
        return ordenEstado[estadoA] - ordenEstado[estadoB];
      }
      return (
        new Date(a.fechaEntrega).getTime() - new Date(b.fechaEntrega).getTime()
      );
    });
}

export function obtenerTarea(tareaId: string): Tarea | undefined {
  return tareasMock.find((tarea) => tarea.id === tareaId);
}

/** Estado de una tarea para un estudiante concreto (por defecto el simulado). */
export function estadoDeTarea(tarea: Tarea, estudianteId?: string): EstadoTarea {
  const entrega = tarea.entregas.find(
    (e) => e.estudianteId === (estudianteId ?? USUARIO_POR_ROL.estudiante),
  );
  return entrega?.estado ?? "pendiente";
}

export function notaDeTarea(tarea: Tarea, estudianteId?: string): number | undefined {
  const entrega = tarea.entregas.find(
    (e) => e.estudianteId === (estudianteId ?? USUARIO_POR_ROL.estudiante),
  );
  return entrega?.nota;
}

export function entregaDeTarea(
  tarea: Tarea,
  estudianteId: string,
): Entrega | undefined {
  return tarea.entregas.find((e) => e.estudianteId === estudianteId);
}

/** Entregas de una tarea con la info del estudiante, para el seguimiento docente. */
export function obtenerSeguimientoTarea(tarea: Tarea): {
  entrega: Entrega;
  estudiante: Usuario;
  estado: EstadoTarea;
}[] {
  const orden: Record<EstadoTarea, number> = { pendiente: 0, entregada: 1, calificada: 2 };
  return tarea.entregas
    .map((entrega) => ({
      entrega,
      estudiante: usuarioPorId(entrega.estudianteId),
      estado: entrega.estado,
    }))
    .filter((item): item is { entrega: Entrega; estudiante: Usuario; estado: EstadoTarea } =>
      item.estudiante !== undefined,
    )
    .sort((a, b) => {
      if (orden[a.estado] !== orden[b.estado]) return orden[a.estado] - orden[b.estado];
      return a.estudiante.nombre.localeCompare(b.estudiante.nombre, "es");
    });
}

/** Cantidad de estudiantes que ya entregaron una tarea (entregada + calificada). */
export function contarEntregadas(tarea: Tarea): number {
  return tarea.entregas.filter(
    (e) => e.estado === "entregada" || e.estado === "calificada",
  ).length;
}

export function nombreDeUsuario(usuarioId: string): string {
  return usuarios.find((usuario) => usuario.id === usuarioId)?.nombre ?? usuarioId;
}

export function usuarioPorId(usuarioId: string): Usuario | undefined {
  return usuarios.find((usuario) => usuario.id === usuarioId);
}

export function obtenerMiembros(grupoId: string): Usuario[] {
  const grupo = obtenerGrupo(grupoId);
  if (!grupo) return [];
  return grupo.miembroIds
    .map((id) => usuarioPorId(id))
    .filter((usuario): usuario is Usuario => usuario !== undefined);
}

/* ------------------------- Mutaciones (Server Actions) ------------------------- */

function generarId(prefijo: string): string {
  const sufijo = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return `${prefijo}-${sufijo}`;
}

/**
 * Docente o administración da de alta un espacio de trabajo indicando nombre,
 * materia, curso y miembros (GR-06). El grupo queda asociado a quienes lo
 * crean como docente, y sus miembros lo ven en "Mis grupos" (GR-02).
 */
export function crearGrupo(datos: {
  nombre: string;
  materia: string;
  curso: string;
  descripcion?: string;
  docenteId: string;
  miembroIds: string[];
}): Grupo {
  const grupo: Grupo = {
    id: generarId("g"),
    nombre: datos.nombre,
    materia: datos.materia,
    curso: datos.curso,
    docenteId: datos.docenteId,
    miembroIds: datos.miembroIds,
    descripcion: datos.descripcion,
  };
  gruposMock.push(grupo);
  return grupo;
}

export function agregarPublicacion(datos: {
  grupoId: string;
  autorId: string;
  contenido: string;
}): Publicacion {
  const publicacion: Publicacion = {
    id: generarId("p"),
    grupoId: datos.grupoId,
    autorId: datos.autorId,
    contenido: datos.contenido,
    fecha: new Date().toISOString(),
  };
  publicacionesMock.push(publicacion);
  return publicacion;
}

export function agregarComentario(datos: {
  publicacionId: string;
  autorId: string;
  contenido: string;
}): Comentario | undefined {
  if (!publicacionesMock.some((p) => p.id === datos.publicacionId)) return undefined;
  const comentario: Comentario = {
    id: generarId("c"),
    publicacionId: datos.publicacionId,
    autorId: datos.autorId,
    contenido: datos.contenido,
    fecha: new Date().toISOString(),
  };
  comentariosMock.push(comentario);
  return comentario;
}

/**
 * El docente crea una tarea: se generan entregas "pendiente" para todos los
 * miembros actuales del grupo.
 */
export function crearTarea(datos: {
  grupoId: string;
  titulo: string;
  consigna: string;
  fechaEntrega: string;
  docenteId: string;
}): Tarea | undefined {
  const grupo = obtenerGrupo(datos.grupoId);
  if (!grupo) return undefined;
  const tarea: Tarea = {
    id: generarId("t"),
    grupoId: datos.grupoId,
    titulo: datos.titulo,
    consigna: datos.consigna,
    docenteId: datos.docenteId,
    fechaCreacion: new Date().toISOString(),
    fechaEntrega: new Date(datos.fechaEntrega).toISOString(),
    entregas: entregasIniciales(grupo.miembroIds),
  };
  tareasMock.push(tarea);
  return tarea;
}

/** Estudiante confirma la entrega de su tarea. */
export function entregarTarea(
  tareaId: string,
  estudianteId: string,
): Entrega | undefined {
  const tarea = tareasMock.find((t) => t.id === tareaId);
  if (!tarea) return undefined;
  const entrega = tarea.entregas.find((e) => e.estudianteId === estudianteId);
  if (!entrega || entrega.estado === "calificada") return undefined;
  entrega.estado = "entregada";
  entrega.entregadaEn = new Date().toISOString();
  return entrega;
}