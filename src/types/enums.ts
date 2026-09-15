export type RolUsuario = "administrador" | "directivo" | "profesor" | "usuario";

export type EstadoEstudiante = "ASPIRANTE" | "ACTIVO" | "RETIRADO" | "EGRESADO";

export type TipoEntradaMedica = "ALERGIA" | "ENFERMEDAD" | "ASPECTO_RELEVANTE";

export type TipoFormulario = "inscripcion" | "matricula" | "entrevista";

export type EstadoAprobacion = "PENDIENTE" | "APROBADA";

export type TipoDocumento = "RC" | "TI" | "CC" | "CE" | "PP" | "P";

export const tipoDocumentoLabel: Record<TipoDocumento, string> = {
  RC: "Registro Civil",
  TI: "Tarjeta de Identidad",
  CC: "Cédula de Ciudadanía",
  CE: "Cédula de Extranjería",
  PP: "Pasaporte",
  P: "Permiso",
};

export const estadoEstudianteLabel: Record<EstadoEstudiante, string> = {
  ASPIRANTE: "Aspirante",
  ACTIVO: "Activo",
  RETIRADO: "Retirado",
  EGRESADO: "Egresado",
};

export const estadoEstudianteBadge: Record<EstadoEstudiante, string> = {
  ASPIRANTE: "pending",
  ACTIVO: "active",
  RETIRADO: "inactive",
  EGRESADO: "graduated",
};

export const estadoAprobacionLabel: Record<EstadoAprobacion, string> = {
  PENDIENTE: "Pendiente",
  APROBADA: "Aprobada",
};

export const estadoAprobacionBadge: Record<EstadoAprobacion, string> = {
  PENDIENTE: "pending",
  APROBADA: "active",
};

export const tipoFormularioLabel: Record<TipoFormulario, string> = {
  inscripcion: "Formulario de Inscripción",
  matricula: "Formulario de Matrícula",
  entrevista: "Formulario de Entrevista",
};

export const tipoEntradaMedicaLabel: Record<TipoEntradaMedica, string> = {
  ALERGIA: "Alergia",
  ENFERMEDAD: "Enfermedad",
  ASPECTO_RELEVANTE: "Aspecto relevante",
};
