import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
<<<<<<< HEAD
import App from './App.tsx'
import store from './store/store'
=======
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import store from './store'
import { getDestRoot } from '../target_config'
>>>>>>> adaptive-deployment
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
<<<<<<< HEAD
      <BrowserRouter basename="/WEB2">
=======
      <BrowserRouter basename={getDestRoot()}>
>>>>>>> adaptive-deployment
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

<<<<<<< HEAD
// Регистрация Service Worker для PWA
if ("serviceWorker" in navigator) {
  registerSW()
}


=======
if ("serviceWorker" in navigator) {
  registerSW({
    onNeedRefresh() {
      // Показываем уведомление о необходимости обновления
      console.log("New content available, please refresh");
    },
    onOfflineReady() {
      // Приложение готово к работе оффлайн
      console.log("App ready to work offline");
    },
    onRegistered(registration: ServiceWorkerRegistration | undefined) {
      if (registration) {
        console.log("Service Worker registered:", registration);
      }
    },
    onRegisterError(error: Error) {
      console.error("Service Worker registration error:", error);
    }
  })
}
>>>>>>> adaptive-deployment
