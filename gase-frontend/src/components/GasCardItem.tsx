import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { GasCard } from "./GasCard";
import { Gas } from "../store/slices/gasSlice";

interface GasCardItemProps {
  gas: Gas;
}

export const GasCardItem: FC<GasCardItemProps> = ({ gas }) => {
  const navigate = useNavigate();

  const handleCardClick = (id: number) => {
    navigate(`/gases/${id}`);
  };

  return <GasCard gas={gas} onCardClick={handleCardClick} />;
};

