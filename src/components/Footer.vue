<script setup lang="ts">
import mountainIcon from '@/assets/mountain.svg'
import InstagramBrandIcon from '@/components/icons/InstagramBrandIcon.vue'
import WhatsAppBrandIcon from '@/components/icons/WhatsAppBrandIcon.vue'
import { MapPinIcon } from '@heroicons/vue/24/outline'

const mountainSizes = [
    'footer-mountain--sm',
    'footer-mountain--md',
    'footer-mountain--sm',
    'footer-mountain--lg',
    'footer-mountain--sm',
    'footer-mountain--md',
    'footer-mountain--sm',
]

const socialNetworks = [
    {
        label: '@escuelatallersemillas',
        href: 'https://www.instagram.com/escuelatallersemillas?igsh=eTRyaTF3cjN0cWdy',
        icon: InstagramBrandIcon,
    },
]
const locationItems = [
    {
        label: 'Calle 22C #28-20 - Usatama Norte',
        icon: MapPinIcon,
    },
    {
        label: 'Bogotá, Colombia',
    },
]
const contactItems = [
    {
        label: 'WhatsApp: 3102332037',
        href: 'https://wa.me/573102332037',
        icon: WhatsAppBrandIcon,
    },
    {
        label: 'Atención de lunes a viernes',
    },
]
</script>

<template>
    <footer class="footer-shell bg-[#86b499] pt-14 pb-6">
        <div class="footer-sky" aria-hidden="true"></div>
        <div class="footer-mountains" aria-hidden="true">
            <span
                v-for="(mountainClass, index) in mountainSizes"
                :key="index"
                class="footer-mountain"
                :class="mountainClass"
                :style="{ WebkitMaskImage: `url(${mountainIcon})`, maskImage: `url(${mountainIcon})` }"
            ></span>
        </div>

        <div class="relative z-10 mx-auto max-w-7xl px-4 pt-20">
            <div class="grid gap-8 md:grid-cols-3">
                <section class="footer-card">
                    <h3 class="footer-title title-sub">Redes sociales</h3>
                    <ul class="footer-list">
                        <li v-for="network in socialNetworks" :key="network.label">
                            <a :href="network.href" target="_blank" rel="noreferrer" class="footer-link footer-item">
                                <component :is="network.icon" class="footer-icon" aria-hidden="true" />
                                <span>{{ network.label }}</span>
                            </a>
                        </li>
                    </ul>
                </section>

                <section class="footer-card">
                    <h3 class="footer-title title-sub">Ubicación</h3>
                    <ul class="footer-list">
                        <li v-for="item in locationItems" :key="item.label">
                            <span class="footer-item">
                                <component :is="item.icon" v-if="item.icon" class="footer-icon" aria-hidden="true" />
                                <span>{{ item.label }}</span>
                            </span>
                        </li>
                    </ul>
                </section>

                <section class="footer-card">
                    <h3 class="footer-title title-sub">Contacto</h3>
                    <ul class="footer-list">
                        <li v-for="item in contactItems" :key="item.label">
                            <a v-if="item.href" :href="item.href" target="_blank" rel="noreferrer" class="footer-link footer-item">
                                <component :is="item.icon" class="footer-icon" aria-hidden="true" />
                                <span>{{ item.label }}</span>
                            </a>
                            <span v-else class="footer-item">
                                <span>{{ item.label }}</span>
                            </span>
                        </li>
                    </ul>
                </section>
            </div>

            <div class="mt-8 border-t border-white/30 pt-5 text-center text-sm text-slate-700">
                © Escuela Taller Semillas — Todos los derechos reservados
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer-shell {
    position: relative;
    overflow: hidden;
}

.footer-sky {
    position: absolute;
    inset: 0 0 auto 0;
    height: 5.5rem;
    background: #eefeff;
}

.footer-mountains {
    position: absolute;
    top: 0.2rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    padding: 0 1.5rem;
    pointer-events: none;
    z-index: 1;
}

.footer-mountain {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #b3d09d;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center bottom;
    mask-position: center bottom;
    -webkit-mask-size: contain;
    mask-size: contain;
    opacity: 1;
}

.footer-mountain--sm {
    width: 4.5rem;
    height: 4.5rem;
}

.footer-mountain--md {
    width: 5.8rem;
    height: 5.8rem;
}

.footer-mountain--lg {
    width: 6.8rem;
    height: 6.8rem;
}

.footer-card {
    padding: 0;
}

.footer-title {
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.75rem;
}

.footer-list {
    display: grid;
    gap: 0.45rem;
    font-family: 'Comfortaa', sans-serif;
    font-size: 0.95rem;
    line-height: 1.5rem;
    color: #334155;
}

.footer-item {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
}

.footer-icon {
    width: 1rem;
    height: 1rem;
    flex: 0 0 auto;
    color: #000000;
}

.footer-link {
    color: #334155;
    text-decoration: none;
}

.footer-link:hover {
    color: #166534;
    text-decoration: underline;
}

@media (min-width: 768px) {
    .footer-mountains {
        top: 0.35rem;
        padding: 0 3rem;
    }

    .footer-mountain--sm {
        width: 5.4rem;
        height: 5.4rem;
    }

    .footer-mountain--md {
        width: 6.8rem;
        height: 6.8rem;
    }

    .footer-mountain--lg {
        width: 8rem;
        height: 8rem;
    }
}
</style>