Eres un experto desarrollador frontend especializado en Vue.js 3 (Composition API) y Tailwind CSS.

## CONTEXTO DEL PROYECTO
Debes implementar un panel administrativo para "Semillas Escuela Taller", un jardín infantil.
El diseño de referencia proviene de un mockup con estética infantil, pero el panel admin
debe tener un concepto SOBRIO Y CORPORATIVO, manteniendo solo la identidad de marca
(logo, nombre, paleta de colores).

## STACK TECNOLÓGICO
- Vue 3 con Composition API (<script setup>)
- Vue Router 4
- Pinia (store de estado global)
- Tailwind CSS (utility-first, sin componentes externos a menos que se indique)
- Axios para llamadas HTTP
- TypeScript

## PALETA DE COLORES (usar como variables CSS o clases Tailwind custom)
- Títulos / Acciones primarias:  #45b071  → clase: text-primary / bg-primary
- Subtítulos / Accents:          #ffa44f  → clase: text-accent  / bg-accent
- Texto general:                 #000000
- Fondo general (layout):        #eefeff  → clase: bg-base
- Fondo tarjetas / componentes:  #ffffff

En tailwind.config.js extiende los colores así:
  colors: {
    primary: '#45b071',
    accent:  '#ffa44f',
    base:    '#eefeff',
  }


## LAYOUT GENERAL  AdminLayout.vue
Sidebar fijo a la izquierda (w-64), fondo blanco, borde derecho gris claro.
  - Logo "Semillas" en la parte superior (texto si no hay imagen)
  - Items de navegación con ícono (usa heroicons via @heroicons/vue):
      Formulario  → DocumentTextIcon
      Aspirantes  → ClipboardDocumentListIcon
      Estudiantes → UserGroupIcon
      Grupos      → RectangleGroupIcon
      Exalumnos   → ArchiveBoxIcon
  - Item activo: fondo #45b071, texto blanco, borde izquierdo sólido 3px
  - Hover: bg-primary/10, text-primary
  - Botón "Cerrar sesión" al fondo del sidebar (rojo suave)
Header top bar (h-14): muestra el título de la sección activa en text-primary font-semibold,
  y un avatar/nombre de usuario a la derecha.
Contenido principal: bg-base, padding p-6, scroll vertical.

## COMPONENTES REUTILIZABLES (crear en src/components/ui/)

### BaseCard.vue
Wrapper con bg-white rounded-xl shadow-sm border border-gray-100 p-6.
Props: title (string), subtitle (string opcional).
Slot default para contenido.
Título con text-primary text-lg font-semibold.
Subtítulo con text-accent text-sm.

### BaseTable.vue
Tabla responsiva con:
- Cabecera: bg-primary text-white text-sm uppercase tracking-wide
- Filas alternas: bg-white / bg-gray-50
- Hover en fila: bg-primary/5
- Props: columns (Array<{key, label, sortable?}>), rows (Array<any>),
         loading (bool), emptyMessage (string)
- Slot "actions" por fila para botones de acción
- Paginación integrada (props: page, perPage, total; emite update:page)

### BaseButton.vue
Props: variant ('primary'|'accent'|'danger'|'ghost'), size ('sm'|'md'|'lg'),
       loading (bool), icon (componente opcional).
- primary: bg-primary text-white hover:bg-primary/90
- accent:  bg-accent  text-white hover:bg-accent/90
- danger:  bg-red-500 text-white hover:bg-red-600
- ghost:   border border-primary text-primary hover:bg-primary/10

### BaseInput.vue
Input con label flotante (float label pattern).
Props: modelValue, label, type, error (string), required.
Borde: border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary
Error: border-red-400 + mensaje debajo en text-red-500 text-xs.

### BaseModal.vue
Modal centrado con overlay oscuro, bg-white rounded-2xl shadow-xl.
Props: open (bool), title, size ('sm'|'md'|'lg').
Emite: close.
Header con título en text-primary, botón X para cerrar.
Footer slot para acciones.
Animación: transition fade + scale suave (Transition de Vue).

### BaseSearchBar.vue
Input de búsqueda con ícono MagnifyingGlassIcon a la izquierda.
Debounce de 300ms antes de emitir 'search'.
Botón X para limpiar.

### BaseCalendar.vue  (para selección de fecha de entrevista)
Calendario mensual minimalista en verde.
Props: modelValue (Date|null), disabledDates (Array<Date>).
Solo días laborables (lunes a viernes) son seleccionables.
Navegación mes anterior / siguiente.
Día seleccionado: bg-primary text-white rounded-full.
Hoy: borde primary.

### BaseBadge.vue
Badge de estado. Props: status ('pending'|'active'|'inactive'|'graduated').
Colores:
  pending   → bg-yellow-100 text-yellow-700
  active    → bg-green-100  text-primary
  inactive  → bg-gray-100   text-gray-600
  graduated → bg-blue-100   text-blue-700

## VISTAS DETALLADAS

### LoginView.vue
Pantalla centrada, fondo bg-base.
Tarjeta central bg-white rounded-2xl shadow-lg p-10 w-96.
Logo o nombre "Semillas" en text-primary text-3xl font-bold text-center mb-2.
Subtítulo "Panel Administrativo" en text-accent text-sm text-center mb-8.
Campos: correo electrónico y contraseña (usando BaseInput).
BaseButton variant="primary" fullWidth: "Iniciar sesión".
Al submit: llama a authStore.login({email, password}),
  guarda token en localStorage, redirige a /admin/estudiantes.
Muestra error inline si las credenciales fallan.

### StudentsView.vue
Header de sección:
  - Título "Estudiantes" (text-primary h1)
  - Botón "+ Añadir estudiante" (BaseButton variant="primary")

Barra de herramientas:
  - BaseSearchBar (filtra por nombre en tiempo real)
  - Select "Agrupar por": Grupo, Edad, Estado  (Tailwind select styled)
  - BaseButton variant="ghost" con FunnelIcon: abre panel de filtros avanzados

Tabla principal (BaseTable) con columnas:
  foto (avatar circular 40px), nombre completo, edad, grupo asignado,
  fecha de ingreso, estado (BaseBadge), acciones.
Columna acciones: ícono editar (PencilSquareIcon, accent) y eliminar (TrashIcon, rojo).

Al hacer clic en una fila → abre modal de detalle/edición.
Al clic "+ Añadir" → abre BaseModal con formulario de estudiante.

Modal de estudiante (crear/editar):
  Tamaño 'lg'. Dos columnas:
  Columna izquierda: avatar con botón de carga de foto (input type=file oculto).
  Columna derecha: grid de campos dinámicos (los mismos que el admin configuró
    en FormularioView). Renderiza cada campo definido en formularioStore.campos.
  Al fondo: campo de Observaciones (textarea).
  Footer: BaseButton ghost "Cancelar" + BaseButton primary "Guardar".

Al eliminar: muestra modal de confirmación antes de ejecutar.

### FormularioView.vue  (editor del formulario de inscripción, mockup página 7)
Permite al administrador definir qué campos aparecerán en el formulario público.
Layout de dos columnas de campos (igual al mockup) + columna de opciones especiales.

Cada campo tiene:
  - Label editable (click para editar inline)
  - Tipo de campo (text, select, date, number) → dropdown
  - Toggle "Requerido"
  - Botón eliminar (TrashIcon, rojo)
  - Handle de drag para reordenar (usa vue-draggable-next o @vueuse/gesture)

Botón "+ Añadir campo" debajo de la primera columna.
Los campos especiales (Foto, Calendario de entrevista) son fijos y no eliminables,
  pero sí pueden ocultarse con un toggle.
BaseButton primary "Guardar cambios" al pie del formulario.
Los campos se guardan en Pinia → formularioStore y se sincronizan con el backend.

### AspirantesView.vue  (mockup página 4 como referencia del formulario público)
Muestra la lista de inscripciones enviadas desde el formulario público.
Tabla con columnas: nombre, fecha envío, fecha entrevista, estado (BaseBadge: pending).
Acciones por fila:
  - Ver detalles (abre modal de solo lectura con todos los campos del formulario)
  - Aprobar → cambia estado a 'active', mueve al listado de Estudiantes
  - Rechazar → cambia estado a 'inactive', con campo de motivo opcional
  - Editar fecha de entrevista (abre BaseCalendar en modal pequeño)

### GruposView.vue
Tarjetas en grid (3 columnas en desktop, 2 en tablet, 1 en móvil).
Cada tarjeta (BaseCard): nombre del grupo, docente asignado, cantidad de estudiantes,
  rango de edades, badge de estado.
Botón editar en esquina superior derecha de cada tarjeta.
Botón "+ Nuevo Grupo" en el header.
Modal de grupo: nombre, descripción, docente (select), edades min/max, capacidad máxima.

### ExalumnosView.vue
Igual estructura que StudentsView pero en modo solo lectura (sin editar/eliminar).
Filtro adicional por año de egreso.
Botón "Exportar CSV" (genera descarga del listado filtrado).

## STORES PINIA (src/stores/)

### authStore.ts
State: token (string|null), user ({name, email, role}).
Actions: login(credentials), logout(), fetchCurrentUser().
Getter: isAuthenticated.

### estudiantesStore.ts
State: estudiantes (array), loading, error, pagination ({page, perPage, total}).
Actions: fetchEstudiantes(filters), createEstudiante(data), updateEstudiante(id, data),
         deleteEstudiante(id).
Getter: estudiantesFiltrados(query, groupBy).

### formularioStore.ts
State: campos (Array<{id, label, type, required, visible, order}>).
Actions: fetchCampos(), saveCampos(), addCampo(), removeCampo(id), updateCampo(id, data).

### aspirantesStore.ts
State: aspirantes (array), loading.
Actions: fetchAspirantes(), aprobarAspirante(id), rechazarAspirante(id, motivo),
         updateFechaEntrevista(id, date).

## SERVICIO HTTP (src/services/api.ts)
Instancia de axios con:
  baseURL: import.meta.env.VITE_API_URL
  Interceptor de request: agrega Authorization: Bearer <token> del authStore.
  Interceptor de response: si 401 → logout y redirige a /login.

Exporta funciones agrupadas:
  estudiantesService: { getAll, getById, create, update, delete }
  aspirantesService:  { getAll, approve, reject, updateInterview }
  formularioService:  { getFields, saveFields }
  gruposService:      { getAll, create, update, delete }

## ESTILOS GLOBALES (src/assets/main.css)
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-base text-black font-sans; }
  h1   { @apply text-2xl font-bold text-primary; }
  h2   { @apply text-xl font-semibold text-primary; }
  h3   { @apply text-base font-medium text-accent; }
}

@layer components {
  .sidebar-item {
    @apply flex items-center gap-3 px-4 py-3 rounded-lg
           text-gray-600 text-sm font-medium cursor-pointer
           transition-colors duration-150;
  }
  .sidebar-item:hover  { @apply bg-primary/10 text-primary; }
  .sidebar-item.active { @apply bg-primary text-white border-l-4 border-primary; }
}

## ACCESIBILIDAD Y CALIDAD
- Todos los inputs deben tener label asociado o aria-label.
- Tablas deben tener role="table" con thead/tbody correctos.
- Modales deben atrapar el foco (focus trap) y cerrarse con Escape.
- Botones de solo ícono deben tener aria-label descriptivo.
- Transiciones CSS deben respetar prefers-reduced-motion.

## ORDEN DE IMPLEMENTACIÓN SUGERIDO
1. tailwind.config.js con colores custom
2. src/assets/main.css
3. src/services/api.ts
4. Stores: authStore, formularioStore, estudiantesStore, aspirantesStore
5. Componentes UI: BaseCard, BaseButton, BaseInput, BaseModal, BaseTable,
                   BaseSearchBar, BaseBadge, BaseCalendar

7. LoginView
8. AdminLayout (sidebar + topbar)
9. StudentsView (vista más completa, sirve de referencia)

Genera primero la estructura de archivos y carpetas, luego implementa componente
por componente en el orden anterior. Cada archivo debe ser completo y funcional,
sin código de placeholder.