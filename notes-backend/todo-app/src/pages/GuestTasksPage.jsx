import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectFilteredTodos, selectLoading } from '../store/slices/todosSlice';

export function GuestTasksPage() {
    const todos = useAppSelector(selectFilteredTodos);
    const loading = useAppSelector(selectLoading);
    
    const [localFilter, setLocalFilter] = useState('all');
    const [localSearch, setLocalSearch] = useState('');
    
    // Локальная фильтрация для гостевого режима
    const filteredTodos = todos.filter(todo => {
        const matchesSearch = localSearch === '' || 
            todo.title.toLowerCase().includes(localSearch.toLowerCase()) ||
            todo.content.toLowerCase().includes(localSearch.toLowerCase());
            
        const matchesFilter = localFilter === 'all' || 
            (localFilter === 'completed' && todo.completed) ||
            (localFilter === 'active' && !todo.completed);
            
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="guest-tasks">
            <div className="container">
                <div className="page-header">
                    <Link to="/guest" className="button button-light text-md">
                        ← Назад на главную
                    </Link>
                    <h1>Просмотр задач (Гостевой режим)</h1>
                    <p className="page-description">
                        Здесь вы можете просматривать задачи и использовать фильтры для поиска
                    </p>
                </div>
                
                {/* Панель фильтров */}
                <div className="filter-panel">
                    <div className="search-section">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Поиск задач..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-section">
                        <span className="filter-label">Фильтр:</span>
                        <div className="filter-buttons">
                            <button 
                                className={`button ${localFilter === 'all' ? 'button-info' : 'button-light'} text-md`}
                                onClick={() => setLocalFilter('all')}
                            >
                                Все ({todos.length})
                            </button>
                            <button 
                                className={`button ${localFilter === 'active' ? 'button-info' : 'button-light'} text-md`}
                                onClick={() => setLocalFilter('active')}
                            >
                                Активные ({todos.filter(t => !t.completed).length})
                            </button>
                            <button 
                                className={`button ${localFilter === 'completed' ? 'button-info' : 'button-light'} text-md`}
                                onClick={() => setLocalFilter('completed')}
                            >
                                Выполненные ({todos.filter(t => t.completed).length})
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Список задач */}
                <div className="tasks-grid">
                    {loading && <div className="loading">Загрузка задач...</div>}
                    
                    {!loading && filteredTodos.length === 0 && (
                        <div className="no-tasks">
                            {localSearch || localFilter !== 'all' 
                                ? 'Задачи не найдены по заданным критериям' 
                                : 'Нет доступных задач'
                            }
                        </div>
                    )}
                    
                    {filteredTodos.map((todo) => (
                        <div key={todo.id} className={`task-card ${todo.completed ? 'completed' : ''}`}>
                            <div className="task-status">
                                {todo.completed ? '✅' : '⏳'}
                            </div>
                            <div className="task-content">
                                <h3 className="task-title">{todo.title}</h3>
                                <p className="task-description">{todo.content}</p>
                                <div className="task-meta">
                                    <span className={`status-badge ${todo.completed ? 'completed' : 'active'}`}>
                                        {todo.completed ? 'Выполнено' : 'В процессе'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
