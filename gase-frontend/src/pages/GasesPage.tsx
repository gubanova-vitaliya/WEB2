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
import { useCartTotalItems } from "../slices/cartSlice";
import { GasCardItem } from "../components/GasCardItem";
import { Gas } from "../components/GasCard";
import { useCartData } from "../hooks/useCartData";

export const GasesPage: FC = () => {
  // Redux селекторы
  const gases = useFilteredGases(); // Используем отфильтрованные газы
  const allGases = useAllGases(); // Все газы для подсчета
  const filters = useGasFilters(); // Текущие фильтры
  const loading = useGasLoading();
  const error = useGasError();
  const cartCount = useCartTotalItems();
  
  // Проверяем, активны ли фильтры
  const hasActiveFilters = filters.minMolarMass !== undefined || filters.maxMolarMass !== undefined;

  // Загрузка данных через хуки
  useGasData();
  useCartData(); // Загружаем количество элементов в журнале расчетов

  return (
    <div className="gases-page">
      <div className="page-header">
          <h1>{ROUTE_LABELS.GASES}</h1>
        <div
          className={`cart-link ${cartCount > 0 ? "active" : "inactive"}`}
        >
          <span className="cart-icon">📋</span>
          Журнал расчетов
          <span className="cart-count">{cartCount}</span>
        </div>
      </div>

      <GasFilters />

      {/* Информация о результатах фильтрации */}
      {!loading && !error && hasActiveFilters && (
        <div className="filter-results-info">
          <span className="results-count">
            Найдено: <strong>{gases.length}</strong> из <strong>{allGases.length}</strong> газов
          </span>
        </div>
      )}

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

      {!loading && !error && gases.length === 0 && (
        <div className="no-results">
          <h3>Газы не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {!loading && !error && gases.length > 0 && (
        <div className={`grid ${hasActiveFilters ? 'filtered' : ''}`}>
          {gases.map((gas: Gas) => (
            <GasCardItem key={gas.id} gas={gas} />
          ))}
        </div>
      )}
    </div>
  );
};
