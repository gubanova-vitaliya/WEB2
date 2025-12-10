import "./GasesPage.css";
import { FC } from "react";
import { Spinner } from "react-bootstrap";
import { ROUTE_LABELS } from "../Routes";
import { useGasData } from "../hooks/useGasData";
import {
  useFilteredGases,
  useGasLoading,
  useGasError,
  useAllGases,
  useGasFilters,
} from "../slices/gasSlice";
import { GasFilters } from "../components/GasFilters";
import { GasCardItem } from "../components/GasCardItem";
import { Gas } from "../slices/gasSlice";

export const GasesPage: FC = () => {
  // Redux селекторы
  const gases = useFilteredGases(); // Используем отфильтрованные газы
  const allGases = useAllGases(); // Все газы для подсчета
  const filters = useGasFilters(); // Текущие фильтры
  const loading = useGasLoading();
  const error = useGasError();
  
  // Проверяем, активны ли фильтры
  const hasActiveFilters = filters.minMolarMass !== undefined || filters.maxMolarMass !== undefined;

  // Загрузка данных через хук
  useGasData();

  const foundResults = gases.length;
  const totalResults = allGases.length;

  return (
    <div className="gases-page">
      <div className="page-header">
        <h1>{ROUTE_LABELS.GASES}</h1>
      </div>

      <GasFilters />

      {loading && (
        <div className="loading-bg">
          <Spinner animation="border" />
        </div>
      )}

      {error && (
        <div className="error-message">
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="results-info">
          {hasActiveFilters ? (
            <p>Найдено {foundResults} из {totalResults} газов</p>
          ) : (
            <p>Всего газов: {totalResults}</p>
          )}
        </div>
      )}

      {!loading && !error && gases.length === 0 && (
        <div className="no-results">
          <h3>Газы не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {!loading && !error && gases.length > 0 && (
        <div className="grid">
          {gases.map((gas: Gas) => (
            <GasCardItem key={gas.id} gas={gas} />
          ))}
        </div>
      )}
    </div>
  );
};

