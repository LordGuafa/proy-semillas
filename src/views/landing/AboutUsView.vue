<script setup lang="ts">
import { AcademicCapIcon, CalendarDaysIcon, EyeIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import logoSemillas from '@/assets/logo_semillas.svg'

const aboutCards = [
    {
        title: 'Misión',
        icon: AcademicCapIcon,
        text: 'Somos la Escuela Taller Semillas, un programa de Educación Inicial, que practica la formación de las niñas y los niños desde las artes y la educación ambiental, en coherencia con las condiciones sociales y culturales, como personas creativas y transformadoras, de interrelación desde la no violencia, en el contexto colombiano y latino americano.',
    },
    {
        title: 'Visión',
        icon: EyeIcon,
        text: 'Ser un programa de Educación Inicial líder en el país, desde el fortalecimiento de la relación de las niñas y los niños con las artes y los entornos de ciudad y naturaleza, como un camino seguro y saludable para su desarrollo, hacia el logro de la claridad y comprensión de su horizonte y espacio en el mundo situándose como seres de paz.',
    },
    {
        title: 'Equipo Docente',
        icon: UserGroupIcon,
        text: 'Somos un equipo que ha trabajado durante varias décadas en la búsqueda de herramientas que aporten al desarrollo de las niñas y los niños, teniendo en cuenta los cambios y movimientos sociales y culturales a los que nos vemos abocados constantemente. Somos Aminta Peña Riveros, educadora Inicial en plásticas, Víctor H Peña Riveros, educador ambiental y de diseño y construcción y Leonor Aljure Lis, educadora en música y juego coreográfico y construcción literaria.',
    },
    {
        title: 'Horarios y calendario',
        icon: CalendarDaysIcon,
        text: 'El año lectivo en semillas inicia en el mes de febrero y termina en diciembre. Los horarios son desde las 8 de la mañana hasta las 12 del día, con opción de ampliarlo hasta las 3 de la tarde.',
    },
]
</script>

<template>
    <main class="bg-base py-6 md:py-8 text-slate-900">
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 md:px-8 lg:px-12">
            <section class="rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm md:p-8 lg:p-10">
                <div class="flex flex-col items-center gap-3">
                    <img :src="logoSemillas" alt="Semillas Escuela Taller" class="h-20 w-auto object-contain md:h-24" />
                   
                      <h1 class="title-sub text-3xl md:text-5xl text-accent">Sobre Nosotros</h1>
                      <p class="font-comfortaa text-justify leading-7 text-slate-800 max-w-4xl mx-auto">
                                    La Escuela Taller Semillas acompaña a las niñas y los niños desde las artes, la educación
                                    ambiental y el trabajo en comunidad.
                                </p>
                </div>
            </section>

            <section class="grid gap-6 md:grid-cols-2">
                <article v-for="card in aboutCards" :key="card.title"
                    class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 md:p-7">
                    <div class="mb-4 flex items-center gap-3">
                        <div class="about-icon-badge">
                            <component :is="card.icon" class="about-icon" aria-hidden="true" />
                        </div>
                        <h2 class="title-sub text-2xl md:text-3xl text-primary">{{ card.title }}</h2>
                    </div>
                    <p class="font-comfortaa text-base leading-7 text-slate-800 max-w-4xl mx-auto">
                        {{ card.text }}
                    </p>
                </article>
            </section>
        </div>
    </main>
</template>

<style scoped>
.about-icon-badge {
    display: grid;
    place-items: center;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(236, 253, 245, 0.95) 0%, rgba(187, 247, 208, 0.72) 100%);
    box-shadow: 0 12px 24px rgba(6, 95, 70, 0.08);
    color: #065f46;
    flex: 0 0 auto;
}

.about-icon {
    width: 1.9rem;
    height: 1.9rem;
    color: #065f46;
}
</style>
