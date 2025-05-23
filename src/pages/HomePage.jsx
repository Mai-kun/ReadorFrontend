import React, { useEffect, useState } from 'react';
import {booksApi, genresApi} from '../api/auth';
import BookCard from '../components/BookCard';
import GenreFilter from '../components/GenreFilter';
import '../styles/HomePage.css';

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Пытаемся получить данные из кэша
                const cache = await caches.open('dynamic-v2');
                const cachedResponse = await cache.match(booksApi.getBooks.url);

                if (cachedResponse) {
                    const cachedData = await cachedResponse.json();
                    setBooks(cachedData.data);
                }

                // Загрузка свежих данных
                const [booksResponse, genresResponse] = await Promise.all([
                    booksApi.getBooks({
                        genre: selectedGenre,
                        search: searchQuery
                    }),
                    genresApi.getGenres()
                ]);

                // Обновление кэша
                const newCache = await caches.open('dynamic-v2');
                const response = new Response(JSON.stringify(booksResponse.data), {
                    headers: {'Content-Type': 'application/json'}
                });
                await newCache.put(booksApi.getBooks.url, response);

                setBooks(booksResponse.data);
                setGenres(genresResponse.data.map(g => g.name));
            } catch (err) {
                setError(err.response?.data?.message || 'Ошибка загрузки данных');
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [selectedGenre, searchQuery]);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('Установка приложения подтверждена');
            }
            setDeferredPrompt(null);
            setShowInstallBanner(false);
        }
    };
    
    return (
        <div className="home-layout">
            {showInstallBanner && (
                <div className="install-banner">
                    <p>Установите это приложение для быстрого доступа!</p>
                    <button onClick={handleInstallClick}>Установить</button>
                </div>
            )}

            <div className="home-page">
                <h1>Библиотека</h1>
                <div className="search-filters">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Поиск по названию или автору..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <GenreFilter
                        genres={genres}
                        selectedGenre={selectedGenre}
                        onSelect={setSelectedGenre}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}
                {isLoading ? (
                    <div className="loading">Загрузка...</div>
                ) : (
                    <div className="books-grid">
                        {books.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;