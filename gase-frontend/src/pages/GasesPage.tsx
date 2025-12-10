import "./GasesPage.css";
<<<<<<< HEAD
import { FC, useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { 
  fetchGases, 
  useGases, 
  useGasLoading, 
  useGasError,
  setSearchFilters,
  useSearchFilters
} from "../store/slices/gasSlice";
import { GasCard } from "../components/GasCard";
import { Cart } from "../components/Cart";
import { ROUTES, ROUTE_LABELS } from "../Routes";

export const GasesPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const gases = useGases();
  const loading = useGasLoading();
  const error = useGasError();
  const searchFilters = useSearchFilters();
  
  const [searchValue, setSearchValue] = useState(searchFilters.search || "");

  useEffect(() => {
    // Загружаем газы при первом рендере
    dispatch(fetchGases(searchFilters));
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = searchValue ? { search: searchValue } : {};
    dispatch(setSearchFilters(filters));
    dispatch(fetchGases(filters));
  };

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.GASES}/${id}`);
  };
=======
import { FC, useState } from "react";
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
import { CartModal } from "../components/CartModal";
import { GasCardItem } from "../components/GasCardItem";
import { Gas } from "../components/GasCard";

export const GasesPage: FC = () => {
  const [showCartModal, setShowCartModal] = useState(false);

  // Redux селекторы
  const gases = useFilteredGases(); // Используем отфильтрованные газы
  const allGases = useAllGases(); // Все газы для подсчета
  const filters = useGasFilters(); // Текущие фильтры
  const loading = useGasLoading();
  const error = useGasError();
  const cartCount = useCartTotalItems();
  
  // Проверяем, активны ли фильтры
  const hasActiveFilters = filters.minMolarMass !== undefined || filters.maxMolarMass !== undefined;

  // Загрузка данных через хук
  useGasData();
>>>>>>> adaptive-deployment

  return (
    <>
      <Container fluid className="gases-page">
        <div className="page-header">
          <h1>{ROUTE_LABELS.GASES}</h1>
<<<<<<< HEAD
=======
        <button
          type="button"
          className={`cart-link ${cartCount > 0 ? "active" : "inactive"}`}
          onClick={() => setShowCartModal(true)}
        >
          <span className="cart-icon">📋</span>
          Журнал расчетов
          <span className="cart-count">{cartCount}</span>
        </button>
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
>>>>>>> adaptive-deployment
        </div>

<<<<<<< HEAD
        <Form className="search-form" onSubmit={handleSearch}>
          <Row className="g-2">
            <Col>
              <Form.Control
                type="text"
                placeholder="Поиск газа по названию или формуле..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit" variant="primary">
                🔍 Поиск
              </Button>
            </Col>
          </Row>
        </Form>

        {loading && (
          <div className="loading-bg">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Ошибка:</strong> {error}
          </div>
        )}

        {!loading && !error && gases.length === 0 && (
          <div className="no-results">
            <h3>Газы не найдены</h3>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        )}

        {!loading && gases.length > 0 && (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {gases.map((gas) => (
              <Col key={gas.id}>
                <GasCard gas={gas} onCardClick={handleCardClick} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
      
      <Cart />
    </>
=======
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

      <CartModal 
        show={showCartModal} 
        onHide={() => setShowCartModal(false)} 
      />
    </div>
>>>>>>> adaptive-deployment
  );
};
