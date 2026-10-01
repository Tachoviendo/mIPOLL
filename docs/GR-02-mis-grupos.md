# GR-02 — Mis grupos: alcance de visibilidad para Administración

## Decisión

**Administración ve TODOS los grupos del liceo.**

El rol Administración tiene visión institucional: en "Mis grupos" (GR-02) ve el listado completo
de grupos del liceo y puede ingresar al detalle de cualquiera en modo supervisión/lectura. No
queda limitada a los grupos donde figura como miembro.

| Rol | Grupos visibles en "Mis grupos" |
|---|---|
| Estudiante | Solo los grupos donde participa como miembro |
| Docente | Solo los grupos donde participa como miembro o está a cargo (`docenteId`) |
| **Administración** | **Todos los grupos del liceo** |
| Público | Solo los grupos donde participa como miembro |

## Justificación

- En el mock actual (`usuarios.ts`), Administración no es miembro de ningún grupo: con el filtro
  por membresía su pantalla "Mis grupos" quedaría **vacía** y el rol no podría cumplir su función.
- Es coherente con F-06 / FO-10: Administración ya tiene nivel elevado en foros (modera). La
  supervisión de grupos (materias, tareas, materiales, convivencia) es función natural de
  Dirección/Administración del liceo.
- Permite a Administración acceder a contenido de cualquier curso sin depender de que un docente
  la agregue como miembro.

## Alcance de la decisión

- **Ver**: listado completo de grupos, detalle, muro de novedades, tareas y materiales de
  cualquier grupo (lectura/supervisión).
- **Gestionar/escribir**: publicar novedades, crear/gestionar tareas o materiales **queda fuera
  de esta decisión**. Las acciones de escritura se rigen por las reglas de F-06
  (`RequireRole` + reglas de membresía por rol) y aplican a los grupos donde el rol participa.

## Cambios en el control de acceso (F-06)

Se centraliza la regla en `src/lib/roles.ts` (patrón de `puedeModerarForos`):

```typescript
// GR-02 (Mis grupos): Administración tiene visión institucional y ve TODOS los
// grupos del liceo (listado completo + detalle en lectura/supervisión). El
// resto de roles ve solo los grupos donde participa como miembro.
export function puedeVerTodosLosGrupos(rol: Rol): boolean {
  return rol === "administracion";
}
```

### Integración en el módulo de grupos (ramas GR)

`obtenerGruposParaRol(rol)` en `src/data/grupos.ts` debe consumir la regla:

```typescript
export function obtenerGruposParaRol(rol: Rol): Grupo[] {
  return puedeVerTodosLosGrupos(rol)
    ? gruposMock
    : obtenerGruposDeUsuario(USUARIO_POR_ROL[rol]);
}
```

`src/app/grupos/page.tsx` no cambia: sigue llamando `obtenerGruposParaRol(rolActual)`. Para
Administración devuelve el listado completo; la etiqueta de cabecera puede indicar
"Grupos del liceo" en lugar de "Los grupos a los que pertenecés como Administración".

## Criterios de aceptación

- [ ] Con el rol Administración activo, "Mis grupos" lista **todos** los grupos del mock, aunque
      Administración no figure como miembro en ninguno.
- [ ] Administración puede abrir el detalle de cualquier grupo (muro, tareas, materiales) en
      lectura/supervisión.
- [ ] Estudiante, docente y público mantienen el filtro actual (solo sus grupos).
- [ ] La regla está centralizada en F-06 (`puedeVerTodosLosGrupos`) y `obtenerGruposParaRol` la
      consume.
- [ ] Decisión documentada en GR-02 (este documento).

## Referencias

- F-06 Control de acceso por rol (`19-f-06`): `RequireRole`, `src/lib/roles.ts`, `src/lib/auth.tsx`.
- Rama `47-gr-02-mis-grupos`: implementación de "Mis grupos" con `obtenerGruposParaRol`.
- Spike `56-gr-11-alcance-de-visibilidad-de-administración`: motivo del análisis.