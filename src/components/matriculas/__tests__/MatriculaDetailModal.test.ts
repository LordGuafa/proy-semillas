import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

vi.mock("@/utils/storage", () => ({
  readJSON: () => [],
  writeJSON: () => {},
  removeJSON: () => {},
}));

import MatriculaDetailModal from "@/components/matriculas/MatriculaDetailModal.vue";

function bodyText(): string {
  return document.body.textContent ?? "";
}

describe("MatriculaDetailModal", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    document.body.innerHTML = "";
  });

  it("renders modal title when open", () => {
    mount(MatriculaDetailModal, {
      props: { open: true, matricula: null },
      attachTo: document.body,
    });
    expect(bodyText()).toContain("Detalle de Matrícula");
  });

  it("renders student section when open", () => {
    mount(MatriculaDetailModal, {
      props: { open: true, matricula: null },
      attachTo: document.body,
    });
    expect(bodyText()).toContain("Estudiante");
  });

  it("renders student ID when matricula has idEstudiante", () => {
    mount(MatriculaDetailModal, {
      props: {
        open: true,
        matricula: { idEstudiante: 5, idAcudiente: 3 },
      },
      attachTo: document.body,
    });
    expect(bodyText()).toContain("ID Sistema: 5");
  });

  it("shows guardian loading state when no guardian loaded", () => {
    mount(MatriculaDetailModal, {
      props: {
        open: true,
        matricula: { idEstudiante: 5, idAcudiente: 3 },
      },
      attachTo: document.body,
    });
    expect(bodyText()).toContain("Cargando datos del acudiente");
  });

  it("renders observations section", () => {
    mount(MatriculaDetailModal, {
      props: { open: true, matricula: null },
      attachTo: document.body,
    });
    expect(bodyText()).toContain("Observaciones");
  });

  it("shows default message when no observations", () => {
    mount(MatriculaDetailModal, {
      props: {
        open: true,
        matricula: { informacionForm: {} },
      },
      attachTo: document.body,
    });
    expect(bodyText()).toContain("Sin observaciones registradas");
  });

  it("shows custom observations when provided", () => {
    mount(MatriculaDetailModal, {
      props: {
        open: true,
        matricula: {
          informacionForm: { observaciones_relevantes: "Alergia al polen" },
        },
      },
      attachTo: document.body,
    });
    expect(bodyText()).toContain("Alergia al polen");
  });

  it("does not render content when closed", () => {
    mount(MatriculaDetailModal, {
      props: { open: false, matricula: null },
      attachTo: document.body,
    });
    expect(bodyText()).not.toContain("Estudiante");
    expect(bodyText()).not.toContain("Observaciones");
  });

  it("renders close button in footer", () => {
    mount(MatriculaDetailModal, {
      props: { open: true, matricula: null },
      attachTo: document.body,
    });
    expect(bodyText()).toContain("Cerrar detalle");
  });

  it("handles matricula with null informacionForm", () => {
    mount(MatriculaDetailModal, {
      props: {
        open: true,
        matricula: { idEstudiante: 1, idAcudiente: 1, informacionForm: null },
      },
      attachTo: document.body,
    });
    expect(bodyText()).toContain("Sin observaciones registradas");
  });

  it("handles long observation text", () => {
    const longText = "X".repeat(1000);
    mount(MatriculaDetailModal, {
      props: {
        open: true,
        matricula: {
          informacionForm: { observaciones_relevantes: longText },
        },
      },
      attachTo: document.body,
    });
    expect(bodyText()).toContain(longText);
  });
});
