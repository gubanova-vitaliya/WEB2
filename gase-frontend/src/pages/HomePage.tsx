import { FC } from "react";
import "./HomePage.css";
import { getDestRoot } from "../../target_config";

export const HomePage: FC = () => {
  const destRoot = getDestRoot();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-image">
          <img 
            src={`${destRoot}/slide1.svg`} 
            alt="Gase Project" 
            className="main-image"
          />
        </div>
      </section>
    </div>
  );
};
