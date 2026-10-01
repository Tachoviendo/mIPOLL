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

export function puntoPorId(id: string): PuntoInteres | undefined {
  return puntosDeInteresMock.find((p) => p.id === id);
}

export function puntosPorTipo(tipo: TipoPuntoInteres): PuntoInteres[] {
  return puntosDeInteresMock.filter((p) => p.tipo === tipo);
}

export function puntosPorPiso(piso: Piso): PuntoInteres[] {
  return puntosDeInteresMock.filter((p) => p.piso === piso);
}