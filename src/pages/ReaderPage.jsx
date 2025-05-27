import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { booksApi } from '../api/auth';
import '../styles/ReaderPage.css';

const ReaderPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [textContent, setTextContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isOfflineMode = location.search.includes('offline=true');

    useEffect(() => {
        const loadContent = async () => {
            try {
                let content = '';
                const apiUrl = booksApi.getTextContent(id).url;
                const cache = await caches.open('dynamic-v2');

                // Для офлайн-режима: только кэш
                if (isOfflineMode) {
                    const cachedResponse = await cache.match(apiUrl);
                    if (!cachedResponse) {
                        throw new Error('Книга не доступна офлайн');
                    }
                    content = await cachedResponse.json();
                }
                // Для онлайн-режима: сеть -> кэш
                else {
                    try {
                        const response = await booksApi.getTextContent(id);
                        content = response.data.content;
                        // Обновляем кэш
                        const responseToCache = new Response(JSON.stringify(content), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                        await cache.put(apiUrl, responseToCache);
                    } catch (networkError) {
                        const cachedResponse = await cache.match(apiUrl);
                        if (cachedResponse) {
                            content = await cachedResponse.json();
                        } else {
                            throw networkError;
                        }
                    }
                }

                setTextContent(content);
                setError('');
            } catch (err) {
                setError(isOfflineMode
                    ? 'Книга недоступна в офлайн-режиме'
                    : 'Не удалось загрузить текст книги');
                if (isOfflineMode) {
                    navigate('/offline', { replace: true });
                }
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [id, isOfflineMode, navigate]);

    return (
        <div className="reader-container">
            <div className="reader-header">
                <button
                    className="back-button"
                    onClick={() => navigate(isOfflineMode ? '/offline' : -1)}
                >
                    ← Назад
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loader"></div>
                    <p>Загрузка книги...</p>
                </div>
            ) : error ? (
                <div className="error-state">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="content-wrapper">
                    <pre className="text-content">{textContent}</pre>
                </div>
            )}
        </div>
    );
};

export default ReaderPage;