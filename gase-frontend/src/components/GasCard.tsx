import { FC } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useAppDispatch } from "../store/hooks";
import { addToCart, useCartItemCount } from "../store/slices/cartSlice";
import { Gas } from "../store/slices/gasSlice";
import "./GasCard.css";
import defaultImage from "/DefaultImage.svg";

interface GasCardProps {
  gas: Gas;
  onCardClick: (id: number) => void;
}

export const GasCard: FC<GasCardProps> = ({ gas, onCardClick }) => {
  const dispatch = useAppDispatch();
  const cartCount = useCartItemCount(gas.id);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== defaultImage) {
      target.src = defaultImage;
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart(gas));
  };

  return (
    <Card className="gas-card">
      <Card.Img
        className="card-image"
        variant="top"
        src={gas.image_url || defaultImage}
        alt={gas.title}
        onClick={() => onCardClick(gas.id)}
        onError={handleImageError}
        style={{ cursor: "pointer" }}
      />
      <Card.Body>
        <div className="text-style">
          <Card.Title>{gas.title}</Card.Title>
        </div>
        <div className="text-style">
          <Card.Text>
            <strong>Формула:</strong> {gas.formula}
          </Card.Text>
        </div>
        <div className="text-style">
          <Card.Text>
            <strong>Молярная масса:</strong> {gas.molar_mass.toFixed(2)} г/моль
          </Card.Text>
        </div>
        {gas.description && (
          <div className="text-style description">
            <Card.Text>{gas.description}</Card.Text>
          </div>
        )}
        <div className="d-flex gap-2">
          <Button
            className="card-button flex-grow-1"
            variant="primary"
            onClick={() => onCardClick(gas.id)}
          >
            Подробнее
          </Button>
          <Button
            variant="success"
            onClick={handleAddToCart}
            className="position-relative"
          >
            ➕ В расчет
            {cartCount > 0 && (
              <Badge 
                bg="danger" 
                pill 
                className="position-absolute top-0 start-100 translate-middle"
              >
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};