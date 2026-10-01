export type Persona = {
  id: string;
  nombre: string;
  email: string;
  rol: "alumno" | "docente" | "admin";
};

export type Curso = {
  id: string;
  nombre: string;
  anio: number;
  turno: "mañana" | "tarde";
};

export type Departamento = {
  id: string;
  nombre: string;
};

export const personas: Persona[] = [
  { id: "p1", nombre: "Ana García", email: "ana.garcia@liceo.edu.uy", rol: "docente" },
  { id: "p2", nombre: "Carlos López", email: "carlos.lopez@liceo.edu.uy", rol: "alumno" },
  { id: "p3", nombre: "María Rodríguez", email: "maria.rodriguez@liceo.edu.uy", rol: "admin" },
  { id: "p4", nombre: "Pedro Martínez", email: "pedro.martinez@liceo.edu.uy", rol: "docente" },
  { id: "p5", nombre: "Laura Sánchez", email: "laura.sanchez@liceo.edu.uy", rol: "alumno" },
  { id: "p6", nombre: "Diego Fernández", email: "diego.fernandez@liceo.edu.uy", rol: "alumno" },
];

export const cursos: Curso[] = [
  { id: "c1", nombre: "1° A", anio: 1, turno: "mañana" },
  { id: "c2", nombre: "1° B", anio: 1, turno: "tarde" },
  { id: "c3", nombre: "2° A", anio: 2, turno: "mañana" },
  { id: "c4", nombre: "2° B", anio: 2, turno: "tarde" },
  { id: "c5", nombre: "3° A", anio: 3, turno: "mañana" },
  { id: "c6", nombre: "3° B", anio: 3, turno: "tarde" },
];

export const departamentos: Departamento[] = [
  { id: "d1", nombre: "Matemática" },
  { id: "d2", nombre: "Lengua" },
  { id: "d3", nombre: "Historia" },
  { id: "d4", nombre: "Ciencias" },
  { id: "d5", nombre: "Inglés" },
  { id: "d6", nombre: "Informática" },
];
