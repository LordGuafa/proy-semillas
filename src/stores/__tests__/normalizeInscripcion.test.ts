import { describe, it, expect } from "vitest";

// Replicate the normalization functions to test independently
function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function toNumber(value: unknown, fallback = 0): number {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : String(value ?? fallback);
}

function normalizeEstado(value: unknown): "PENDIENTE" | "APROBADA" {
  return value === "APROBADA" ? "APROBADA" : "PENDIENTE";
}

interface Inscripcion {
  readonly id: number;
  idEstudiante: number;
  idAcudiente: number;
  estado: string;
  fechaInscripcion: string;
  informacionForm: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  status?: string;
  photoURL?: string;
  submittedAt?: string;
  interviewDate?: string;
  assignedTo?: string;
  estudiante?: Record<string, unknown>;
  acudiente?: Record<string, unknown>;
}

function normalizeInscripcion(value: unknown): Inscripcion {
  const data = toRecord(value);
  const fechaFallback = new Date().toISOString();
  return {
    id: toNumber(data.id, Date.now()),
    idEstudiante: toNumber(data.idEstudiante ?? data.id_estudiante),
    idAcudiente: toNumber(data.idAcudiente ?? data.id_acudiente),
    estado: normalizeEstado(data.estado),
    fechaInscripcion: toString(
      data.fechaInscripcion ?? data.fecha_inscripcion,
      fechaFallback,
    ),
    informacionForm: toRecord(data.informacionForm ?? data.informacion_form),
    createdAt: toString(data.createdAt ?? data.created_at, fechaFallback),
    updatedAt: toString(data.updatedAt ?? data.updated_at, fechaFallback),
    estudiante: data.estudiante
      ? (toRecord(data.estudiante) as Record<string, unknown>)
      : undefined,
    acudiente: data.acudiente
      ? (toRecord(data.acudiente) as Record<string, unknown>)
      : undefined,
    status: data.status
      ? (String(data.status) as Inscripcion["status"])
      : undefined,
    photoURL: data.photoURL ? String(data.photoURL) : undefined,
    submittedAt: data.submittedAt ? String(data.submittedAt) : undefined,
    interviewDate: data.interviewDate ? String(data.interviewDate) : undefined,
    assignedTo: data.assignedTo ? String(data.assignedTo) : undefined,
  };
}

describe("normalizeInscripcion", () => {
  it("preserves basic fields", () => {
    const input = {
      id: 42,
      idEstudiante: 1,
      idAcudiente: 2,
      estado: "PENDIENTE",
      fechaInscripcion: "2026-01-15T10:00:00Z",
      informacionForm: { foo: "bar" },
      createdAt: "2026-01-15T10:00:00Z",
      updatedAt: "2026-01-15T10:00:00Z",
    };
    const result = normalizeInscripcion(input);
    expect(result.id).toBe(42);
    expect(result.idEstudiante).toBe(1);
    expect(result.idAcudiente).toBe(2);
    expect(result.estado).toBe("PENDIENTE");
  });

  it("preserves status field when present", () => {
    const input = { id: 1, idEstudiante: 1, idAcudiente: 1, status: "RECHAZADA" };
    const result = normalizeInscripcion(input);
    expect(result.status).toBe("RECHAZADA");
  });

  it("preserves photoURL field when present", () => {
    const input = { id: 1, idEstudiante: 1, idAcudiente: 1, photoURL: "https://example.com/photo.jpg" };
    const result = normalizeInscripcion(input);
    expect(result.photoURL).toBe("https://example.com/photo.jpg");
  });

  it("preserves interviewDate field when present", () => {
    const input = { id: 1, idEstudiante: 1, idAcudiente: 1, interviewDate: "2026-02-01" };
    const result = normalizeInscripcion(input);
    expect(result.interviewDate).toBe("2026-02-01");
  });

  it("preserves assignedTo field when present", () => {
    const input = { id: 1, idEstudiante: 1, idAcudiente: 1, assignedTo: "Dr. Pérez" };
    const result = normalizeInscripcion(input);
    expect(result.assignedTo).toBe("Dr. Pérez");
  });

  it("preserves submittedAt field when present", () => {
    const input = { id: 1, idEstudiante: 1, idAcudiente: 1, submittedAt: "2026-01-20" };
    const result = normalizeInscripcion(input);
    expect(result.submittedAt).toBe("2026-01-20");
  });

  it("does not set optional fields when absent", () => {
    const input = { id: 1, idEstudiante: 1, idAcudiente: 1 };
    const result = normalizeInscripcion(input);
    expect(result.status).toBeUndefined();
    expect(result.photoURL).toBeUndefined();
    expect(result.interviewDate).toBeUndefined();
    expect(result.assignedTo).toBeUndefined();
    expect(result.submittedAt).toBeUndefined();
  });

  it("handles snake_case alternative fields", () => {
    const input = {
      id: 5,
      id_estudiante: 10,
      id_acudiente: 20,
      fecha_inscripcion: "2026-03-01T00:00:00Z",
    };
    const result = normalizeInscripcion(input);
    expect(result.idEstudiante).toBe(10);
    expect(result.idAcudiente).toBe(20);
    expect(result.fechaInscripcion).toBe("2026-03-01T00:00:00Z");
  });

  it("normalizes non-APROBADA estado to PENDIENTE", () => {
    const input = { id: 1, idEstudiante: 1, idAcudiente: 1, estado: "RECHAZADA" };
    const result = normalizeInscripcion(input);
    expect(result.estado).toBe("PENDIENTE");
  });

  it("normalizes APROBADA estado correctly", () => {
    const input = { id: 1, idEstudiante: 1, idAcudiente: 1, estado: "APROBADA" };
    const result = normalizeInscripcion(input);
    expect(result.estado).toBe("APROBADA");
  });

  it("handles null values gracefully", () => {
    const input = { id: null, idEstudiante: null, idAcudiente: null, status: null, photoURL: null };
    const result = normalizeInscripcion(input);
    expect(typeof result.id).toBe("number");
    expect(result.idEstudiante).toBe(0);
    expect(result.idAcudiente).toBe(0);
    expect(result.status).toBeUndefined();
    expect(result.photoURL).toBeUndefined();
  });

  it("handles empty object", () => {
    const result = normalizeInscripcion({});
    expect(typeof result.id).toBe("number");
    expect(result.idEstudiante).toBe(0);
    expect(result.idAcudiente).toBe(0);
    expect(result.estado).toBe("PENDIENTE");
  });

  it("handles non-object input", () => {
    const result = normalizeInscripcion(null);
    expect(typeof result.id).toBe("number");
    expect(result.estado).toBe("PENDIENTE");
  });
});

interface CollectionResult {
  items: Inscripcion[];
  pagination: { page: number; perPage: number; total: number };
}

function normalizeCollection(response: unknown): CollectionResult {
  if (Array.isArray(response)) {
    return {
      items: response.map((item) => normalizeInscripcion(item)),
      pagination: {
        page: 1,
        perPage: response.length || 10,
        total: response.length,
      },
    };
  }

  const payload = toRecord(response);
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.inscriptions)
        ? payload.inscriptions
        : Array.isArray(payload.inscripciones)
          ? payload.inscripciones
          : [];

  const pagination = toRecord(payload.pagination);
  const page = toNumber(pagination.page ?? payload.page, 1) || 1;
  const perPage =
    toNumber(pagination.perPage ?? payload.perPage, items.length || 10) || 10;
  const total =
    toNumber(pagination.total ?? payload.total, items.length) || items.length;

  return {
    items: items.map((item: unknown) => normalizeInscripcion(item)),
    pagination: { page, perPage, total },
  };
}

describe("normalizeCollection", () => {
  it("extracts items from inscriptions key (API response format)", () => {
    const response = {
      inscriptions: [
        { id: 1, id_estudiante: 20, id_acudiente: 23, estado: "APROBADA", fecha_inscripcion: "2026-06-01", informacion_form: {}, created_at: "2026-06-01", updated_at: "2026-06-01" },
        { id: 2, id_estudiante: 30, id_acudiente: 33, estado: "PENDIENTE", fecha_inscripcion: "2026-06-01", informacion_form: {}, created_at: "2026-06-01", updated_at: "2026-06-01" },
      ],
    };
    const result = normalizeCollection(response);
    expect(result.items).toHaveLength(2);
    expect(result.items[0]?.id).toBe(1);
    expect(result.items[1]?.id).toBe(2);
  });

  it("extracts items from inscripciones key (Spanish plural)", () => {
    const response = {
      inscripciones: [
        { id: 3, id_estudiante: 40, id_acudiente: 43, estado: "PENDIENTE", fecha_inscripcion: "2026-06-01", informacion_form: {}, created_at: "2026-06-01", updated_at: "2026-06-01" },
      ],
    };
    const result = normalizeCollection(response);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe(3);
  });

  it("extracts items from items key", () => {
    const response = {
      items: [
        { id: 5, id_estudiante: 50, id_acudiente: 55, estado: "PENDIENTE", fecha_inscripcion: "2026-06-02", informacion_form: {}, created_at: "2026-06-02", updated_at: "2026-06-02" },
      ],
    };
    const result = normalizeCollection(response);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe(5);
  });

  it("extracts items from data key", () => {
    const response = {
      data: [
        { id: 10, id_estudiante: 100, id_acudiente: 110, estado: "APROBADA", fecha_inscripcion: "2026-06-03", informacion_form: {}, created_at: "2026-06-03", updated_at: "2026-06-03" },
      ],
    };
    const result = normalizeCollection(response);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe(10);
  });

  it("handles direct array response", () => {
    const response = [
      { id: 7, id_estudiante: 70, id_acudiente: 77, estado: "PENDIENTE", fecha_inscripcion: "2026-06-04", informacion_form: {}, created_at: "2026-06-04", updated_at: "2026-06-04" },
    ];
    const result = normalizeCollection(response);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe(7);
  });

  it("returns empty items for unrecognized structure", () => {
    const response = { someOtherKey: [] };
    const result = normalizeCollection(response);
    expect(result.items).toHaveLength(0);
    expect(result.pagination.total).toBe(0);
  });

  it("handles empty inscriptions array", () => {
    const response = { inscriptions: [] };
    const result = normalizeCollection(response);
    expect(result.items).toHaveLength(0);
    expect(result.pagination.total).toBe(0);
  });
});
