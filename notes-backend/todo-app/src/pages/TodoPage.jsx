import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTodos } from '../api';

export function TodoPage() {
    const { id } = useParams();
    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTodo();
    }, [id]);

    const loadTodo = async () => {
        try {
            const todos = await getTodos();
            const foundTodo = todos.find(todo => todo.id == id);
            setTodo(foundTodo);
        } catch (error) {
            console.error('Ошибка загрузки задачи:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='container'>
                <h1>Загрузка...</h1>
            </div>
        );
    }

    return (
        <div className='container'>
            <Link to='/'>
                <button className='button button-light text-lg'>
                    🔙 Вернуться
                </button>
            </Link>
            {todo ? (
                <div className='vertical-center'>
                    <div>
                        <h1>{todo.title}</h1>
                        <p className='large-content'>{todo.content}</p>
                    </div>
                </div>
            ) : (
                <h1>Задача не найдена</h1>
            )}
        </div>
    );
}
