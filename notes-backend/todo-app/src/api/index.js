import { getApiUrl, getMode } from '../config/api';

// Используем Tauri fetch если доступен, иначе обычный fetch
const fetchFunction = window.__TAURI__ ? 
  (await import('@tauri-apps/plugin-http')).fetch : 
  window.fetch;

const getBaseUrl = () => getApiUrl('/todos');

export async function getTodos() {
    try {
        const url = getBaseUrl();
        const response = await fetchFunction(url, {
            method: 'GET',
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching todos:', error);
        
        // В случае ошибки возвращаем mock данные для демонстрации
        if (getMode() === 'production') {
            return getMockTodos();
        }
        throw error;
    }
}

export async function postTodos(todo) {
    try {
        const url = getBaseUrl();
        const response = await fetchFunction(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error posting todo:', error);
        
        // В production режиме возвращаем переданную задачу как успешно созданную
        if (getMode() === 'production') {
            return todo;
        }
        throw error;
    }
}

export async function putTodos(todo) {
    try {
        const response = await fetch(`${URL}/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
}

export async function deleteTodos(id) {
    try {
        const url = `${getBaseUrl()}/${id}`;
        const response = await fetchFunction(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return response;
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
        
        // В production режиме имитируем успешное удаление
        if (getMode() === 'production') {
            return { ok: true };
        }
        throw error;
    }
}

// Mock данные для демонстрации
function getMockTodos() {
    return [
        {
            id: 1,
            title: 'Изучить Tauri',
            content: 'Познакомиться с основами разработки desktop приложений на Tauri',
            completed: false
        },
        {
            id: 2,
            title: 'Настроить Redux',
            content: 'Добавить Redux Toolkit для управления состоянием приложения',
            completed: true
        },
        {
            id: 3,
            title: 'Создать PWA',
            content: 'Настроить Progressive Web App функциональность',
            completed: false
        }
    ];
}
