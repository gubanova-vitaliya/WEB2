import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "../hooks/useTypedRedux";
import { Gas } from "../components/GasCard";

interface GasState {
  gases: Gas[];
  filteredGases: Gas[];
  loading: boolean;
  error: string | null;
  searchFilter: string;
}

const initialState: GasState = {
  gases: [],
  filteredGases: [],
  loading: false,
  error: null,
  searchFilter: "",
};

const gasSlice = createSlice({
  name: "gas",
  initialState,
  reducers: {
    setGases(state, action: PayloadAction<Gas[]>) {
      state.gases = action.payload;
      state.filteredGases = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSearchFilter(state, action: PayloadAction<string>) {
      state.searchFilter = action.payload;
      const searchLower = action.payload.toLowerCase();
      if (searchLower === "") {
        state.filteredGases = state.gases;
      } else {
        state.filteredGases = state.gases.filter(
          (gas) =>
            gas.title.toLowerCase().includes(searchLower) ||
            gas.formula.toLowerCase().includes(searchLower)
        );
      }
    },
  },
});

export const { setGases, setLoading, setError, setSearchFilter } = gasSlice.actions;

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

export default gasSlice.reducer;

