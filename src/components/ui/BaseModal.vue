<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{ open: boolean; title?: string; size?: 'sm' | 'md' | 'lg'; zIndexClass?: string }>(), { title: '', size: 'md', zIndexClass: 'z-50' })
const emit = defineEmits<{ (event: 'close'): void }>()
const modalRef = ref<HTMLElement | null>(null)
let previousActiveElement: HTMLElement | null = null
const sizeClasses = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-5xl' }

function focusFirstElement() {
    window.requestAnimationFrame(() => {
        modalRef.value?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus()
    })
}

function handleKeydown(event: KeyboardEvent) {
    if (!props.open) return
    if (event.key === 'Escape') emit('close')
    if (event.key !== 'Tab' || !modalRef.value) return
    const focusableElements = Array.from(modalRef.value.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('disabled'))
    if (!focusableElements.length) return
    const firstElement = focusableElements[0]!
    const lastElement = focusableElements[focusableElements.length - 1]!
    if (event.shiftKey && document.activeElement === firstElement) { event.preventDefault(); lastElement.focus() }
    else if (!event.shiftKey && document.activeElement === lastElement) { event.preventDefault(); firstElement.focus() }
}

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            // save previously focused element to restore focus when modal closes
            previousActiveElement = document.activeElement as HTMLElement | null
            focusFirstElement()
        } else {
            // restore focus to previously focused element, if present
            if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
                window.requestAnimationFrame(() => previousActiveElement?.focus())
            }
            previousActiveElement = null
        }
    },
)

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    if (props.open) {
        previousActiveElement = document.activeElement as HTMLElement | null
        focusFirstElement()
    }
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="motion-safe:transition motion-safe:duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="motion-safe:transition motion-safe:duration-150"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="open" class="fixed inset-0 flex items-center justify-center bg-black/50 px-4 py-6"
                :class="zIndexClass"
                role="presentation" @click.self="emit('close')">
                <Transition enter-active-class="motion-safe:transition motion-safe:duration-200"
                    enter-from-class="scale-95 opacity-0" enter-to-class="scale-100 opacity-100"
                    leave-active-class="motion-safe:transition motion-safe:duration-150"
                    leave-from-class="scale-100 opacity-100" leave-to-class="scale-95 opacity-0">
                    <div ref="modalRef" class="w-full overflow-hidden rounded-2xl bg-white shadow-xl"
                        :class="sizeClasses[size]" role="dialog" aria-modal="true" :aria-label="title">
                        <header class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 class="text-lg text-primary">{{ title }}</h2>
                            <button type="button"
                                class="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                                aria-label="Cerrar modal" @click="emit('close')">X</button>
                        </header>
                        <div class="max-h-[80vh] overflow-y-auto px-6 py-5">
                            <slot />
                        </div>
                        <footer v-if="$slots.footer" class="border-t border-gray-100 px-6 py-4">
                            <slot name="footer" />
                        </footer>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>