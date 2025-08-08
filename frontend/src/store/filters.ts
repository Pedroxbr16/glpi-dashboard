import { create } from "zustand";

export type Filters = {
  status: string;          // "1,2,3"
  technicianId?: string;
  categoryId?: string;
  source?: string;
  dateFrom?: string;       // "YYYY-MM-DD"
  dateTo?: string;
  page: number;
  perPage: number;
  set: (patch: Partial<Filters>) => void;
  reset: () => void;
};

const initial: Omit<Filters, "set"|"reset"> = {
  status: "",
  technicianId: "",
  categoryId: "",
  source: "",
  dateFrom: "",
  dateTo: "",
  page: 1,
  perPage: 25
};

export const useFilters = create<Filters>((set) => ({
  ...initial,
  set: (patch) => set((s) => ({ ...s, ...patch })),
  reset: () => set({ ...initial })
}));
