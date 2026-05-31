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
import AdmissionsView from "@/views/admmissions/AdmissionsView.vue";
import EnrollmentView from "@/views/admmissions/EnrollmentView.vue";
import WorkshopView from '@/views/landing/WorkshopView.vue';
import HomeView from '../views/landing/HomeView.vue';
import TheFarmView from '@/views/landing/TheFarm.View.vue';
import AboutUsView from '@/views/landing/AboutUsView.vue';
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
      path: "/home",
      name: "home",
      component: HomeView,
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
    {
      path: "/talleres",
      name: "workshop",
      component: WorkshopView,
      meta: { requiresAuth: false, title: "Workshops" },
    },
    {
      path: "/la-granja",
      name: "the-farm",
      component: TheFarmView,
      meta: { requiresAuth: false, title: "Farm" },
    },
    {
      path: "/sobre-nosotros",
      name: "about-us",
      component: AboutUsView,
      meta: { requiresAuth: false, title: "AboutUs" },
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return { el: to.hash }
    }

    return { top: 0 }
  },
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
