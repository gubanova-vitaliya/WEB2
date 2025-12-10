import React, { useState, useEffect } from 'react';
import { getGases } from '../api';
import './GalleryPage.css';

export function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [gases, setGases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGases();
    }, []);

    const loadGases = async () => {
        try {
            setLoading(true);
            const data = await getGases();
            setGases(data || []);
        } catch (error) {
            console.error('Ошибка загрузки газов:', error);
        } finally {
            setLoading(false);
        }
    };

    // Преобразуем газы в формат для галереи
    const getGalleryItems = () => {
        if (gases.length === 0) {
            return [];
        }
        
        return gases.map(gas => {
            // Определяем категорию по молярной массе
            let category = 'heavy';
            if (gas.molar_mass < 10) {
                category = 'light';
            } else if (gas.molar_mass < 30) {
                category = 'medium';
            }
            
            return {
                id: gas.id,
                title: `${gas.title} ${gas.formula}`,
                category: category,
                image: gas.image_url || 'https://via.placeholder.com/400x300?text=No+Image',
                description: gas.description || `Молярная масса: ${gas.molar_mass.toFixed(2)} г/моль`
            };
        });
    };
    
    const galleryItems = getGalleryItems();
    
    const categories = [
        { id: 'all', name: 'Все категории', count: galleryItems.length },
        { id: 'light', name: 'Легкие (< 10 г/моль)', count: galleryItems.filter(item => item.category === 'light').length },
        { id: 'medium', name: 'Средние (10-30 г/моль)', count: galleryItems.filter(item => item.category === 'medium').length },
        { id: 'heavy', name: 'Тяжелые (> 30 г/моль)', count: galleryItems.filter(item => item.category === 'heavy').length }
    ];
    
    const filteredItems = selectedCategory === 'all' 
        ? galleryItems 
        : galleryItems.filter(item => item.category === selectedCategory);

    return (
        <div className="gallery-page">
            <div className="container">
                <div className="page-header">
                    <h1>Галерея газов</h1>
                    <p className="page-description">
                        Коллекция изображений различных газов с фильтрацией по категориям
                    </p>
                </div>
                
                {/* Фильтры категорий */}
                <div className="category-filters">
                    <h3>Категории:</h3>
                    <div className="category-buttons">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.name} ({category.count})
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Галерея */}
                {loading ? (
                    <div className="loading">Загрузка газов...</div>
                ) : (
                    <>
                        <div className="gallery-grid">
                            {filteredItems.map(item => (
                                <div key={item.id} className="gallery-item">
                                    <div className="image-container">
                                        <img 
                                            src={item.image} 
                                            alt={item.title}
                                            loading="lazy"
                                            onError={(e) => {
                                                // Fallback на placeholder если изображение не загрузилось
                                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                            }}
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
                                {gases.length === 0 
                                    ? 'Газы не загружены. Проверьте подключение к API.'
                                    : 'В выбранной категории пока нет газов'
                                }
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

