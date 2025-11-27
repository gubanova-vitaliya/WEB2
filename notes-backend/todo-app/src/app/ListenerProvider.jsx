import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function ListenerProvider({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        // Проверяем, доступен ли Tauri
        if (window.__TAURI__) {
            import('@tauri-apps/api/event').then(({ listen }) => {
                const unlisten = listen('new-todo', () => {
                    navigate('/?new-todo');
                });

                return () => {
                    unlisten.then(fn => fn());
                };
            });
        }
    }, [navigate]);

    return children;
}
