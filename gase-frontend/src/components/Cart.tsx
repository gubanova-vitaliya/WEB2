import { FC } from "react";
import { Offcanvas, Button, ListGroup, Badge, Row, Col } from "react-bootstrap";
import { useAppDispatch } from "../store/hooks";
import { 
  useCartItems, 
  useCartVisibility, 
  setCartVisibility, 
  removeFromCart, 
  updateQuantity,
  clearCart 
} from "../store/slices/cartSlice";

export const Cart: FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useCartItems();
  const isVisible = useCartVisibility();

  const handleClose = () => {
    dispatch(setCartVisibility(false));
  };

  const handleRemoveItem = (gasId: number) => {
    dispatch(removeFromCart(gasId));
  };

  const handleUpdateQuantity = (gasId: number, quantity: number) => {
    dispatch(updateQuantity({ gasId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Offcanvas show={isVisible} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          📋 Журнал расчетов
          {totalItems > 0 && (
            <Badge bg="primary" className="ms-2">
              {totalItems}
            </Badge>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cartItems.length === 0 ? (
          <div className="text-center text-muted">
            <p>Журнал расчетов пуст</p>
            <p>Добавьте газы из каталога для начала расчетов</p>
          </div>
        ) : (
          <>
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.gas.id} className="px-0">
                  <Row className="align-items-center">
                    <Col xs={8}>
                      <h6 className="mb-1">{item.gas.title}</h6>
                      <small className="text-muted">
                        {item.gas.formula} • {item.gas.molar_mass.toFixed(2)} г/моль
                      </small>
                    </Col>
                    <Col xs={4} className="text-end">
                      <div className="d-flex align-items-center justify-content-end gap-1">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => handleUpdateQuantity(item.gas.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Badge bg="secondary" className="px-2">
                          {item.quantity}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => handleUpdateQuantity(item.gas.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleRemoveItem(item.gas.id)}
                          className="ms-1"
                        >
                          🗑️
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            
            <div className="mt-3 d-grid gap-2">
              <Button variant="success" size="lg">
                ⚡ Рассчитать все газы ({totalItems})
              </Button>
              <Button variant="outline-danger" onClick={handleClearCart}>
                🗑️ Очистить журнал
              </Button>
            </div>
            
            <div className="mt-3 text-muted small">
              <p className="mb-1">💡 Подсказка:</p>
              <p className="mb-0">
                Добавьте параметры для каждого газа и нажмите "Рассчитать" 
                для получения результатов расчета давления.
              </p>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

