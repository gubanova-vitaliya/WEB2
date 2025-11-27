import { FC } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { useCartTotalItems, toggleCartVisibility } from "../store/slices/cartSlice";
import { useAppDispatch } from "../store/hooks";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import "./Navbar.css";

export const AppNavbar: FC = () => {
  const dispatch = useAppDispatch();
  const cartTotalItems = useCartTotalItems();

  const handleCartToggle = () => {
    dispatch(toggleCartVisibility());
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="app-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to={ROUTES.HOME}>
          GasProject
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={ROUTES.HOME}>
              {ROUTE_LABELS.HOME}
            </Nav.Link>
            <Nav.Link as={Link} to={ROUTES.GASES}>
              {ROUTE_LABELS.GASES}
            </Nav.Link>
          </Nav>
          <Nav>
            <Button
              variant="outline-light"
              onClick={handleCartToggle}
              className="position-relative"
            >
              📋 Журнал расчетов
              {cartTotalItems > 0 && (
                <Badge 
                  bg="danger" 
                  pill 
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cartTotalItems}
                </Badge>
              )}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
