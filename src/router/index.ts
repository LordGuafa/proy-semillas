import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/landing/HomeView.vue'
import LoginView from '@/views/admin/LoginView.vue'
import AdmissionsView from '@/views/admmissions/AdmissionsView.vue'
import EnrollmentView from '@/views/admmissions/EnrollmentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admisiones',
      name: 'admissions',
      component:  AdmissionsView
    },
    {
      path: '/inscripcion-matricula',
      name: 'enrollment',
      component: EnrollmentView
    }
  ],
})

export default router
