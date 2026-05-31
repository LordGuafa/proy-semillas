<script setup lang="ts">
import logoSemillas from '@/assets/logo_semillas.svg'
import treeIcon from '@/assets/tree.svg'
import builderIcon from '@/assets/builder.svg'
import bookIcon from '@/assets/book.svg'
import creativityIcon from '@/assets/creativity.svg'
import musicIcon from '@/assets/music.svg'
import WorkshopSectionCard from '@/components/landing/WorkshopSectionCard.vue'

const workshops = [
  {
    title: 'Taller de educación Ambiental',
    icon: treeIcon,
    sectionBg: '#ffffff',
    sectionBorder: 'transparent',
    sectionAccent: 'rgba(22, 163, 74, 0.34)',
    paragraphs: [
      'Proponemos convertir los entornos educativos en aulas abiertas en las que descubrir la vida y sus diferentes expresiones sea motivo de asombro e interés. Esto incluye que cada estudiante se descubra e identifique como un ser que hace parte de la naturaleza, que se cuida y la cuida, se respeta y la respeta, y propende por relaciones en tendencia al equilibrio.',
      'Este enfoque lo logramos mediante las salidas pedagógicas a la granja educativa ubicada en el municipio de San Francisco Cundinamarca y a lugares de la ciudad que ofrecen la posibilidad de disfrutar y conocer en colectivo educativo. Hacemos una apuesta por educar seres humanos más sensibles y menos indiferentes.',
    ],
  },
  {
    title: 'Taller de diseño y construcción',
    icon: builderIcon,
    sectionBg: '#ffffff',
    sectionBorder: 'transparent',
    sectionAccent: 'rgba(249, 115, 22, 0.32)',
    paragraphs: [
      'Fomentamos la imaginación, la manipulación y la transformación, reconociendo diferentes materiales fabricados por el hombre o provenientes de la naturaleza, que mediante el uso de diferentes herramientas se convierten en un objeto útil, un juguete o un instrumento musical.',
      'Así las niñas y los niños se familiarizan con maderas de variadas texturas y colores, bambú, guadua, hilos, fibras naturales, semillas, chaquiras, papel, plástico, cartón. Idean, ensamblan, pulen, pintan y descubren que sus manos son su principal herramienta.',
      'También descubren que todo lo que nos rodea puede ser materia prima y que la idea de basura se transforma cuando aparece la capacidad de reutilizar lo que tenemos.',
    ],
  },
  {
    title: 'Taller de construcción literaria',
    icon: bookIcon,
    sectionBg: '#ffffff',
    sectionBorder: 'transparent',
    sectionAccent: 'rgba(59, 130, 246, 0.32)',
    paragraphs: [
      'En este taller logramos un encuentro cotidiano con “el libro”. Allí las niñas y los niños aprenden a utilizarlos con afecto, disfrutarlos con respeto y compartirlos con sus pares.',
      'Disponemos los cuentos en momentos de lectura libre en los que cada niño o niña escoge los libros de su preferencia, los intercambia y desarrolla un hábito y gusto por la lectura. En otros momentos realizamos lecturas en voz alta con el objetivo de lograr un nivel de escucha, concentración, participación y comprensión lectora.',
      'En este espacio también descubrimos que todo lo que sucede se puede contar y graficar mediante dibujos, grafos o letras. Esto lo implementamos con la confección de un cuaderno que fabricamos en el Taller de Diseño y Construcción.',
    ],
  },
  {
    title: 'Taller de plásticas',
    icon: creativityIcon,
    sectionBg: '#ffffff',
    sectionBorder: 'transparent',
    sectionAccent: 'rgba(168, 85, 247, 0.30)',
    paragraphs: [
      'Descubrimos el mundo del color, las texturas, tinturas, anilinas, pinceles, colores, plumones, crayolas y variadas técnicas en las composiciones individuales o colectivas, en diferentes formatos.',
      'Creamos dinámicas de creación colectiva con las que se realizan composiciones libres sobre piedras, maderas, papeles o superficies que posibilitan la experimentación, la creación y la expresividad.',
      'Promovemos la utilización del espacio, el dibujo, la pintura, la fortaleza y precisión del trazo, y la formación adecuada de la pinza al tomar el lápiz.',
    ],
  },
  {
    title: 'Taller de música y juego coreográfico',
    icon: musicIcon,
    sectionBg: '#ffffff',
    sectionBorder: 'transparent',
    sectionAccent: 'rgba(244, 114, 182, 0.30)',
    paragraphs: [
      'Acudimos a las prácticas musicales en las que el grupo conoce, ensaya y apropia las músicas regionales colombianas, latinoamericanas y del caribe. En este taller desarrollamos gusto por el canto en colectivo, y celebramos el canto individual cuando se da de manera espontánea.',
      'Con el juego corporal y coreográfico hacemos una constante búsqueda de las articulaciones del esquema corporal a través del movimiento libre de cada uno, en un espacio determinado en coordinación con otros cuerpos al compás de la música que hayamos escogido en ese momento.',
      'Realizamos prácticas instrumentales, en las que el grupo explora de manera libre, instrumentos de cuerdas, de cueros y percusiones menores que exigen una disponibilidad corporal, que establece su cuerpo como un espacio con lateralidades, direccionalidades y sectores que deben coordinar y disociar.',
    ],
  },
]
</script>

<template>
  <main class="bg-base">
    <div class="mx-auto w-full max-w-7xl px-4 py-6 space-y-8 md:px-8 lg:px-12 md:py-8 lg:py-10">
      <section class="relative mb-20 overflow-hidden rounded-[2rem] border border-white/80 bg-white p-6 text-center shadow-[0_18px_40px_rgba(120,89,24,0.10)] md:mb-24 md:p-10 lg:mb-28">
        <div class="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-200 via-amber-200 to-rose-200"></div>
        <div class="absolute -left-16 top-8 h-32 w-32 rounded-full bg-amber-100/70 blur-2xl"></div>
        <div class="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl"></div>

        <div class="relative flex flex-col items-center gap-4">
          <img :src="logoSemillas" alt="Semillas Escuela Taller" class="h-20 w-auto object-contain md:h-24" />
          <div class="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 font-comfortaa text-sm font-semibold text-amber-700 shadow-sm">
            <span class="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            Nuestra propuesta pedagógica
          </div>
          <h1 class="title-sub text-3xl md:text-5xl">Los talleres</h1>
          <p class="font-comfortaa text-justify leading-7 text-slate-800 max-w-4xl mx-auto">
            En la Escuela Taller Semillas, nos proponemos respetar el ritmo del crecer de cada niña y niño sin
            desconocer las señales que el desarrollo de cada uno de ellos puede llegar a tener. Por eso, realizamos el
            trabajo cotidiano mediante talleres, ya que así cada niña y niño puede percibir los aspectos de las
            disciplinas planteadas que más le llaman la atención, practicarlas, experimentarlas y descubrir las
            facilidades y dificultades que ellas le representan. Logrando diferentes maneras de expresar sus emociones,
            ideas y habilidades.
          </p>
        </div>
      </section>

      <div class="mt-10 grid gap-x-8 gap-y-20 lg:mt-14 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-24 xl:mt-16 xl:gap-y-28">
        <WorkshopSectionCard
          v-for="(workshop, index) in workshops"
          :title="workshop.title"
          :icon="workshop.icon"
          :paragraphs="workshop.paragraphs"
          :reverse="index % 2 === 1"
          :section-bg="workshop.sectionBg"
          :section-border="workshop.sectionBorder"
          :section-accent="workshop.sectionAccent"
          :class="index === workshops.length - 1 && workshops.length % 2 === 1 ? 'lg:col-span-2 lg:justify-self-center lg:max-w-[calc(50%-1rem)]' : ''"
        />
      </div>
    </div>
  </main>
</template>
