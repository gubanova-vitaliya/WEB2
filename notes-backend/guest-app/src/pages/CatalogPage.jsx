import React, { useState, useEffect } from 'react';
import { getGases } from '../api';
import './CatalogPage.css';

// Предустановленные диапазоны молярной массы
const PRESET_RANGES = [
  { label: "Легкие (< 10 г/моль)", min: 0, max: 10 },
  { label: "Средние (10-30 г/моль)", min: 10, max: 30 },
  { label: "Тяжелые (30-50 г/моль)", min: 30, max: 50 },
];

export function CatalogPage() {
    const [gases, setGases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [minMass, setMinMass] = useState('');
    const [maxMass, setMaxMass] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(null);

    useEffect(() => {
        loadGases();
    }, []);

    const loadGases = async (filters = {}) => {
        try {
            setLoading(true);
            const data = await getGases(filters);
            // Сортируем по молярной массе
            data.sort((a, b) => a.molar_mass - b.molar_mass);
            setGases(data || []);
        } catch (error) {
            console.error('Ошибка загрузки газов:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePresetRange = (min, max) => {
        setMinMass(min?.toString() || '');
        setMaxMass(max?.toString() || '');
        setSelectedPreset(`${min}-${max}`);
        const filters = {
            minMolarMass: min,
            maxMolarMass: max,
        };
        loadGases(filters);
    };

    const handleClearFilters = () => {
        setMinMass('');
        setMaxMass('');
        setSelectedPreset(null);
        loadGases();
    };

    const handleApplyFilters = () => {
        const filters = {};
        if (minMass) {
            const min = parseFloat(minMass);
            if (!isNaN(min)) filters.minMolarMass = min;
        }
        if (maxMass) {
            const max = parseFloat(maxMass);
            if (!isNaN(max)) filters.maxMolarMass = max;
        }
        loadGases(filters);
    };

    return (
        <div className="catalog-page">
            <div className="container">
                <div className="page-header">
                    <h1>Каталог газов</h1>
                    <p className="page-description">
                        Просмотр всех доступных газов с фильтрацией по молярной массе
                    </p>
                </div>

                {/* Панель фильтров */}
                <div className="filter-panel">
                    <div className="preset-ranges">
                        <span className="preset-label">Быстрый выбор:</span>
                        <div className="preset-buttons">
                            {PRESET_RANGES.map((range, index) => (
                                <button
                                    key={index}
                                    className={`preset-btn ${selectedPreset === `${range.min}-${range.max}` ? 'active' : ''}`}
                                    onClick={() => handlePresetRange(range.min, range.max)}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="filter-section">
                        <div className="filter-inputs">
                            <div className="filter-input-group">
                                <label htmlFor="min-mass">Минимальная молярная масса (г/моль):</label>
                                <input
                                    id="min-mass"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="От"
                                    value={minMass}
                                    onChange={(e) => setMinMass(e.target.value)}
                                />
                            </div>
                            <div className="filter-input-group">
                                <label htmlFor="max-mass">Максимальная молярная масса (г/моль):</label>
                                <input
                                    id="max-mass"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="До"
                                    value={maxMass}
                                    onChange={(e) => setMaxMass(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="filter-actions">
                            <button className="filter-btn apply" onClick={handleApplyFilters}>
                                Применить фильтры
                            </button>
                            {(minMass || maxMass) && (
                                <button className="filter-btn clear" onClick={handleClearFilters}>
                                    Очистить
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Список газов */}
                {loading ? (
                    <div className="loading">Загрузка газов...</div>
                ) : (
                    <div className="gases-grid">
                        {gases.length === 0 ? (
                            <div className="no-gases">
                                Газы не найдены по заданным критериям
                            </div>
                        ) : (
                            <>
                                <div className="results-info">
                                    Найдено газов: {gases.length}
                                </div>
                                {gases.map((gas) => (
                                    <div key={gas.id} className="gas-card">
                                        <div className="gas-image">
                                            <img 
                                                src={gas.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                                                alt={gas.title}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                }}
                                            />
                                        </div>
                                        <div className="gas-content">
                                            <h3 className="gas-title">{gas.title}</h3>
                                            <p className="gas-formula"><strong>Формула:</strong> {gas.formula}</p>
                                            <p className="gas-mass">
                                                <strong>Молярная масса:</strong> {gas.molar_mass.toFixed(2)} г/моль
                                            </p>
                                            {gas.description && (
                                                <p className="gas-description">{gas.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

