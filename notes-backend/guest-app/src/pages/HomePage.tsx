import { FC, useState, useEffect } from "react";
import "./HomePage.css";
import { getDestRoot } from "../../target_config";

export const HomePage: FC = () => {
  const destRoot = getDestRoot();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Вспомогательная функция для правильного формирования путей
  // В Vite статические файлы из public доступны через корневой путь
  const getImagePath = (imageName: string) => {
    // Vite автоматически обслуживает файлы из public через корневой путь
    // В dev режиме: http://localhost:3002/slide1.svg
    // В production: /slide1.svg (файлы копируются в dist)
    return '/' + imageName;
  };

  // Версия для обхода кеша (измените при обновлении изображений)
  const IMAGE_VERSION = 'v2';

  const carouselItems = [
    {
      src: `${getImagePath('slide1.svg')}?v=${IMAGE_VERSION}`,
      alt: "Каталог Газов",
      title: "Каталог Газов",
      description: "Молекулы H₂, O₂, N₂"
    },
    {
      src: `${getImagePath('slide2.svg')}?v=${IMAGE_VERSION}`,
      alt: "Промышленные Газы",
      title: "Промышленные Газы",
      description: "Газовые баллоны"
    },
    {
      src: `${getImagePath('slide3.svg')}?v=${IMAGE_VERSION}`,
      alt: "Научные Расчеты",
      title: "Научные Расчеты",
      description: "Точные расчеты молярных масс"
    }
  ];

  // Отладочная информация
  useEffect(() => {
    console.log('Carousel items paths:', carouselItems.map(item => item.src));
    console.log('destRoot:', destRoot);
    console.log('Window location:', window.location.href);
    
    // Проверка доступности изображений
    carouselItems.forEach((item, index) => {
      const img = new Image();
      img.onload = () => console.log(`✅ Image ${index + 1} loaded: ${item.src}`);
      img.onerror = () => console.error(`❌ Image ${index + 1} failed to load: ${item.src}`);
      img.src = item.src;
    });
  }, []);

  // Автоматическая смена слайдов
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000); // Смена каждые 5 секунд

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="carousel-container">
          <div className="carousel-wrapper">
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <img 
                  src={item.src} 
                  alt={item.alt} 
                  className="carousel-image"
                  onError={(e) => {
                    // Fallback на slide1.svg если carousel изображение не найдено
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('slide1.svg')) {
                      target.src = getImagePath('slide1.svg');
                    }
                  }}
                />
                <div className="carousel-content">
                  <h2 className="carousel-title">{item.title}</h2>
                  <p className="carousel-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Кнопки навигации */}
          <button 
            className="carousel-button carousel-button-prev" 
            onClick={goToPrevious}
            aria-label="Предыдущий слайд"
          >
            ‹
          </button>
          <button 
            className="carousel-button carousel-button-next" 
            onClick={goToNext}
            aria-label="Следующий слайд"
          >
            ›
          </button>

          {/* Индикаторы */}
          <div className="carousel-indicators">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

