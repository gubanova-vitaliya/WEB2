import "./GasesPage.css";
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

  return (
    <>
      <Container fluid className="gases-page">
        <div className="page-header">
          <h1>{ROUTE_LABELS.GASES}</h1>
        </div>

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
  );
};
