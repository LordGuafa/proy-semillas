<template>
	<header class="fixed left-0 top-0 z-50 w-full bg-white overflow-visible shadow-sm">
		<div class="max-w-7xl mx-auto px-3 sm:px-4 pt-2 pb-3 md:pb-4 flex items-center justify-between relative z-20">
			<router-link to="/home" class="-ml-1 sm:-ml-2 md:-ml-16 flex items-center" aria-label="Ir a inicio">
				<img :src="logoSemillas" alt="Semillas Escuela Taller" class="h-14 w-auto object-contain sm:h-16 md:h-24" />
			</router-link>

			<nav class="hidden md:flex items-center gap-8 lg:gap-10">
				<router-link
					:to="{ name: 'home' }"
					class="title inline-flex items-center rounded-full px-4 py-2 text-2xl lg:text-3xl header-link transition"
					active-class="header-active"
					exact-active-class="header-active"
				>
					Inicio
				</router-link>
				<router-link
					:to="{ name: 'admissions' }"
					class="title inline-flex items-center rounded-full px-4 py-2 text-2xl lg:text-3xl header-link transition"
					active-class="header-active"
					exact-active-class="header-active"
				>
					Admisiones
				</router-link>
				<router-link
					:to="{ name: 'workshop' }"
					class="title inline-flex items-center rounded-full px-4 py-2 text-2xl lg:text-3xl header-link transition"
					active-class="header-active"
					exact-active-class="header-active"
				>
					Talleres
				</router-link>
				<router-link
					:to="{ name: 'the-farm' }"
					class="title inline-flex items-center rounded-full px-4 py-2 text-2xl lg:text-3xl header-link transition"
					active-class="header-active"
					exact-active-class="header-active"
				>
					La granja
				</router-link>
				<router-link
					:to="{ name: 'about-us' }"
					class="title inline-flex items-center rounded-full px-4 py-2 text-2xl lg:text-3xl header-link transition"
					active-class="header-active"
					exact-active-class="header-active"
				>
					Sobre nosotros
				</router-link>

			</nav>

			<button
				type="button"
				class="inline-flex items-center justify-center rounded-xl border border-primary px-3 py-2 text-primary transition hover:bg-primary/10 md:hidden"
				:aria-expanded="mobileMenuOpen"
				aria-label="Abrir menú de navegación"
				@click="mobileMenuOpen = !mobileMenuOpen"
			>
				<span class="sr-only">Abrir menú</span>
				<span class="flex flex-col gap-1.5">
					<span class="block h-0.5 w-5 rounded-full bg-current"></span>
					<span class="block h-0.5 w-5 rounded-full bg-current"></span>
					<span class="block h-0.5 w-5 rounded-full bg-current"></span>
				</span>
			</button>
		</div>

			<div v-show="mobileMenuOpen" class="relative z-30 md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3 shadow-sm">
			<nav class="flex flex-col gap-3">
					<router-link
						:to="{ name: 'home' }"
						class="title inline-flex items-center rounded-full px-4 py-2 text-2xl header-link transition"
						active-class="header-active"
						exact-active-class="header-active"
						@click="mobileMenuOpen = false"
					>
						Home
					</router-link>
					<router-link
						:to="{ name: 'admissions' }"
						class="title inline-flex items-center rounded-full px-4 py-2 text-2xl header-link transition"
						active-class="header-active"
						exact-active-class="header-active"
						@click="mobileMenuOpen = false"
					>
						Admisiones
					</router-link>
					<router-link
						:to="{ name: 'workshop' }"
						class="title inline-flex items-center rounded-full px-4 py-2 text-2xl header-link transition"
						active-class="header-active"
						exact-active-class="header-active"
						@click="mobileMenuOpen = false"
					>
						Talleres
					</router-link>

			</nav>
		</div>
		<div class="cloud-border"></div>
	</header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import logoSemillas from '@/assets/logo_semillas.svg'

const auth = useAuthStore()
const isAuth = computed(() => !!(auth && (auth as any).isAuthenticated))
const logout = () => { if ((auth as any).logout) (auth as any).logout() }
const mobileMenuOpen = ref(false)
</script>

<style scoped>
/* minimal style - tailwind classes used in template */
</style>

