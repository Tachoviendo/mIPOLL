"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  agregarComentario,
  agregarPublicacion,
  crearGrupo,
  crearTarea,
  entregarTarea,
  esMiembroDe,
  obtenerGrupo,
  obtenerPublicacion,
  obtenerTarea,
  usuarioSimuladoDeRol,
} from "@/data/grupos";
import { obtenerEstudiantes } from "@/data/usuarios";
import { obtenerRolActual } from "@/lib/rol-actual";
import {
  puedeComentarEnGrupos,
  puedeCrearGrupos,
  puedeCrearTareas,
  puedeEntregarTareas,
  puedeVerGrupos,
} from "@/lib/roles";

export const LIMITE_NOMBRE_GRUPO = 60;
export const LIMITE_DESCRIPCION_GRUPO = 300;
export const LIMITE_CONTENIDO = 4000;
export const LIMITE_TITULO_TAREA = 100;
export const LIMITE_CONSIGNA_TAREA = 4000;

/**
 * Docente o administración da de alta un espacio de trabajo con nombre,
 * materia, curso y miembros.
 */
export async function crearGrupoAction(formData: FormData) {
  const rolActual = await obtenerRolActual();
  if (!puedeCrearGrupos(rolActual)) {
    throw new Error("No tenés permiso para crear grupos.");
  }

  const nombre = formData.get("nombre")?.toString().trim() ?? "";
  const materia = formData.get("materia")?.toString().trim() ?? "";
  const curso = formData.get("curso")?.toString().trim() ?? "";
  const descripcion = formData.get("descripcion")?.toString().trim() ?? "";
  const miembroIds = formData
    .getAll("miembros")
    .map((valor) => valor.toString());

  const estudiantesValidos = new Set(obtenerEstudiantes().map((est) => est.id));
  const miembros = miembroIds.filter((id) => estudiantesValidos.has(id));

  if (
    !nombre ||
    !materia ||
    !curso ||
    nombre.length > LIMITE_NOMBRE_GRUPO ||
    descripcion.length > LIMITE_DESCRIPCION_GRUPO
  ) {
    redirect("/grupos?error=datos-invalidos");
  }

  crearGrupo({
    nombre: nombre.slice(0, LIMITE_NOMBRE_GRUPO),
    materia: materia.slice(0, 60),
    curso: curso.slice(0, 30),
    descripcion: descripcion.slice(0, LIMITE_DESCRIPCION_GRUPO),
    docenteId: usuarioSimuladoDeRol(rolActual),
    miembroIds: miembros,
  });

  revalidatePath("/grupos");
  redirect("/grupos?creado=ok");
}

export async function publicarEnGrupoAction(formData: FormData) {
  const rolActual = await obtenerRolActual();
  if (!puedeCrearGrupos(rolActual)) {
    throw new Error("No tenés permiso para publicar.");
  }

  const grupoId = formData.get("grupoId")?.toString() ?? "";
  const contenido = formData.get("contenido")?.toString().trim() ?? "";
  const grupo = obtenerGrupo(grupoId);
  if (!grupo || !contenido || contenido.length > LIMITE_CONTENIDO) {
    redirect(`/grupos/${grupoId}?error=datos-invalidos`);
  }
  if (!esMiembroDe(grupoId, usuarioSimuladoDeRol(rolActual))) {
    redirect(`/grupos/${grupoId}?error=sin-permiso`);
  }

  agregarPublicacion({
    grupoId,
    autorId: usuarioSimuladoDeRol(rolActual),
    contenido: contenido.slice(0, LIMITE_CONTENIDO),
  });

  revalidatePath(`/grupos/${grupoId}`);
  redirect(`/grupos/${grupoId}`);
}

export async function comentarPublicacionAction(formData: FormData) {
  const rolActual = await obtenerRolActual();
  if (!puedeComentarEnGrupos(rolActual)) {
    throw new Error("No tenés permiso para comentar.");
  }

  const grupoId = formData.get("grupoId")?.toString() ?? "";
  const publicacionId = formData.get("publicacionId")?.toString() ?? "";
  const contenido = formData.get("contenido")?.toString().trim() ?? "";
  const publicacion = obtenerPublicacion(publicacionId);

  if (
    !publicacion ||
    publicacion.grupoId !== grupoId ||
    !contenido ||
    contenido.length > LIMITE_CONTENIDO
  ) {
    redirect(`/grupos/${grupoId}?error=datos-invalidos`);
  }
  if (!puedeVerGrupos(rolActual)) {
    redirect(`/grupos/${grupoId}?error=sin-permiso`);
  }

  agregarComentario({
    publicacionId,
    autorId: usuarioSimuladoDeRol(rolActual),
    contenido: contenido.slice(0, LIMITE_CONTENIDO),
  });

  revalidatePath(`/grupos/${grupoId}`);
  redirect(`/grupos/${grupoId}`);
}

/**
 * El docente crea una tarea nueva en el grupo. Todos los miembros quedan con
 * estado "pendiente".
 */
export async function crearTareaAction(formData: FormData) {
  const rolActual = await obtenerRolActual();
  if (!puedeCrearTareas(rolActual)) {
    throw new Error("Solo los docentes pueden crear tareas.");
  }

  const grupoId = formData.get("grupoId")?.toString() ?? "";
  const titulo = formData.get("titulo")?.toString().trim() ?? "";
  const consigna = formData.get("consigna")?.toString().trim() ?? "";
  const fechaEntrega = formData.get("fechaEntrega")?.toString() ?? "";
  const grupo = obtenerGrupo(grupoId);

  if (
    !grupo ||
    !titulo ||
    !consigna ||
    !fechaEntrega ||
    isNaN(new Date(fechaEntrega).getTime()) ||
    titulo.length > LIMITE_TITULO_TAREA ||
    consigna.length > LIMITE_CONSIGNA_TAREA
  ) {
    redirect(`/grupos/${grupoId}/tareas?error=datos-invalidos`);
  }
  if (grupo.docenteId !== usuarioSimuladoDeRol(rolActual)) {
    redirect(`/grupos/${grupoId}/tareas?error=sin-permiso`);
  }

  const tarea = crearTarea({
    grupoId,
    titulo: titulo.slice(0, LIMITE_TITULO_TAREA),
    consigna: consigna.slice(0, LIMITE_CONSIGNA_TAREA),
    fechaEntrega: new Date(fechaEntrega).toISOString(),
    docenteId: usuarioSimuladoDeRol(rolActual),
  });

  if (!tarea) {
    redirect(`/grupos/${grupoId}/tareas?error=datos-invalidos`);
  }

  revalidatePath(`/grupos/${grupoId}/tareas`);
  redirect(`/grupos/${grupoId}/tareas`);
}

/**
 * Estudiante confirma la entrega de una tarea. El estado cambia de inmediato
 * porque la mutación es en memoria y la página se revalida.
 */
export async function entregarTareaAction(formData: FormData) {
  const rolActual = await obtenerRolActual();
  if (!puedeEntregarTareas(rolActual)) {
    throw new Error("Solo los estudiantes pueden entregar tareas.");
  }

  const grupoId = formData.get("grupoId")?.toString() ?? "";
  const tareaId = formData.get("tareaId")?.toString() ?? "";
  const grupo = obtenerGrupo(grupoId);
  const tarea = obtenerTarea(tareaId);
  const ruta = `/grupos/${grupoId}/tareas/${tareaId}`;

  if (!grupo || !tarea || tarea.grupoId !== grupoId) {
    redirect(`/grupos/${grupoId}/tareas?error=datos-invalidos`);
  }
  const usuarioId = usuarioSimuladoDeRol(rolActual);
  if (!esMiembroDe(grupoId, usuarioId)) {
    redirect(`${ruta}?error=sin-permiso`);
  }

  entregarTarea(tareaId, usuarioId);

  revalidatePath(`/grupos/${grupoId}/tareas`);
  revalidatePath(ruta);
  redirect(ruta);
}