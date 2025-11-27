import { FC, useState } from "react";
import "./HomePage.css";
import { getDestRoot } from "../../target_config";

const introVideoSrc =
  "https://cdn.pixabay.com/video/2020/08/05/46818-447229696_large.mp4";

export const HomePage: FC = () => {
  const [videoError, setVideoError] = useState(false);
  const destRoot = getDestRoot();

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-video">
          {!videoError ? (
            <video
              className="intro-video"
              src={introVideoSrc}
              playsInline
              autoPlay
              loop
              muted
              poster={`${destRoot}/slide1.svg`}
              onError={handleVideoError}
            />
          ) : (
            <div className="video-fallback">
              <img 
                src={`${destRoot}/slide1.svg`} 
                alt="Gase Project" 
                className="fallback-image"
              />
              <div className="fallback-content">
                <h1>Gase Project</h1>
                <p>Система управления газами с Redux, PWA и Tauri</p>
                <div className="features">
                  <div className="feature">🧪 Каталог газов</div>
                  <div className="feature">🔍 Умная фильтрация</div>
                  <div className="feature">📱 PWA поддержка</div>
                  <div className="feature">🖥️ Tauri приложение</div>
                </div>
              </div>
            </div>
          )}
          <div className="video-overlay" />
        </div>
      </section>
    </div>
  );
};
