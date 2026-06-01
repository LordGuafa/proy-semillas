import { defineStore } from 'pinia'
import { readJSON, writeJSON } from '@/utils/storage'
import { inscriptionService } from '@/services/api'

export type Person = Record<string, unknown>

export type EnrollmentPayload = {
  estudiante: {
    nombres: string
    apellidos: string
    fecha_nacimiento: string
    tipo_documento: string
    documento_identidad: string
    direccion_residencia: string
    barrio: string
    estrato: number
    foto_url?: string
    tiene_transporte_ruta?: boolean
    tiene_almuerzo?: boolean
    observaciones_relevantes?: string
  }
  padre: Person
  madre: Person
  acudiente_adicional?: Person
  responsable_pago?: Person
}

const storageKey = 'semillas-enrollment'

export const useEnrollmentStore = defineStore('enrollment', {
  state: () => ({
    lastEnrollment: readJSON<EnrollmentPayload | null>(storageKey, null) as EnrollmentPayload | null,
    loading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async submitEnrollment(payload: EnrollmentPayload) {
      this.loading = true
      this.error = null
      try {
        const resp = await inscriptionService.create(payload)
        // persist last submission locally
        this.lastEnrollment = payload
        writeJSON(storageKey, payload)
        return resp.data
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        this.error = `Error enviando inscripción: ${message}`
        throw err
      } finally {
        this.loading = false
      }
    },
    loadLast() {
      this.lastEnrollment = readJSON<EnrollmentPayload | null>(storageKey, null)
      return this.lastEnrollment
    },
    clearLast() {
      this.lastEnrollment = null
      try { writeJSON(storageKey, null) } catch { }
    },
  },
})
