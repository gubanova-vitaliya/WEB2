import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Тип для данных (можно расширить под ваши нужды)
export interface DataItem {
  id: number;
  [key: string]: any;
}

// Тип для начального состояния
interface DataState {
  Data: DataItem[];
}

// Начальное состояние
const initialState: DataState = {
  Data: []
};

// Создание слайса
const dataSlice = createSlice({
  name: "data",
  initialState,
  // Редьюсеры в слайсах мутируют состояние и ничего не возвращают наружу
  reducers: {
    setData(state, action: PayloadAction<DataItem[]>) {
      state.Data = action.payload;
    },
    // Можно добавить дополнительные редьюсеры
    addDataItem(state, action: PayloadAction<DataItem>) {
      state.Data.push(action.payload);
    },
    removeDataItem(state, action: PayloadAction<number>) {
      state.Data = state.Data.filter(item => item.id !== action.payload);
    },
    clearData(state) {
      state.Data = [];
    }
  }
});

// Экспорт действий (actions)
export const {
  setData: setDataAction,
  addDataItem: addDataItemAction,
  removeDataItem: removeDataItemAction,
  clearData: clearDataAction
} = dataSlice.actions;

// Пользовательский хук для получения данных из хранилища
// Используйте useAppSelector из hooks/useTypedRedux.ts для типизированного доступа
// Пример:
// import { useAppSelector } from '../hooks/useTypedRedux';
// const data = useAppSelector(state => state.ourData.Data);

// Экспорт редьюсера
export default dataSlice.reducer;

