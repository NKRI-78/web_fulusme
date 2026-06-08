import { useEffect, useState } from "react";

export interface JobStructureFormData {
  id: string;
  nama: string;
  jabatan: string;
  noKTP: string;
  fileKTP: string;
  fileNPWP: string;
}

export interface FormPenerbitState {
  laporanKeuangan: string;
  rekeningKoran: string;
  direktur: JobStructureFormData[];
  komisaris: JobStructureFormData[];
}

export const maxStructure = 3;

export function useFormPenerbit() {
  const [state, setState] = useState<FormPenerbitState>({
    laporanKeuangan: "",
    rekeningKoran: "",
    direktur: [],
    komisaris: [],
  });

  useEffect(() => {
    const draftStr = localStorage.getItem("formPenerbitDraft");
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        setState(draft);
      } catch {}
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("formPenerbitDraft", JSON.stringify(state));
    } catch {}
  }, [state]);

  const updateField = <K extends keyof FormPenerbitState>(
    key: K,
    value: FormPenerbitState[K],
  ) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateDirektur = (
    id: string,
    field: keyof JobStructureFormData,
    updated: string,
  ) => {
    setState((prev) => ({
      ...prev,
      direktur: prev.direktur.map((item) =>
        item.id === id ? { ...item, [field]: updated } : item,
      ),
    }));
  };

  const addDirektur = (newDirekturFromParam?: JobStructureFormData | null) => {
    if (state.direktur.length >= maxStructure) return;
    const newId = `${Date.now()}`;
    const newDirektur: JobStructureFormData = {
      id: newId,
      nama: "",
      jabatan: state.direktur.length === 0 ? "direktur-utama" : "direktur", // default value jabatan
      noKTP: "",
      fileKTP: "",
      fileNPWP: "",
    };
    setState((prev) => ({
      ...prev,
      direktur: [...prev.direktur, newDirekturFromParam ?? newDirektur],
    }));
  };

  const removeDirektur = (id: string) => {
    setState((prev) => ({
      ...prev,
      direktur: prev.direktur.filter((s) => s.id !== id),
    }));
  };

  const updateKomisaris = (
    id: string,
    field: keyof JobStructureFormData,
    updated: string,
  ) => {
    setState((prev) => ({
      ...prev,
      komisaris: prev.komisaris.map((item) =>
        item.id === id ? { ...item, [field]: updated } : item,
      ),
    }));
  };

  const addKomisaris = (
    newKomisarisFromParam?: JobStructureFormData | null,
  ) => {
    if (state.komisaris.length >= maxStructure) return;
    const newId = `${Date.now()}`;
    const newKomisaris: JobStructureFormData = {
      id: newId,
      nama: "",
      jabatan: state.komisaris.length === 0 ? "komisaris-utama" : "komisaris", // default value jabatan
      noKTP: "",
      fileKTP: "",
      fileNPWP: "",
    };
    setState((prev) => ({
      ...prev,
      komisaris: [...prev.komisaris, newKomisarisFromParam ?? newKomisaris],
    }));
  };

  const removeKomisaris = (id: string) => {
    setState((prev) => ({
      ...prev,
      komisaris: prev.komisaris.filter((s) => s.id !== id),
    }));
  };

  return {
    formState: state,
    updateField,
    updateDirektur,
    addDirektur,
    removeDirektur,
    updateKomisaris,
    addKomisaris,
    removeKomisaris,
  };
}
