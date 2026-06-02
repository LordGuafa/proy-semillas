import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FormFieldReadonly from "@/components/matriculas/FormFieldReadonly.vue";

describe("FormFieldReadonly", () => {
  it("renders label correctly", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Nombre completo", value: "Juan Pérez", type: "text" },
    });
    expect(wrapper.text()).toContain("Nombre completo");
    expect(wrapper.text()).toContain("Juan Pérez");
  });

  it("renders '—' for null value (non-boolean)", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Campo", value: null, type: "text" },
    });
    expect(wrapper.text()).toContain("—");
  });

  it("renders '—' for undefined value (non-boolean)", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Campo", value: undefined, type: "text" },
    });
    expect(wrapper.text()).toContain("—");
  });

  it("renders '—' for empty string value (non-boolean)", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Campo", value: "", type: "text" },
    });
    expect(wrapper.text()).toContain("—");
  });

  it("renders check icon for boolean true", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Activo", value: true, type: "boolean" },
    });
    expect(wrapper.text()).toContain("Sí");
  });

  it("renders X icon for boolean false", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Activo", value: false, type: "boolean" },
    });
    expect(wrapper.text()).toContain("No");
  });

  it("treats null boolean as false", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Activo", value: null, type: "boolean" },
    });
    expect(wrapper.text()).toContain("No");
  });

  it("formats date values", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Fecha", value: "2026-01-15T10:00:00Z", type: "date" },
    });
    expect(wrapper.text()).toContain("2026");
  });

  it("renders '—' for invalid date", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Fecha", value: "not-a-date", type: "date" },
    });
    expect(wrapper.text()).toContain("—");
  });

  it("renders '—' for null date", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Fecha", value: null, type: "date" },
    });
    expect(wrapper.text()).toContain("—");
  });

  it("converts number values to string", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Edad", value: 7, type: "text" },
    });
    expect(wrapper.text()).toContain("7");
  });

  it("converts zero value correctly", () => {
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Estrato", value: 0, type: "text" },
    });
    expect(wrapper.text()).toContain("0");
  });

  it("renders long text without overflow", () => {
    const longText = "A".repeat(500);
    const wrapper = mount(FormFieldReadonly, {
      props: { label: "Observaciones", value: longText, type: "text" },
    });
    expect(wrapper.text()).toContain(longText);
  });
});
