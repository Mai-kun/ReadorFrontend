// components/OfflineReaderButton.jsx
import React, { useState, useEffect } from 'react';
import '../styles/CashButton.css';
import { apiUrl, booksApi } from "../api/auth";

const OfflineReaderButton = ({ bookId }) => {
    const [isCached, setIsCached] = useState(false);
    const [swSupported, setSwSupported] = useState(true);

    // Проверка поддержки Service Worker при монтировании
    useEffect(() => {
        if (!('serviceWorker' in navigator)) {
            console.warn('Браузер не поддерживает Service Workers');
            setSwSupported(false);
        }
    }, []);

    useEffect(() => {
        const checkCache = async () => {
            try {
                const cache = await caches.open('dynamic-v2');
                const url = `${apiUrl().defaults.baseURL}/books/${bookId}/text`;
                const response = await cache.match(url);
                setIsCached(!!response);
            } catch (error) {
                console.error('Ошибка проверки кэша:', error);
            }
        };

        if (swSupported) checkCache();
    }, [bookId, swSupported]);

    const handleCacheBook = async () => {
        if (!swSupported) return;

        try {
            const response = await booksApi.getTextContent(bookId);
            const content = response.data;

            // Ожидание активации Service Worker
            const registration = await navigator.serviceWorker.ready;

            if (registration.active) {
                registration.active.postMessage({
                    action: 'CACHE_BOOK',
                    payload: {
                        url: `${apiUrl().defaults.baseURL}/books/${bookId}/text`,
                        content: content
                    }
                });
                setIsCached(true);
            } else {
                console.error('Service Worker не активирован');
            }
        } catch (error) {
            console.error('Ошибка кэширования:',
                error.response?.data?.message
                || error.message
                || 'Неизвестная ошибка'
            );
        }
    };

    if (!swSupported) return null;

    return (
        !isCached && (
            <button
                onClick={handleCacheBook}
                className="cache-button"
                title="Сохранить для оффлайн-чтения"
            >
                📥 Сохранить оффлайн
            </button>
        )
    );
};

export default OfflineReaderButton;