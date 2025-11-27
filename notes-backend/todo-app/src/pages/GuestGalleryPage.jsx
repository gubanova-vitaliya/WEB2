import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function GuestGalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    // Демонстрационные изображения и категории
    const galleryItems = [
        {
            id: 1,
            title: 'Планирование проекта',
            category: 'work',
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
            description: 'Организация рабочих процессов'
        },
        {
            id: 2,
            title: 'Личные цели',
            category: 'personal',
            image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
            description: 'Достижение личных целей'
        },
        {
            id: 3,
            title: 'Командная работа',
            category: 'team',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
            description: 'Совместная работа над проектами'
        },
        {
            id: 4,
            title: 'Креативные задачи',
            category: 'creative',
            image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
            description: 'Творческие проекты и идеи'
        },
        {
            id: 5,
            title: 'Обучение',
            category: 'education',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
            description: 'Образовательные цели'
        },
        {
            id: 6,
            title: 'Спорт и здоровье',
            category: 'health',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            description: 'Здоровый образ жизни'
        }
    ];
    
    const categories = [
        { id: 'all', name: 'Все категории', count: galleryItems.length },
        { id: 'work', name: 'Работа', count: galleryItems.filter(item => item.category === 'work').length },
        { id: 'personal', name: 'Личное', count: galleryItems.filter(item => item.category === 'personal').length },
        { id: 'team', name: 'Команда', count: galleryItems.filter(item => item.category === 'team').length },
        { id: 'creative', name: 'Творчество', count: galleryItems.filter(item => item.category === 'creative').length },
        { id: 'education', name: 'Обучение', count: galleryItems.filter(item => item.category === 'education').length },
        { id: 'health', name: 'Здоровье', count: galleryItems.filter(item => item.category === 'health').length }
    ];
    
    const filteredItems = selectedCategory === 'all' 
        ? galleryItems 
        : galleryItems.filter(item => item.category === selectedCategory);

    return (
        <div className="guest-gallery">
            <div className="container">
                <div className="page-header">
                    <Link to="/guest" className="button button-light text-md">
                        ← Назад на главную
                    </Link>
                    <h1>Галерея вдохновения</h1>
                    <p className="page-description">
                        Коллекция изображений для вдохновения в различных сферах деятельности
                    </p>
                </div>
                
                {/* Фильтры категорий */}
                <div className="category-filters">
                    <h3>Категории:</h3>
                    <div className="category-buttons">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`button ${selectedCategory === category.id ? 'button-info' : 'button-light'} text-md`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.name} ({category.count})
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Галерея */}
                <div className="gallery-grid">
                    {filteredItems.map(item => (
                        <div key={item.id} className="gallery-item">
                            <div className="image-container">
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    loading="lazy"
                                />
                                <div className="image-overlay">
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredItems.length === 0 && (
                    <div className="no-items">
                        В выбранной категории пока нет изображений
                    </div>
                )}
            </div>
        </div>
    );
}
