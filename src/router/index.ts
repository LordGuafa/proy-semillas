import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/authStore";
import { setApiRouter } from "@/services/api";
import AdminLayout from "@/layouts/AdminLayout.vue";
import LoginView from "@/views/admin/LoginView.vue";
import StudentsView from "@/views/EstudiantesView.vue";
import FormularioView from "@/views/admin/FormularioView.vue";
import AspirantesView from "@/views/admin/AspirantesView.vue";
import MatriculasView from "@/views/MatriculasView.vue";
import ExalumnosView from "@/views/admin/ExalumnosView.vue";
import LandingHome from "@/views/landing/HomeView.vue";
import AdmissionsView from "@/views/admmissions/AdmissionsView.vue";
import EnrollmentView from "@/views/admmissions/EnrollmentView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        { path: "", redirect: "/admin/estudiantes" },
        {
          path: "formulario",
          name: "formulario",
          component: FormularioView,
          meta: { title: "Formulario" },
        },
        {
          path: "aspirantes",
          name: "aspirantes",
          component: AspirantesView,
          meta: { title: "Aspirantes" },
        },
        {
          path: "estudiantes",
          name: "estudiantes",
          component: StudentsView,
          meta: { title: "Estudiantes" },
        },
        {
          path: "matriculas",
          name: "matriculas",
          component: MatriculasView,
          meta: { title: "Matrículas" },
        },
        {
          path: "exalumnos",
          name: "exalumnos",
          component: ExalumnosView,
          meta: { title: "Exalumnos" },
        },
      ],
    },
    {
      path: "/home",
      name: "home",
      component: LandingHome,
    },
    { path: "/:pathMatch(.*)*", redirect: "/login" },
    {
      path: "/admisiones",
      name: "admissions",
      component: AdmissionsView,
      meta: { requiresAuth: false, title: "Admissions" },
    },
    {
      path: "/inscripciones-matricula",
      name: "enrollment",
      component: EnrollmentView,
      meta: { requiresAuth: false, title: "Enrollment" },
    },
  ],
});

setApiRouter(router);

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated)
    return { path: "/login", query: { redirect: to.fullPath } };
  if (to.path === "/login" && authStore.isAuthenticated)
    return { path: "/admin/estudiantes" };
  return true;
});

export default router
