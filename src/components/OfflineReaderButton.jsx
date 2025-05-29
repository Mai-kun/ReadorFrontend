import React, { useState, useEffect } from 'react';
import '../styles/CashButton.css';
import { apiUrl, booksApi } from "../api/auth";

const OfflineReaderButton = ({ bookId }) => {
    const [isCached, setIsCached] = useState(false);
    const [swSupported, setSwSupported] = useState(true);
    const [isCaching, setIsCaching] = useState(false);
    const [book, setBook] = useState(null);
    const [bookText, setBookText] = useState(null);

    // Проверка поддержки Service Worker
    useEffect(() => {
        if (!('serviceWorker' in navigator)) {
            console.warn('Браузер не поддерживает Service Workers');
            setSwSupported(false);
        } else {
            navigator.serviceWorker.ready.then(() => {
                console.log('Service Worker готов');
                setSwSupported(true);
            }).catch((error) => {
                console.warn('Service Worker не активирован', error);
                setSwSupported(false);
            });
        }
    }, []);

    // Загрузка данных книги
    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const [response, textResponse] = await Promise.all([
                    booksApi.getBookDetails(bookId),
                    booksApi.getTextContent(bookId)
                ]);
                setBook(response.data);
                setBookText(textResponse.data);
            } catch (error) {
                console.error('Ошибка загрузки книги:', error.message);
            }
        };
        fetchBookData();
    }, [bookId]);

    // Проверка кэша
    useEffect(() => {
        const checkCache = async () => {
            try {
                const cache = await caches.open('dynamic-v2');
                const baseUrl = apiUrl().defaults.baseURL;
                const urls = [
                    `${baseUrl}/books/${bookId}`,
                    `${baseUrl}/books/${bookId}/text`
                ];
                const responses = await Promise.all(urls.map(url => cache.match(url)));
                setIsCached(responses.every(response => !!response));
            } catch (error) {
                console.error('Ошибка проверки кэша:', error.message);
            }
        };
        if (swSupported) checkCache();
    }, [bookId, swSupported]);

    // Обработчик сообщений от Service Worker
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.action === 'CACHE_BOOK_SUCCESS') {
                setIsCached(true);
                setIsCaching(false);
            } else if (event.data.action === 'CACHE_BOOK_ERROR') {
                console.error('Ошибка кэширования:', event.data.error);
                setIsCaching(false);
            }
        };
        navigator.serviceWorker.addEventListener('message', handleMessage);
        return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
    }, []);

    const handleCacheBook = async () => {
        if (!swSupported || !book || !bookText) return;
        setIsCaching(true);
        try {
            console.log("Попытка получить регистрацию Service Worker");
            const registration = await navigator.serviceWorker.ready;
            console.log("Регистрация Service Worker получена");
            if (registration.active) {
                const baseUrl = apiUrl().defaults.baseURL;
                registration.active.postMessage({
                    action: 'CACHE_BOOK',
                    payload: [
                        { url: `${baseUrl}/books/${bookId}`, content: book },
                        { url: `${baseUrl}/books/${bookId}/text`, content: bookText }
                    ]
                });
            } else {
                console.error('Service Worker не активирован');
                setIsCaching(false);
            }
        } catch (error) {
            console.error('Ошибка кэширования:', error.message);
            setIsCaching(false);
        }
    };

    if (!swSupported) return null;

    return (
        !isCached && (
            <button
                onClick={handleCacheBook}
                className="cache-button"
                disabled={isCaching || !book || !bookText}
                title="Сохранить для оффлайн-чтения"
            >
                {isCaching ? 'Сохранение...' : '📥 Сохранить оффлайн'}
            </button>
        )
    );
};

export default OfflineReaderButton;