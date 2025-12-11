import { useEffect } from "react";
import { useAppDispatch } from "./useTypedRedux";
import { setCartCount } from "../slices/cartSlice";

/**
 * Хук для инициализации журнала расчетов
 * Устанавливает счетчик в 0 (метод добавления в журнал еще не реализован)
 */
export const useCartData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Инициализируем счетчик журнала расчетов как 0
    // Метод добавления в журнал будет реализован позже
    dispatch(setCartCount({ count: 0 }));
  }, [dispatch]);
};

