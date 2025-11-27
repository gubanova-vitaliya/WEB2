import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App.tsx'
import store from './store/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/WEB2">
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

// Регистрация Service Worker для PWA
if ("serviceWorker" in navigator) {
  registerSW()
}


