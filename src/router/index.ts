import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/authStore";
import { setApiRouter } from "@/services/api";
import AdminLayout from "@/layouts/AdminLayout.vue";
import LoginView from "@/views/admin/LoginView.vue";
import StudentsView from "@/views/admin/StudentsView.vue";
import FormularioView from "@/views/admin/FormularioView.vue";
import AspirantesView from "@/views/admin/AspirantesView.vue";
import GruposView from "@/views/admin/GruposView.vue";
import ExalumnosView from "@/views/admin/ExalumnosView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
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
          path: "grupos",
          name: "grupos",
          component: GruposView,
          meta: { title: "Grupos" },
        },
        {
          path: "exalumnos",
          name: "exalumnos",
          component: ExalumnosView,
          meta: { title: "Exalumnos" },
        },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/login" },
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
