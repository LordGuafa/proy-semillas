<script setup lang="ts">
type WorkshopParagraphs = string[]

const props = defineProps<{
  title: string
  icon: string
  paragraphs: WorkshopParagraphs
  reverse?: boolean
  sectionBg: string
  sectionBorder: string
  sectionAccent: string
}>()

const sectionStyle = {
  '--section-bg': props.sectionBg,
  '--section-border': props.sectionBorder,
  '--section-accent': props.sectionAccent,
} as Record<string, string>

const titleStyle = {
  color: `color-mix(in srgb, ${props.sectionAccent} 72%, black)`,
}
</script>

<template>
  <article
    class="workshop-section group relative overflow-visible rounded-[2rem] bg-[var(--section-bg)] shadow-[0_18px_40px_rgba(120,89,24,0.10)] transition-transform duration-300 hover:-translate-y-1"
    :style="sectionStyle"
  >
    <div class="absolute left-6 right-6 top-4 h-1.5 rounded-full bg-[var(--section-accent)] md:left-8 md:right-8 md:top-5 lg:left-10 lg:right-10 lg:top-6"></div>

    <div class="flex flex-1 flex-col items-center gap-5 px-6 pb-10 pt-24 text-center md:px-8 md:pb-12 md:pt-28 lg:px-10 lg:pb-14 lg:pt-32">
      <h2 class="title-sub text-3xl md:text-4xl" :style="titleStyle">
        {{ title }}
      </h2>

      <div class="max-w-4xl space-y-4 text-left font-comfortaa text-base leading-7 text-slate-700">
        <p v-for="(paragraph, index) in paragraphs" :key="index" class = "text-justify">
          {{ paragraph }}
        </p>
      </div>
    </div>

    <div class="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
      <div class="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_14px_28px_rgba(120,89,24,0.12)] ring-6 ring-white transition-transform duration-300 group-hover:scale-105 md:h-30 md:w-30 lg:h-32 lg:w-32">
        <img :src="icon" :alt="title" class="h-14 w-14 object-contain md:h-16 md:w-16 lg:h-18 lg:w-18" />
      </div>
    </div>
  </article>
</template>
