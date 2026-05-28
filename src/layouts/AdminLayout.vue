<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ArchiveBoxIcon, ClipboardDocumentListIcon, DocumentTextIcon, RectangleGroupIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navigation = [
    { name: 'Formulario', to: '/admin/formulario', icon: DocumentTextIcon },
    { name: 'Aspirantes', to: '/admin/aspirantes', icon: ClipboardDocumentListIcon },
    { name: 'Estudiantes', to: '/admin/estudiantes', icon: UserGroupIcon },
    { name: 'Grupos', to: '/admin/grupos', icon: RectangleGroupIcon },
    { name: 'Exalumnos', to: '/admin/exalumnos', icon: ArchiveBoxIcon },
]

const sectionTitle = computed(() => [...route.matched].reverse().find((entry) => entry.meta?.title)?.meta?.title as string | undefined || 'Panel administrativo')

function logout() { authStore.logout(); router.push('/login') }
</script>

<template>
    <div class="flex min-h-screen bg-base text-black">
        <aside class="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
            <div class="border-b border-gray-100 px-6 py-6">
                <p class="text-2xl font-bold text-primary">Semillas</p>
                <p class="text-sm text-gray-500">Escuela Taller</p>
            </div>
            <nav class="flex-1 space-y-2 p-4">
                <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" class="sidebar-item"
                    active-class="active">
                    <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
                    <span>{{ item.name }}</span>
                </RouterLink>
            </nav>
            <div class="border-t border-gray-100 p-4">
                <button type="button"
                    class="flex w-full items-center justify-center rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    @click="logout">Cerrar sesión</button>
            </div>
        </aside>
        <div class="flex min-w-0 flex-1 flex-col">
            <header class="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
                <h1 class="text-lg font-semibold text-primary">{{ sectionTitle }}</h1>
                <div class="flex items-center gap-3">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {{ authStore.user.name.charAt(0) }}</div>
                    <div class="leading-tight">
                        <p class="text-sm font-semibold text-gray-800">{{ authStore.user.name }}</p>
                        <p class="text-xs text-gray-500">{{ authStore.user.role }}</p>
                    </div>
                </div>
            </header>
            <main class="min-h-0 flex-1 overflow-y-auto p-6">
                <RouterView />
            </main>
        </div>
    </div>
</template>