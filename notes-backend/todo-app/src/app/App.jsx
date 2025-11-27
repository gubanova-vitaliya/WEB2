import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router';
import { ListenerProvider } from './ListenerProvider';
import { Navbar } from '../components/Navbar';
import { store } from '../store/store';
import '../styles.css';

function App() {
    return (
        <Provider store={store}>
            <div className='App'>
                <Navbar />
                <div className='app-content'>
                    <RouterProvider router={router}>
                        <ListenerProvider />
                    </RouterProvider>
                </div>
            </div>
        </Provider>
    );
}

export default App;
