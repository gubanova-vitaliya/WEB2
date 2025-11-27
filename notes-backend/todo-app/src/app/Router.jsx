import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { TodoListPage } from '../pages/TodoListPage';
import { TodoPage } from '../pages/TodoPage';
import { GuestHomePage } from '../pages/GuestHomePage';
import { GuestTasksPage } from '../pages/GuestTasksPage';
import { GuestGalleryPage } from '../pages/GuestGalleryPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';

// Определяем basename в зависимости от окружения
const basename = import.meta.env.PROD ? '/WEB2' : '';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Основные страницы */}
            <Route path="/" index exact element={<TodoListPage />}/>
            <Route path="/todo/:id" element={<TodoPage />} />
            <Route path="/shopping" element={<ShoppingCartPage />} />
            
            {/* Гостевые страницы */}
            <Route path="/guest" element={<GuestHomePage />} />
            <Route path="/guest/tasks" element={<GuestTasksPage />} />
            <Route path="/guest/gallery" element={<GuestGalleryPage />} />
        </>
    ),
    { basename }
);
