import { computed } from "vue";
import { useMatriculasStore } from "@/stores/matriculasStore";
import { useEstudiantesStore } from "@/stores/estudiantesStore";

export function useMatriculaDetails() {
  const matriculasStore = useMatriculasStore();
  const estudiantesStore = useEstudiantesStore();

  // 1. Datos de la matrícula seleccionada
  const matricula = computed(() => matriculasStore.selected);

  // 2. Obtener Observaciones (Directo del formulario de inscripción)
  const observaciones = computed(() => {
    return (
      matricula.value?.informacionForm?.observaciones_relevantes ||
      "Sin observaciones"
    );
  });

  // 3. Obtener Datos del Estudiante
  const estudiante = computed(() => {
    if (!matricula.value?.idEstudiante) return null;
    return estudiantesStore.estudiantes.find(
      (s) => s.id === matricula.value?.idEstudiante,
    );
  });

  const estudianteFullName = computed(() => {
    if (!estudiante.value) return "No encontrado";
    const { primerNombre, segundoNombre, primerApellido, segundoApellido } =
      estudiante.value;
    return `${primerNombre} ${segundoNombre || ""} ${primerApellido} ${segundoApellido || ""}`.trim();
  });

  // 4. Obtener Datos de los Acudientes
  // Esta función debe ser llamada al abrir el modal de detalle
  async function loadGuardianData() {
    if (!matricula.value?.idEstudiante) return;

    // Aseguramos que los estudiantes estén cargados primero
    if (estudiantesStore.estudiantes.length === 0) {
      await estudiantesStore.fetchEstudiantes();
    }

    // Cargamos los acudientes asociados a ese estudiante
    await estudiantesStore.fetchGuardians(matricula.value.idEstudiante);
  }

  const acudientes = computed(() => {
    const id = matricula.value?.idEstudiante;
    return id ? estudiantesStore.guardians[id] || [] : [];
  });

  // Obtener el acudiente principal vinculado específicamente en la matrícula
  const acudienteVinculado = computed(() => {
    const idAcudiente = matricula.value?.idAcudiente;
    return acudientes.value.find((g) => g.id === idAcudiente);
  });

  return {
    observaciones,
    estudianteFullName,
    acudientes,
    acudienteVinculado,
    loadGuardianData,
  };
}
