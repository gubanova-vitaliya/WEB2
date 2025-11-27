import "./GasesPage.css";
import { FC, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ROUTE_LABELS } from "../Routes";
import { useGasData } from "../hooks/useGasData";
import {
  useFilteredGases,
  useGasLoading,
  useGasError,
} from "../slices/gasSlice";
import { GasFilters } from "../components/GasFilters";
import { useCartTotalItems } from "../slices/cartSlice";
import { CartModal } from "../components/CartModal";
import { GasCardItem } from "../components/GasCardItem";

export const GasesPage: FC = () => {
  const [showCartModal, setShowCartModal] = useState(false);

  // Redux селекторы
  const gases = useFilteredGases(); // Используем отфильтрованные газы
  const loading = useGasLoading();
  const error = useGasError();
  const cartCount = useCartTotalItems();

  // Загрузка данных через хук
  useGasData();

  return (
    <div className="gases-page">
      <div className="page-header">
          <h1>{ROUTE_LABELS.GASES}</h1>
        <a
          href="#"
          className={`cart-link ${cartCount > 0 ? "active" : "inactive"}`}
          onClick={(e) => {
            e.preventDefault();
            setShowCartModal(true);
          }}
        >
          <span className="cart-icon">📋</span>
          Журнал расчетов
          <span className="cart-count">{cartCount}</span>
        </a>
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

      {!loading && !error && gases.length === 0 && (
        <div className="no-results">
          <h3>Газы не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {!loading && !error && gases.length > 0 && (
        <div className="grid">
          {gases.map((gas) => (
            <GasCardItem key={gas.id} gas={gas} />
          ))}
        </div>
      )}

      <CartModal 
        show={showCartModal} 
        onHide={() => setShowCartModal(false)} 
      />
    </div>
  );
};
