# Lista de fixes pendientes

Documento de seguimiento generado a partir de la auditoría técnica del panel administrativo de Semillas Escuela Taller.

## CRÍTICO

- [ ] Agregar manejo de errores y `state.error` en `src/stores/formularioStore.ts`.
  - Impacto: evita fallos silenciosos al cargar o guardar formularios.
  - Archivos afectados: `src/stores/formularioStore.ts`.

- [ ] Mover el cache guard de `fetchGuardians` al store en `src/stores/estudiantesStore.ts`.
  - Impacto: evita llamadas redundantes al endpoint de acudientes.
  - Archivos afectados: `src/stores/estudiantesStore.ts`.

## IMPORTANTE

- [ ] Hacer que el click sobre una fila en `src/views/admin/StudentsView.vue` también abra `EstudianteModal`.
  - Impacto: mejora la navegación y cumple el flujo esperado.
  - Archivos afectados: `src/views/admin/StudentsView.vue`.

- [ ] Ocultar el botón `Opciones...` en `src/components/formulario/CampoEditorItem.vue` cuando el campo no sea de tipo `select`.
  - Impacto: alinea la UI con el contrato esperado.
  - Archivos afectados: `src/components/formulario/CampoEditorItem.vue`.

- [ ] Deshabilitar el botón `Guardar` en `src/components/estudiantes/GuardianFormModal.vue` cuando haya campos requeridos vacíos.
  - Impacto: mejora la UX y evita intentos de guardado inválidos.
  - Archivos afectados: `src/components/estudiantes/GuardianFormModal.vue`.

- [ ] Revisar el comportamiento de `BaseCalendar` para ajustar la firma y el valor emitido según el contrato.
  - Impacto: reduce ambigüedad entre `Date` y `Date | null`.
  - Archivos afectados: `src/components/ui/BaseCalendar.vue`.

## ACCESIBILIDAD

- [ ] Añadir `role="tab"` y `aria-selected` a los tabs de `src/views/admin/FormularioView.vue`.
- [ ] Añadir `role="tab"` y `aria-selected` a los tabs de `src/components/estudiantes/EstudianteModal.vue`.
- [ ] Añadir `role="switch"` y `aria-label` a los toggles de estudiantes, acudientes y formulario.
- [ ] Añadir `aria-label` a los íconos de almuerzo y transporte en las tablas.
- [ ] Añadir `aria-disabled="true"` a los días deshabilitados en `src/components/ui/BaseCalendar.vue`.
- [ ] Revisar que no queden elementos interactivos sin nombre accesible.

## MENOR

- [ ] Mejorar la restauración de foco en modales apilados.
  - Impacto: mejor experiencia cuando se cierra `GuardianFormModal` desde `EstudianteModal`.
  - Archivos afectados: `src/components/ui/BaseModal.vue`, `src/components/estudiantes/EstudianteModal.vue`.

## Estado general

- Tipos e interfaces: correctos.
- Flujos principales: correctos.
- Persistencia y vistas base: funcionales.
- Quedan ajustes de error handling, cache y accesibilidad.
