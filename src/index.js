import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {PWAInstallProvider} from "./context/PWAInstallContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <PWAInstallProvider>
        <App />
      </PWAInstallProvider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/readora-site/service-worker.js').then(() => {
            console.log('Service Worker зарегистрирован.');
        }).catch(error => {
            console.error('Ошибка регистрации Service Worker:', error);
        });
    });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
