import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
    fetchTodos, 
    addTodo, 
    removeTodo, 
    setFilter, 
    setSearchQuery,
    selectFilteredTodos,
    selectLoading,
    selectError,
    selectFilter,
    selectSearchQuery
} from '../store/slices/todosSlice';

export function TodoListPage() {
    const dispatch = useAppDispatch();
    
    // Redux селекторы
    const todos = useAppSelector(selectFilteredTodos);
    const loading = useAppSelector(selectLoading);
    const error = useAppSelector(selectError);
    const currentFilter = useAppSelector(selectFilter);
    const searchQuery = useAppSelector(selectSearchQuery);

    // новая задача
    const [newTodo, setNewTodo] = useState({ title: '', content: '' });

    // обработка параметров в адресной строке
    const [searchParams] = useSearchParams();
    // ссылаемся на инпут
    const newTodoRef = useRef();

    // загрузка задач при запуске
    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);

    // обработка параметра new-todo
    useEffect(() => {
        if (searchParams.has('new-todo') && newTodoRef.current) {
            newTodoRef.current.focus();
        }
    }, [searchParams]);

    // добавление новой задачи
    const handleAddTodo = async () => {
        if (!newTodo.title || !newTodo.content) {
            if (window.__TAURI__) {
                const { message } = await import('@tauri-apps/plugin-dialog');
                await message('Поля не могут быть пустыми', { 
                    title: 'Ошибка', 
                    kind: 'error' 
                });
            } else {
                alert('Поля не могут быть пустыми');
            }
            return;
        }
        
        const newTodoWithId = { ...newTodo, id: Date.now() };
        
        try {
            await dispatch(addTodo(newTodoWithId)).unwrap();
            setNewTodo({ title: '', content: '' });
        } catch (error) {
            console.error('Ошибка добавления задачи:', error);
            if (window.__TAURI__) {
                const { message } = await import('@tauri-apps/plugin-dialog');
                await message('Ошибка при добавлении задачи', { 
                    title: 'Ошибка', 
                    kind: 'error' 
                });
            } else {
                alert('Ошибка при добавлении задачи');
            }
        }
    };

    // удаление задачи
    const handleDeleteTodo = async (id) => {
        let confirmed = false;
        
        if (window.__TAURI__) {
            const { confirm } = await import('@tauri-apps/plugin-dialog');
            confirmed = await confirm('Вы уверены, что хотите удалить задачу?', {
                title: 'Подтверждение удаления',
                kind: 'warning'
            });
        } else {
            confirmed = window.confirm('Вы уверены, что хотите удалить задачу?');
        }
        
        if (!confirmed) return;
        
        try {
            await dispatch(removeTodo(id)).unwrap();
        } catch (error) {
            console.error('Ошибка удаления задачи:', error);
            if (window.__TAURI__) {
                const { message } = await import('@tauri-apps/plugin-dialog');
                await message('Ошибка при удалении задачи', { 
                    title: 'Ошибка', 
                    kind: 'error' 
                });
            } else {
                alert('Ошибка при удалении задачи');
            }
        }
    };

    // обработка изменения фильтра
    const handleFilterChange = (filter) => {
        dispatch(setFilter(filter));
    };

    // обработка изменения поискового запроса
    const handleSearchChange = (query) => {
        dispatch(setSearchQuery(query));
    };
    
    return (
        <div>
            <div className="mode-switcher">
                <Link to="/guest" className="button button-light text-md">
                    🎭 Гостевой режим
                </Link>
            </div>
            <h1>Планирование задач</h1>
            
            {/* Поиск и фильтры */}
            <div className='container'>
                <div className='search-filter-section'>
                    <input
                        className='search-input'
                        type='text'
                        placeholder='Поиск задач...'
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <div className='filter-buttons'>
                        <button 
                            className={`button ${currentFilter === 'all' ? 'button-info' : 'button-light'} text-md`}
                            onClick={() => handleFilterChange('all')}
                        >
                            Все
                        </button>
                        <button 
                            className={`button ${currentFilter === 'active' ? 'button-info' : 'button-light'} text-md`}
                            onClick={() => handleFilterChange('active')}
                        >
                            Активные
                        </button>
                        <button 
                            className={`button ${currentFilter === 'completed' ? 'button-info' : 'button-light'} text-md`}
                            onClick={() => handleFilterChange('completed')}
                        >
                            Выполненные
                        </button>
                    </div>
                </div>
            </div>

            {/* Форма добавления задачи */}
            <div className='container'>
                <h2>Добавить новую задачу</h2>
                <input
                    className='input-title'
                    type='text'
                    placeholder='Название'
                    value={newTodo.title}
                    ref={newTodoRef}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                />
                <textarea
                    className='input-content'
                    placeholder='Содержание'
                    value={newTodo.content}
                    onChange={(e) => setNewTodo({ ...newTodo, content: e.target.value })}
                />
                <button 
                    className='button button-success text-lg'
                    onClick={handleAddTodo}
                    disabled={loading}
                >
                  {loading ? 'Добавление...' : 'Добавить'}
                </button>
            </div>
            <hr />
            {/* Список задач */}
            <div className='container'>
                {loading && <div className='loading'>Загрузка...</div>}
                {error && <div className='error'>Ошибка: {error}</div>}
                
                {!loading && todos.length === 0 && (
                    <div className='no-todos'>
                        {searchQuery ? 'Задачи не найдены' : 'Нет задач. Добавьте первую задачу!'}
                    </div>
                )}
                
                {todos.map((todo) => (
                    <div className='todo' key={todo.id}>
                        <h3 className='todo-title'>
                            {todo.title}
                        </h3>
                        <p className='todo-content'>
                            {todo.content}
                        </p>
                        <div className='todo-actions'>
                            <button 
                                className='button button-danger text-md'
                                onClick={() => handleDeleteTodo(todo.id)}
                                disabled={loading}
                            >
                                Удалить
                            </button>
                            <Link
                                to={`/todo/${todo.id}`}
                                className='button button-info text-md'
                            >
                                Подробнее
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
