<script setup>
import 'swiper/bundle'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { useRouter } from 'vue-router'
import './home-view.css'
import BaseButton from '@/components/ui/BaseButton.vue'
import img1 from '@/assets/niños1.webp'
import img2 from '@/assets/niños2.webp'
import img3 from '@/assets/niños3.webp'
import logoSemillas from '@/assets/logo_semillas.svg'
import sunIcon from '@/assets/sun.svg'
import barnIcon from '@/assets/barn.svg'
import treeIcon from '@/assets/tree.svg'
import builderIcon from '@/assets/builder.svg'
import bookIcon from '@/assets/book.svg'
import creativityIcon from '@/assets/creativity.svg'
import musicIcon from '@/assets/music.svg'

const router = useRouter()

const welcomeCards = [
  {
    title: 'Arte y expresión',
    text: 'En la Escuela Taller Semillas realizamos una continua práctica artística de diferentes disciplinas, con ello descubrimos las potencialidades, gustos, maneras de expresar y de interactuar entre niños y niñas, en espacios de dinámicas dirigidas o dinámicas de juego libre y con los diferentes aspectos artísticos.',
  },
  {
    title: 'Naturaleza y cuidado',
    text: 'Propendemos por tener contacto con la naturaleza en el campo, en nuestra granja educativa ubicada en San Francisco Cundinamarca, en la búsqueda continua de eventos y aconteceres que les provoque interés por conocer, cuidar y respetar todos los seres que habitan la tierra y sus ecosistemas y la naturaleza de la ciudad en la que vivimos, Bogotá.',
  },
  {
    title: 'Aprender en dos caminos',
    text: 'En la Escuela Taller Semillas nos sumergimos en un mundo de experiencias en dos vectores principales: la educación ambiental y las prácticas artísticas.',
  },
]

const workshopCards = [
  {
    title: 'Taller de educación Ambiental',
    icon: treeIcon,
    description: 'Aprendizajes que conectan con la naturaleza, el cuidado del entorno y la vida en comunidad.',
    bg: 'linear-gradient(180deg, rgba(236, 253, 245, 0.98) 0%, rgba(220, 252, 231, 0.92) 100%)',
    border: 'rgba(34, 197, 94, 0.28)',
    accent: 'rgba(22, 163, 74, 0.18)',
  },
  {
    title: 'Taller de diseño y construcción',
    icon: builderIcon,
    description: 'Exploración creativa para imaginar, construir y resolver con las manos.',
    bg: 'linear-gradient(180deg, rgba(255, 247, 237, 0.98) 0%, rgba(254, 243, 199, 0.92) 100%)',
    border: 'rgba(251, 146, 60, 0.28)',
    accent: 'rgba(249, 115, 22, 0.18)',
  },
  {
    title: 'Taller de construcción literaria',
    icon: bookIcon,
    description: 'Historias, lectura, escucha y palabra para construir imaginación y lenguaje.',
    bg: 'linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(224, 231, 255, 0.92) 100%)',
    border: 'rgba(96, 165, 250, 0.28)',
    accent: 'rgba(59, 130, 246, 0.18)',
  },
  {
    title: 'Taller de plásticas',
    icon: creativityIcon,
    description: 'Color, textura y expresión para experimentar con materiales y formas.',
    bg: 'linear-gradient(180deg, rgba(250, 245, 255, 0.98) 0%, rgba(243, 232, 255, 0.92) 100%)',
    border: 'rgba(192, 132, 252, 0.28)',
    accent: 'rgba(168, 85, 247, 0.18)',
  },
  {
    title: 'Taller de música y juego coreográfico',
    icon: musicIcon,
    description: 'Ritmo, movimiento y juego para coordinar cuerpo, voz y emoción.',
    bg: 'linear-gradient(180deg, rgba(255, 241, 247, 0.98) 0%, rgba(252, 231, 243, 0.92) 100%)',
    border: 'rgba(236, 72, 153, 0.26)',
    accent: 'rgba(244, 114, 182, 0.2)',
  },
]

const farmCards = [
  {
    title: 'Contacto con la naturaleza',
    description: 'Nuestra granja educativa La Gozadera, en San Francisco Cundinamarca, conecta a las niñas y los niños con la vida del campo.',
  },
  {
    title: 'Siembra y alimentos saludables',
    description: 'Las siembras y los cultivos enseñan una relación de equilibrio con la tierra y la producción saludable de alimentos.',
  },
  {
    title: 'Animales y respeto por la vida',
    description: 'El contacto con los animales fortalece la observación, la escucha y el respeto por sus formas de vida y necesidades.',
  },
]

const goToWorkshop = () => {
  router.push({ name: 'workshop' })
}

const scrollToFarm = async () => {
  await router.push({ name: 'the-farm' })
}
</script>

<template>
  <main class="min-h-screen bg-base">
    <div class="w-full overflow-hidden">
      <Swiper :slides-per-view="'auto'" :space-between="0" :loop="true"
        :autoplay="{ delay: 0, disableOnInteraction: false }" :speed="6000" :free-mode="true"
        :free-mode-momentum="false" :allow-touch-move="false" class="marquee-swiper">
        <SwiperSlide class="marquee-slide">
          <img :src="img1" alt="slide 1" class="marquee-img" />
        </SwiperSlide>
        <SwiperSlide class="marquee-slide">
          <img :src="img2" alt="slide 2" class="marquee-img" />
        </SwiperSlide>
        <SwiperSlide class="marquee-slide">
          <img :src="img3" alt="slide 3" class="marquee-img" />
        </SwiperSlide>
        <!-- duplicate slides to make the loop smoother -->
        <SwiperSlide class="marquee-slide">
          <img :src="img1" alt="slide 1" class="marquee-img" />
        </SwiperSlide>
        <SwiperSlide class="marquee-slide">
          <img :src="img2" alt="slide 2" class="marquee-img" />
        </SwiperSlide>
      </Swiper>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col items-center gap-3 text-center">
        <img :src="logoSemillas" alt="Semillas Escuela Taller" class="h-20 w-auto object-contain md:h-24" />
        <h1 class="title-sub text-3xl md:text-5xl">¡¡¡ Bienvenidos !!!</h1>
        <h2 class="font-comfortaa text-xl md:text-xl text-primary max-w-4xl">Aquí te contaremos lo importante y
          sencillo que es ofrecer, a las niñas y los niños de Educación Inicial, un ambiente en el que se sientan a
          gusto en su proceso de desarrollo y de crecer. </h2>
          <br>
      </div>

      <div class="mt-10 grid gap-10 md:grid-cols-3">
        <article v-for="(card, index) in welcomeCards" :key="index" class="welcome-card">
          <img :src="sunIcon" alt="Sol decorativo" class="welcome-sun" />
          <h3 class="relative z-10 title-sub text-2xl text-center md:text-3xl">
            {{ card.title }}
          </h3>
          <p class="relative z-10 font-comfortaa text-base leading-7 text-slate-800 text-justify">
            {{ card.text }}
          </p>
        </article>
      </div>
      <div class="mt-10 flex justify-center">
        <BaseButton
          variant="primary"
          size="lg"
          class="workshop-cta group min-w-[280px] rounded-full px-8 py-4 text-base font-semibold shadow-lg shadow-green-200/60"
          @click="scrollToFarm"
        >
          <span>¡Quiero agendar mi visita!</span>
          <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </BaseButton>
      </div>
      <section>
        <div class="max-w-7xl mx-auto px-4 py-8">
          <h1 class="title-sub text-3xl md:text-5xl text-center">Nuestros talleres</h1>
        </div>
        <div class="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-20 md:gap-y-24">
          <article
            v-for="(card, index) in workshopCards"
            :key="card.title"
            class="workshop-card w-full sm:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)]"
            :style="{
              '--workshop-bg': card.bg,
              '--workshop-border': card.border,
              '--workshop-accent': card.accent,
            }"
          >
            <div class="workshop-icon-wrap">
              <img :src="card.icon" :alt="card.title" class="workshop-icon" />
            </div>
            <h3
              class="title-sub text-2xl text-center md:text-3xl"
              :style="{ color: `color-mix(in srgb, ${card.accent} 72%, black)` }"
            >
              {{ card.title }}
            </h3>
            <p class="font-comfortaa text-base leading-7 text-slate-800 text-center">
              {{ card.description }}
            </p>
          </article>
        </div>

        <div class="mt-8 flex justify-center">
          <BaseButton
            variant="primary"
            size="lg"
            class="workshop-cta group min-w-[280px] rounded-full px-8 py-4 text-base font-semibold shadow-lg shadow-green-200/60"
            @click="goToWorkshop"
          >
            <span>¡Quiero conocer más sobre los talleres!</span>
            <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </BaseButton>
        </div>
      </section>

      

      <section id="granja">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <h1 class="title-sub text-3xl md:text-5xl text-center">La granja</h1>
        </div>
        <div class="mt-10 grid gap-10 md:grid-cols-3">
          <article v-for="card in farmCards" :key="card.title" class="welcome-card farm-card">
            <img :src="barnIcon" alt="Granja decorativa" class="welcome-sun" />
            <h3 class="farm-title relative z-10 title-sub text-2xl text-center md:text-3xl">
              {{ card.title }}
            </h3>
            <p class="relative z-10 font-comfortaa text-base leading-7 text-slate-800 text-center">
              {{ card.description }}
            </p>
          </article>
        </div>


      </section>
      <div class="mt-10 flex justify-center">
        <BaseButton
          variant="primary"
          size="lg"
          class="workshop-cta group min-w-[280px] rounded-full px-8 py-4 text-base font-semibold shadow-lg shadow-green-200/60"
          @click="scrollToFarm"
        >
          <span>¡Quiero conocer más sobre la granja!</span>
          <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </BaseButton>
      </div>
    </div>
  </main>
</template>
