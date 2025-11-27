import React from 'react';
import { Link } from 'react-router-dom';

export function GuestHomePage() {
    return (
        <div className="guest-home">
            <div className="hero-section">
                <div className="container">
                    <h1>Добро пожаловать в Планировщик задач</h1>
                    <p className="hero-description">
                        Современное приложение для управления задачами с красивым интерфейсом 
                        и мощными возможностями фильтрации.
                    </p>
                    
                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📝</div>
                            <h3>Управление задачами</h3>
                            <p>Создавайте, редактируйте и отслеживайте свои задачи</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3>Умный поиск</h3>
                            <p>Быстро находите нужные задачи с помощью поиска и фильтров</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Адаптивный дизайн</h3>
                            <p>Работает на всех устройствах - от телефона до компьютера</p>
                        </div>
                    </div>
                    
                    <div className="cta-buttons">
                        <Link to="/guest/tasks" className="button button-success text-lg">
                            Просмотреть задачи
                        </Link>
                        <Link to="/guest/gallery" className="button button-info text-lg">
                            Галерея
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
