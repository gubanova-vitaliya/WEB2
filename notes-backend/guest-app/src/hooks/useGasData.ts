import { useEffect } from "react";
import { useAppDispatch } from "./useTypedRedux";
import { setGases, setLoading, setError } from "../slices/gasSlice";
import { getGases } from "../modules/gasApi";

export const useGasData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadGases = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      try {
        // getGases всегда возвращает данные (либо с API, либо mock)
        const gases = await getGases();
        dispatch(setGases(gases));
        dispatch(setError(null));
      } catch (error: any) {
        console.error("Unexpected error in useGasData:", error);
        dispatch(setError(null)); // Не показываем ошибку, так как mock данные должны быть доступны
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadGases();
  }, [dispatch]);
};




