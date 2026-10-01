/**
 * `src/data/puntos-interes.ts`: puntos de interés (POI) del mapa interactivo.
 *
 * Las coordenadas están en px del viewBox del plano del piso correspondiente
 * (ver `src/data/planos.ts`). El campo `tipo` permite filtrarlos y darles
 * estilos consistentes en el mapa.
 */

export const TIPOS_PUNTO_INTERES = [
  "aula",
  "biblioteca",
  "laboratorio",
  "direccion",
  "sala",
  "comedor",
  "banos",
  "entrada",
  "escalera",
  "patio",
] as const;

export type TipoPuntoInteres = (typeof TIPOS_PUNTO_INTERES)[number];

export const PISOS = ["planta-baja", "primer-piso", "segundo-piso"] as const;

export type Piso = (typeof PISOS)[number];

export type PuntoInteres = {
  id: string;
  nombre: string;
  tipo: TipoPuntoInteres;
  /** Coordenadas en px dentro del viewBox del plano del piso. */
  coordenadas: { x: number; y: number };
  piso: Piso;
  descripcion: string;
  horario?: string;
};

const punto = (
  id: string,
  nombre: string,
  tipo: TipoPuntoInteres,
  x: number,
  y: number,
  piso: Piso,
  descripcion: string,
  horario?: string,
): PuntoInteres => ({
  id,
  nombre,
  tipo,
  coordenadas: { x, y },
  piso,
  descripcion,
  horario,
});

/**
 * Puntos de interés de la planta baja, posicionados sobre el centro de sus
 * zonas en `planta-baja.svg`. Al menos uno de cada tipo.
 */
export const puntosDeInteresMock: PuntoInteres[] = [
  punto("poi-aula-1", "Aula 1", "aula", 192, 166, "planta-baja", "Aula de primer año de ciclo básico."),
  punto("poi-aula-4", "Aula 4", "aula", 628, 178, "planta-baja", "Aula de segundo año de ciclo básico."),
  punto("poi-laboratorio", "Laboratorio de Física y Química", "laboratorio", 628, 303, "planta-baja", "Laboratorio equipado para prácticas.", "Lunes a viernes de 07:30 a 18:00 (con reserva docente)"),
  punto("poi-biblioteca", "Biblioteca", "biblioteca", 628, 428, "planta-baja", "Préstamo de libros y sala de lectura.", "Lunes a viernes de 07:30 a 21:00"),
  punto("poi-direccion", "Dirección", "direccion", 628, 553, "planta-baja", "Secretaría y adscripción.", "Lunes a viernes de 07:30 a 21:00"),
  punto("poi-comedor", "Comedor escolar", "comedor", 192, 466, "planta-baja", "Servicio de comedor al mediodía.", "Lunes a viernes de 10:30 a 14:00"),
  punto("poi-banos", "Baños", "banos", 192, 566, "planta-baja", "Baños de estudiantes y docentes."),
  punto("poi-entrada", "Entrada principal", "entrada", 410, 608, "planta-baja", "Acceso principal al liceo desde la calle."),
  punto("poi-escalera", "Escaleras", "escalera", 410, 164, "planta-baja", "Acceso a primer y segundo piso."),
  punto("poi-patio", "Patio central", "patio", 410, 658, "planta-baja", "Patio exterior de recreo y encuentro."),
];

/**
 * Puntos de interés del primer piso, posicionados sobre el centro de sus
 * zonas en `primer-piso.svg`.
 */
export const puntosPrimerPiso: PuntoInteres[] = [
  punto("poi-aula-5", "Aula 5", "aula", 192, 166, "primer-piso", "Aula de primer año de ciclo básico."),
  punto("poi-aula-6", "Aula 6", "aula", 192, 266, "primer-piso", "Aula de segundo año de ciclo básico."),
  punto("poi-sala-informatica", "Sala de Informática", "laboratorio", 192, 366, "primer-piso", "Sala con computadoras para clases y talleres.", "Lunes a viernes de 07:30 a 18:00 (con reserva docente)"),
  punto("poi-sala-profesores", "Sala de Profesores", "sala", 192, 466, "primer-piso", "Sala de reuniones y descanso del cuerpo docente.", "Lunes a viernes de 07:30 a 21:00"),
  punto("poi-banos-p1", "Baños", "banos", 192, 566, "primer-piso", "Baños de estudiantes y docentes."),
  punto("poi-aula-7", "Aula 7", "aula", 628, 178, "primer-piso", "Aula de primer año de ciclo básico."),
  punto("poi-aula-8", "Aula 8", "aula", 628, 303, "primer-piso", "Aula de segundo año de ciclo básico."),
  punto("poi-sala-estudio", "Sala de Estudio", "biblioteca", 628, 428, "primer-piso", "Espacio silencioso para estudiar y leer.", "Lunes a viernes de 07:30 a 21:00"),
  punto("poi-laboratorio-idiomas", "Laboratorio de Idiomas", "laboratorio", 628, 553, "primer-piso", "Sala equipada para la práctica de idiomas.", "Lunes a viernes de 07:30 a 18:00 (con reserva docente)"),
];

/**
 * Puntos de interés del segundo piso, posicionados sobre el centro de sus
 * zonas en `segundo-piso.svg`.
 */
export const puntosSegundoPiso: PuntoInteres[] = [
  punto("poi-aula-9", "Aula 9", "aula", 192, 166, "segundo-piso", "Aula de tercer año de ciclo básico."),
  punto("poi-aula-10", "Aula 10", "aula", 192, 266, "segundo-piso", "Aula de tercer año de ciclo básico."),
  punto("poi-laboratorio-ciencias", "Laboratorio de Ciencias", "laboratorio", 192, 366, "segundo-piso", "Laboratorio de biología y ciencias naturales.", "Lunes a viernes de 07:30 a 18:00 (con reserva docente)"),
  punto("poi-aula-musica", "Aula de Música", "sala", 192, 466, "segundo-piso", "Aula para talleres y ensayos musicales.", "Lunes a viernes de 08:00 a 21:00"),
  punto("poi-banos-p2", "Baños", "banos", 192, 566, "segundo-piso", "Baños de estudiantes y docentes."),
  punto("poi-aula-11", "Aula 11", "aula", 628, 178, "segundo-piso", "Aula de tercer año de ciclo básico."),
  punto("poi-aula-12", "Aula 12", "aula", 628, 303, "segundo-piso", "Aula de tercer año de ciclo básico."),
  punto("poi-hemeroteca", "Hemeroteca", "biblioteca", 628, 428, "segundo-piso", "Material de consulta: periódicos y revistas.", "Lunes a viernes de 07:30 a 18:00"),
  punto("poi-sala-investigacion", "Sala de Investigación", "sala", 628, 553, "segundo-piso", "Espacio para trabajos escritos y proyectos."),
];

export const todosLosPuntos: PuntoInteres[] = [
  ...puntosDeInteresMock,
  ...puntosPrimerPiso,
  ...puntosSegundoPiso,
];

export function puntoPorId(id: string): PuntoInteres | undefined {
  return todosLosPuntos.find((p) => p.id === id);
}

export function puntosPorTipo(tipo: TipoPuntoInteres): PuntoInteres[] {
  return todosLosPuntos.filter((p) => p.tipo === tipo);
}

export function puntosPorPiso(piso: Piso): PuntoInteres[] {
  if (piso === "primer-piso") return puntosPrimerPiso;
  if (piso === "segundo-piso") return puntosSegundoPiso;
  return puntosDeInteresMock;
}