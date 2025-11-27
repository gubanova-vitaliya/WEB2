import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getGases, getGasById, GasFilters } from "../../modules/gasApi";

export interface Gas {
  id: number;
  title: string;
  formula: string;
  molar_mass: number;
  image_url?: string;
  description?: string;
}

interface GasState {
  gases: Gas[];
  selectedGas: Gas | null;
  loading: boolean;
  error: string | null;
  searchFilters: GasFilters;
}

const initialState: GasState = {
  gases: [],
  selectedGas: null,
  loading: false,
  error: null,
  searchFilters: {}
};

// Async thunks для API вызовов
export const fetchGases = createAsyncThunk(
  'gas/fetchGases',
  async (filters?: GasFilters) => {
    const response = await getGases(filters);
    return response;
  }
);

export const fetchGasById = createAsyncThunk(
  'gas/fetchGasById',
  async (id: number) => {
    const response = await getGasById(id);
    return response;
  }
);

const gasSlice = createSlice({
  name: "gas",
  initialState,
  reducers: {
    setSearchFilters(state, action: PayloadAction<GasFilters>) {
      state.searchFilters = action.payload;
    },
    clearSelectedGas(state) {
      state.selectedGas = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchGases
      .addCase(fetchGases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGases.fulfilled, (state, action) => {
        state.loading = false;
        state.gases = action.payload;
      })
      .addCase(fetchGases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch gases';
      })
      // fetchGasById
      .addCase(fetchGasById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGasById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGas = action.payload;
      })
      .addCase(fetchGasById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch gas';
      });
  }
});

// Selectors
export const useGases = () =>
  useSelector((state: RootState) => state.gas.gases);

export const useSelectedGas = () =>
  useSelector((state: RootState) => state.gas.selectedGas);

export const useGasLoading = () =>
  useSelector((state: RootState) => state.gas.loading);

export const useGasError = () =>
  useSelector((state: RootState) => state.gas.error);

export const useSearchFilters = () =>
  useSelector((state: RootState) => state.gas.searchFilters);

export const {
  setSearchFilters,
  clearSelectedGas,
  clearError
} = gasSlice.actions;

export default gasSlice.reducer;

