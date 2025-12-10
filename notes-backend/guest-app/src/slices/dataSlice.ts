import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gas } from "./gasSlice";

// Тип для начального состояния
interface GasCalculationState {
  Gases: Gas[];
  CalculationTotal: number; // Общая молярная масса для расчетов
}

// Начальное состояние
const initialState: GasCalculationState = {
  Gases: [
    {
      id: 1,
      title: "Водород",
      formula: "H₂",
      molar_mass: 2.016,
      description: "Самый легкий химический элемент, бесцветный газ без запаха и вкуса."
    },
    {
      id: 2,
      title: "Кислород",
      formula: "O₂",
      molar_mass: 32.0,
      description: "Жизненно важный газ, необходимый для дыхания большинства живых организмов."
    }
  ],
  CalculationTotal: 0, // Начальная общая молярная масса для расчетов
};

// Создание слайса
const gasCalculationSlice = createSlice({
  name: "gasCalculation",
  initialState,
  reducers: {
    // Изменяем состояние на полученные данные газов
    setGases(state, action: PayloadAction<Gas[]>) {
      state.Gases = action.payload;
    },
    // Суммируем молярные массы выбранных газов для расчетов
    addToCalculation(state, action: PayloadAction<number>) {
      state.CalculationTotal += action.payload;
    },
    // Обнуляем общую молярную массу расчетов
    clearCalculation(state) {
      state.CalculationTotal = 0;
    },
    // Дополнительные редьюсеры
    addGas(state, action: PayloadAction<Gas>) {
      state.Gases.push(action.payload);
    },
    removeGas(state, action: PayloadAction<number>) {
      state.Gases = state.Gases.filter((gas: Gas) => gas.id !== action.payload);
    },
    clearGases(state) {
      state.Gases = [];
    }
  }
});

// Экспорт действий (actions)
export const {
  setGases: setGasesAction,
  addToCalculation: addToCalculationAction,
  clearCalculation: clearCalculationAction,
  addGas: addGasAction,
  removeGas: removeGasAction,
  clearGases: clearGasesAction
} = gasCalculationSlice.actions;

// Экспорт редьюсера
export default gasCalculationSlice.reducer;

