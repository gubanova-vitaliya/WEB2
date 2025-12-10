import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "../hooks/useTypedRedux";
import { Gas } from "../components/GasCard";

// Интерфейс для фильтров
export interface GasFilters {
  minMolarMass?: number;
  maxMolarMass?: number;
}

interface GasState {
  gases: Gas[];
  filteredGases: Gas[];
  loading: boolean;
  error: string | null;
  filters: GasFilters;
}

const initialState: GasState = {
  gases: [],
  filteredGases: [],
  loading: false,
  error: null,
  filters: {
    minMolarMass: undefined,
    maxMolarMass: undefined,
  },
};

const gasSlice = createSlice({
  name: "gas",
  initialState,
  reducers: {
    setGases(state, action: PayloadAction<Gas[]>) {
      state.gases = action.payload;
      // Применяем текущие фильтры к новым данным
      applyFilters(state);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    // Установка всех фильтров
    setFilters(state, action: PayloadAction<Partial<GasFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      // Применяем фильтры
      applyFilters(state);
    },
    // Сброс всех фильтров
    clearFilters(state) {
      state.filters = {
        minMolarMass: undefined,
        maxMolarMass: undefined,
      };
      state.filteredGases = state.gases;
    },
  },
});

// Вспомогательная функция для применения фильтров
function applyFilters(state: GasState) {
  const { minMolarMass, maxMolarMass } = state.filters;
  
  // Фильтруем газы по молярной массе
  let filtered = state.gases.filter((gas) => {
    // Фильтр по молярной массе с валидацией
    const matchesMinMass = minMolarMass === undefined || isNaN(minMolarMass) || gas.molar_mass >= minMolarMass;
    const matchesMaxMass = maxMolarMass === undefined || isNaN(maxMolarMass) || gas.molar_mass <= maxMolarMass;
    
    // Проверяем, что min не больше max (если оба заданы)
    const isValidRange = 
      minMolarMass === undefined || 
      maxMolarMass === undefined || 
      isNaN(minMolarMass) || 
      isNaN(maxMolarMass) || 
      minMolarMass <= maxMolarMass;
    
    return matchesMinMass && matchesMaxMass && isValidRange;
  });
  
  // Сортируем отфильтрованные газы по молярной массе (по возрастанию)
  filtered.sort((a, b) => a.molar_mass - b.molar_mass);
  
  state.filteredGases = filtered;
}

export const { 
  setGases, 
  setLoading, 
  setError, 
  setFilters,
  clearFilters
} = gasSlice.actions;

// Селекторы
export const useFilteredGases = () => {
  return useAppSelector((state: any) => state.gas?.filteredGases || []);
};

export const useGasLoading = () => {
  return useAppSelector((state: any) => state.gas?.loading || false);
};

export const useGasError = () => {
  return useAppSelector((state: any) => state.gas?.error || null);
};

// Селектор для получения текущих фильтров
export const useGasFilters = () => {
  return useAppSelector((state: any) => state.gas?.filters || { minMolarMass: undefined, maxMolarMass: undefined });
};

// Селектор для получения всех газов (без фильтров)
export const useAllGases = () => {
  return useAppSelector((state: any) => state.gas?.gases || []);
};

export default gasSlice.reducer;

