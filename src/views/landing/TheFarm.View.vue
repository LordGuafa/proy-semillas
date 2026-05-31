<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import logoSemillas from '@/assets/logo_semillas.svg'
import barnIcon from '@/assets/barn.svg'
import farmPhoto1 from '@/assets/niños1.webp'
import farmPhoto2 from '@/assets/niños2.webp'
import farmPhoto3 from '@/assets/niños3.webp'

const farmPhotos = [farmPhoto1, farmPhoto2, farmPhoto3]
const activePhotoIndex = ref(0)
const autoplayTimer = ref<number | null>(null)

const activeFarmPhoto = computed(() => farmPhotos[activePhotoIndex.value])
const isAtFirstPhoto = computed(() => activePhotoIndex.value === 0)
const isAtLastPhoto = computed(() => activePhotoIndex.value === farmPhotos.length - 1)

const farmNarrative = [
    'En la Escuela Taller Semillas, tenemos la fortuna de contar con un espacio que nos brinda el contacto continuo con la naturaleza y todos los habitantes de este entorno. Es nuestra granja educativa “La Gozadera”, ubicada en el municipio de San Francisco Cundinamarca a 1900 msnm, realizamos siembras y cultivos de diferentes especies, que enseñan una relación de equilibrio con la tierra, la idea de una producción saludable de alimentos con una sensación de gratitud, la protección y cuidado de las fuentes hídricas y fortalece en las niñas y los niños,  Además, en estas visitas, tenemos contacto con los animales que habitan la granja, logramos conocer sus estilos de vida, necesidades, su forma de reproducción, de alimentación y cuidado. De igual manera se desarrolla la capacidad de observación y escucha de colores formas, sonidos de la naturaleza, de las especies silvestres, las maneras en las que podemos aproximarnos a ellos según sus características, aprender de sus formas de vida, de manera que se pueda comprender su valor y se desarrolle un sentido de respeto por su existencia.',
    'El contacto con la naturaleza es una experiencia invaluable que pensamos es fundamental para la formación de seres humanos más sensibles y menos indiferentes.'
]

const stopAutoplay = () => {
    if (autoplayTimer.value !== null) {
        window.clearInterval(autoplayTimer.value)
        autoplayTimer.value = null
    }
}

const prevPhoto = () => {
    if (!isAtFirstPhoto.value) {
        activePhotoIndex.value -= 1
    }
}

const nextPhoto = () => {
    if (!isAtLastPhoto.value) {
        activePhotoIndex.value += 1
    }
}

const startAutoplay = () => {
    stopAutoplay()
    autoplayTimer.value = window.setInterval(() => {
        if (activePhotoIndex.value < farmPhotos.length - 1) {
            activePhotoIndex.value += 1
            return
        }

        stopAutoplay()
    }, 3200)
}

onMounted(() => {
    startAutoplay()
})

onBeforeUnmount(() => {
    stopAutoplay()
})
</script>

<template>
    <main class="bg-base py-6 md:py-8">
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 md:px-8 lg:px-12">
            <section
                class="farm-hero rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm md:p-8 lg:p-10">
                <div class="flex flex-col gap-3">
                    <img :src="logoSemillas" alt="Semillas Escuela Taller" class="h-20 w-auto object-contain md:h-24" />
                    <h1 class="title-sub text-3xl md:text-5xl">La granja</h1>
                    <p class="font-comfortaa text-base leading-7 text-slate-800 max-w-4xl mx-auto">
                        En la Escuela Taller Semillas, tenemos la fortuna de contar con un espacio que nos brinda el
                        contacto continuo con la naturaleza y todos los habitantes de este entorno. Es nuestra granja
                        educativa “La Gozadera”, ubicada en el municipio de San Francisco Cundinamarca a 1900 msnm,
                        realizamos siembras y cultivos de diferentes especies, que enseñan una relación de equilibrio
                        con la tierra, la idea de una producción saludable de alimentos con una sensación de gratitud,
                        la protección y cuidado de las fuentes hídricas y fortalece en las niñas y los niños
                    </p>
                </div>
            </section>

            <section class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <article class="farm-panel rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6 lg:p-8">
                    <div class="mb-5 flex items-center gap-3">
                        <div class="farm-icon-badge">
                            <img :src="barnIcon" alt="Ícono de granja" class="farm-icon" />
                        </div>
                        <div>
                            <h2 class="title-sub text-2xl md:text-3xl">Un vistazo a la granja</h2>
                            <p class="font-comfortaa text-base leading-7 text-slate-800">Desliza las imágenes para
                                conocer el espacio.</p>
                        </div>
                    </div>

                    <div
                        class="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-3 shadow-inner md:p-4">
                        <div class="farm-swiper">
                            <div class="farm-slide">
                                <transition name="farm-fade" mode="out-in">
                                    <img :key="activeFarmPhoto" :src="activeFarmPhoto"
                                        :alt="`Foto de la granja ${activePhotoIndex + 1}`" class="farm-photo" />
                                </transition>
                            </div>
                        </div>

                        <button type="button" class="farm-nav farm-nav-left" aria-label="Foto anterior"
                            :disabled="isAtFirstPhoto" @click="prevPhoto">
                            <span>‹</span>
                        </button>
                        <button type="button" class="farm-nav farm-nav-right" aria-label="Siguiente foto"
                            :disabled="isAtLastPhoto" @click="nextPhoto">
                            <span>›</span>
                        </button>
                    </div>
                </article>

                <aside class="farm-panel rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6 lg:p-8">
                    <div class="mb-5 flex items-center gap-3">
                        <div class="farm-icon-badge farm-icon-badge--soft">
                            <img :src="barnIcon" alt="Ícono de granja" class="farm-icon" />
                        </div>
                        <h2 class="title-sub text-2xl md:text-3xl">¿Qué hacemos en nuestras visitas?</h2>
                    </div>

                    <div
                        class="space-y-4 text-justify font-comfortaa leading-7 text-slate-700 md:leading-7">
                        <p>
                            En estas visitas, tenemos contacto con los animales que habitan la granja, logramos conocer
                            sus estilos de vida, necesidades, su forma de reproducción, de alimentación y cuidado. De
                            igual manera se desarrolla la capacidad de observación y escucha de colores formas, sonidos
                            de la naturaleza, de las especies silvestres, las maneras en las que podemos aproximarnos a
                            ellos según sus características, aprender de sus formas de vida, de manera que se pueda
                            comprender su valor y se desarrolle un sentido de respeto por su existencia.
                            <br>
                            El contacto con la naturaleza es una experiencia invaluable que pensamos es fundamental para
                            la
                            formación de seres humanos más sensibles y menos indiferentes.
                        </p>
                    </div>
                </aside>
            </section>

        </div>
    </main>
</template>

<style scoped>
.farm-hero {
    background: #fff;
}

.farm-panel {
    background: #fff;
}

.farm-icon-badge {
    display: grid;
    place-items: center;
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(254, 243, 199, 0.95) 0%, rgba(252, 211, 77, 0.75) 100%);
    box-shadow: 0 12px 24px rgba(120, 89, 24, 0.12);
    flex: 0 0 auto;
}

.farm-icon-badge--soft {
    background: linear-gradient(180deg, rgba(254, 226, 226, 0.95) 0%, rgba(248, 113, 113, 0.55) 100%);
}

.farm-icon {
    width: 1.9rem;
    height: 1.9rem;
    object-fit: contain;
}

.farm-swiper {
    width: 100%;
    overflow: hidden;
    border-radius: 1.75rem;
}

.farm-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 22rem;
}

.farm-photo {
    width: 100%;
    max-width: 100%;
    height: 22rem;
    object-fit: cover;
    border-radius: 1.5rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.farm-nav {
    position: absolute;
    top: 50%;
    z-index: 20;
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.95);
    color: #c2410c;
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
    transform: translateY(-50%);
    transition: transform 180ms ease, background 180ms ease, color 180ms ease;
}

.farm-nav:hover {
    transform: translateY(-50%) scale(1.08);
    background: #fff;
    color: #7c2d12;
}

.farm-nav:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: translateY(-50%);
}

.farm-nav span {
    font-size: 2rem;
    line-height: 1;
}

.farm-nav-left {
    left: 0.85rem;
}

.farm-nav-right {
    right: 0.85rem;
}

.farm-fade-enter-active,
.farm-fade-leave-active {
    transition: opacity 380ms ease, transform 380ms ease;
}

.farm-fade-enter-from,
.farm-fade-leave-to {
    opacity: 0;
    transform: scale(0.985);
}

.farm-narrative p {
    text-wrap: pretty;
    hyphens: auto;
}

@media (max-width: 767px) {
    .farm-slide {
        min-height: 16rem;
    }

    .farm-photo {
        height: 16rem;
    }

    .farm-nav {
        width: 2.4rem;
        height: 2.4rem;
    }

    .farm-nav span {
        font-size: 1.75rem;
    }
}
</style>
