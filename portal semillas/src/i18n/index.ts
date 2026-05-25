import { createI18n } from "vue-i18n";
import enAuth from "./auth/en"
import esAuth from "./auth/es"
const messages ={
    en: {
        auth: enAuth
    },
    es: {
        auth: esAuth
    }
}

export const i18n = createI18n({
    locale: "es",
    fallbackLocale: "en",
    messages,
    globalInjection: true})