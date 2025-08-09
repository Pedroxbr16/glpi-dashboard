import create from 'zustand';

export const useFilters = create((set) => ({
  status: '',
  technicianId: '',
  categoryId: '',
  dateFrom: '',
  dateTo: '',
  page: 1,
  perPage: 50,
  
  // Atualiza os filtros
  set: (filters) => set((state) => ({
    ...state,
    ...filters
  })),
  
  // Reseta todos os filtros
  reset: () => set(() => ({
    status: '',
    technicianId: '',
    categoryId: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    perPage: 50,
  }))
}));
