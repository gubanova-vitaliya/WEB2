import { FC } from "react";
import { Carousel } from "react-bootstrap";
import "./HomePage.css";

export const HomePage: FC = () => {
  const slides = [
    {
      id: 1,
      src: "/carousel-1.svg",
      alt: "Каталог Газов",
      title: "Каталог Газов"
    },
    {
      id: 2,
      src: "/carousel-2.svg",
      alt: "Промышленные Газы",
      title: "Промышленные Газы"
    },
    {
      id: 3,
      src: "/carousel-3.svg",
      alt: "Научные Расчеты",
      title: "Научные Расчеты"
    }
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="carousel-container">
          <Carousel fade interval={4000} pause="hover" className="custom-carousel">
            {slides.map((slide) => (
              <Carousel.Item key={slide.id}>
                <div className="carousel-image-wrapper">
                  <img
                    className="carousel-image"
                    src={slide.src}
                    alt={slide.alt}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </section>
    </div>
  );
};
