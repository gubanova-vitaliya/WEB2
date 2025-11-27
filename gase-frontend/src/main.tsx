import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import store from './store'
import { getDestRoot } from '../target_config'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={getDestRoot()}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

if ("serviceWorker" in navigator) {
  registerSW()
}
