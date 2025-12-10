import { FC } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useAppDispatch } from "../store/hooks";
import { addToCart, useCartItemCount } from "../store/slices/cartSlice";
import { Gas } from "../store/slices/gasSlice";
import "./GasCard.css";
import { getDestRoot } from "../../target_config";

// Получаем базовый путь для правильного формирования путей
const getDefaultImage = () => {
  const destRoot = getDestRoot();
  if (destRoot === '') {
    return '/slide1.svg';
  }
  const base = destRoot.endsWith('/') ? destRoot : destRoot + '/';
  return base + 'slide1.svg';
};

<<<<<<< HEAD
=======
export interface Gas {
  id: number;
  title: string;
  formula: string;
  molar_mass: number;
  image_url?: string | null;
  description?: string;
}

>>>>>>> adaptive-deployment
interface GasCardProps {
  gas: Gas;
  onCardClick: (id: number) => void;
}

export const GasCard: FC<GasCardProps> = ({ gas, onCardClick }) => {
  const dispatch = useAppDispatch();
  const cartCount = useCartItemCount(gas.id);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Логируем ошибку для отладки
    console.warn(`Failed to load image: ${target.src}, falling back to default image`);
    const defaultImagePath = getDefaultImage();
    if (target.src !== defaultImagePath && !target.src.includes('slide1.svg')) {
      target.src = defaultImagePath;
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
              src={gas.image_url || getDefaultImage()}
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