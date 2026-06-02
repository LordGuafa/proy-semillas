# Arquitectura del Proyecto - Portal Semillas

```plantuml
@startuml
!include <C4/C4_Container>
!include <C4/C4_Component>

LAYOUT_TOP_DOWN()

title Diagrama de Arquitectura - Portal Semillas Escuela Taller

Person(user, "Usuario", "Visitante o administrador de la escuela")

System_Boundary(frontend, "Frontend (Vue 3 SPA)") {
  Boundary(entry, "Capa de Entrada") {
    Container(index_html, "index.html", "HTML", "Punto de entrada único de la SPA")
    Container(main_ts, "main.ts", "TypeScript", "Bootstrap: createApp + Pinia + Router + i18n + CSS")
    Container(app_vue, "App.vue", "Vue SFC", "Componente raíz: Header + RouterView + Footer")
  }

  Boundary(routing, "Enrutamiento") {
    Container(router, "Vue Router", "TypeScript", "Configuración de rutas públicas y admin")
    Container(auth_guard, "Auth Guard", "TypeScript", "Protección de rutas admin (JWT)")
  }

  Boundary(views, "Vistas / Pages") {
    Container(landing, "Landing Views", "Vue SFC", "Home, Talleres, La Granja, Sobre Nosotros")
    Container(admissions, "Admissions Views", "Vue SFC", "Admisiones e Inscripción/Matrícula")
    Container(admin_views, "Admin Views", "Vue SFC", "Dashboard, Estudiantes, Matrículas, Entrevistas, Aspirantes, Exalumnos, Formulario")
    Container(login, "Login View", "Vue SFC", "Inicio de sesión del administrador")
  }

  Boundary(components, "Componentes") {
    Container(ui_lib, "UI Library", "Vue SFC", "BaseButton, BaseInput, BaseModal, BaseTable, BaseCard, BaseSelect, etc.")
    Container(domain_comp, "Domain Components", "Vue SFC", "EstudianteModal, GuardianCard, MatriculaDetailModal, CampoEditorItem, etc.")
    Container(landing_comp, "Landing Components", "Vue SFC", "WorkshopSectionCard")
    Container(layouts, "Layouts", "Vue SFC", "AdminLayout, DashboardLayout")
    Container(header_footer, "Header / Footer", "Vue SFC", "Header + AuxBar + SideBar + Footer")
  }

  Boundary(state, "State Management (Pinia)") {
    Container(auth_store, "authStore", "Pinia Store", "Autenticación JWT + persistencia localStorage")
    Container(students_store, "estudiantesStore", "Pinia Store", "CRUD estudiantes + guardianes + cache")
    Container(matriculas_store, "matriculasStore", "Pinia Store", "Inscripciones con paginación y filtros")
    Container(admissions_store, "admissionsStore", "Pinia Store", "Esquema de entrevistas + slots + envío")
    Container(entrevistas_store, "entrevistasStore", "Pinia Store", "Gestión de entrevistas")
    Container(formulario_store, "formularioStore", "Pinia Store", "Editor dinámico de esquemas de formulario")
    Container(aspirantes_store, "aspirantesStore", "Pinia Store", "Gestión de aspirantes")
    Container(enrollment_store, "enrollmentStore", "Pinia Store", "Datos del formulario de inscripción")
    Container(user_store, "userStore", "Pinia Store", "Estado del usuario")
  }

  Boundary(services, "Capa de Servicios") {
    Container(api, "api.ts", "Axios", "Instancia Axios + servicios tipados por dominio")
  }
}

Boundary(i18n, "Internacionalización") {
  Container(i18n_config, "vue-i18n", "TypeScript", "Español por defecto, Inglés como respaldo")
}

Boundary(backend, "Backend (FastAPI)", "Python") {
  Container(api_rest, "API REST", "FastAPI", "http://localhost:8000/api/v1")
}

Boundary(infra, "Infraestructura") {
  Container(docker, "Docker", "Dockerfile + docker-compose", "Build multi-etapa: Node 22 -> nginx 1.27-alpine")
  Container(nginx, "Nginx", "Servidor Web", "SPA config: try_files /index.html")
}

Rel(user, index_html, "Accede via navegador")
Rel(index_html, main_ts, "Carga")
Rel(main_ts, app_vue, "Monta")
Rel(main_ts, router, "Inicializa")
Rel(main_ts, i18n_config, "Configura")

Rel(app_vue, header_footer, "Renderiza")
Rel(app_vue, router, "Renderiza <RouterView>")

Rel(router, auth_guard, "Protege rutas admin")
Rel(router, landing, "Rutea /home, /talleres, /la-granja, /sobre-nosotros")
Rel(router, admissions, "Rutea /admisiones, /inscripciones-matricula")
Rel(router, admin_views, "Rutea /admin/*")
Rel(router, login, "Rutea /login")

Rel(landing, landing_comp, "Usa componentes")
Rel(admin_views, layouts, "Usa layouts")
Rel(admin_views, domain_comp, "Usa componentes")
Rel(admin_views, ui_lib, "Usa componentes UI")
Rel(admissions, ui_lib, "Usa componentes UI")

Rel(landing, auth_store, "Consulta estado")
Rel(admin_views, auth_store, "Consulta estado")
Rel(admin_views, students_store, "Opera estudiantes")
Rel(admin_views, matriculas_store, "Opera matrículas")
Rel(admin_views, entrevistas_store, "Opera entrevistas")
Rel(admin_views, aspirantes_store, "Opera aspirantes")
Rel(admin_views, formulario_store, "Opera formularios")
Rel(admissions, admissions_store, "Opera admisiones")
Rel(admissions, enrollment_store, "Opera inscripciones")

Rel(auth_store, api, "Llama /auth/*")
Rel(students_store, api, "Llama /students/*, /parent/*, /medical_information/*")
Rel(matriculas_store, api, "Llama /inscription/*")
Rel(admissions_store, api, "Llama /interview/*, /time_slot/*")
Rel(entrevistas_store, api, "Llama /interview/*")
Rel(formulario_store, api, "Llama endpoints de formularios")
Rel(aspirantes_store, api, "Llama endpoints de aspirantes")
Rel(enrollment_store, api, "Llama endpoints de inscripción")

Rel(api, api_rest, "HTTP Requests")

Rel(api_rest, docker, "Corre en")
Rel(docker, nginx, "Sirve frontend build")

@enduml
```

---

## Descripción de Capas

| Capa | Tecnología | Propósito |
|---|---|---|
| **Entrada** | `index.html` + `main.ts` | Bootstrap de la aplicación: monta Vue, Pinia, Router e i18n |
| **Enrutamiento** | Vue Router 4 | Define rutas públicas (`/home`, `/talleres`, `/admisiones`) y privadas (`/admin/*`) con guardias de autenticación |
| **Vistas** | Vue SFCs | Páginas organizadas por dominio: landing público, formularios de admisión, panel admin |
| **Componentes** | Vue SFCs | Librería UI reutilizable (10 componentes base) + componentes de dominio específicos |
| **Estado** | Pinia 3 | 9 stores que manejan toda la lógica de negocio, llamadas API y persistencia local |
| **Servicios** | Axios | Capa HTTP tipada con instancia centralizada y servicios por recurso |
| **Internacionalización** | vue-i18n | Soporte español/inglés |
| **Infraestructura** | Docker + Nginx | Build multi-etapa y servidor SPA para producción |

## Flujo de Datos

```
Usuario → index.html → main.ts → App.vue → RouterView → Vista
                                                    ↓
                                              Pinia Store
                                                    ↓
                                              api.ts (Axios)
                                                    ↓
                                    Backend FastAPI (localhost:8000/api/v1)
```
