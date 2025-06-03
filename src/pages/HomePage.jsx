import React, { useEffect, useState } from 'react';
import { booksApi, genresApi } from '../api/auth';
import BookCard from '../components/BookCard';
import GenreFilter from '../components/GenreFilter';
import InstallBanner from '../components/InstallBanner';
import '../styles/HomePage.css';

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const cache = await caches.open('dynamic-v2');
                const cachedResponse = await cache.match(`/api/books`);

                if (cachedResponse) {
                    const cachedData = await cachedResponse.json();
                    setBooks(cachedData.data);
                }

                const [booksResponse, genresResponse] = await Promise.all([
                    booksApi.getBooks({
                        genre: selectedGenre,
                        search: searchQuery
                    }),
                    genresApi.getGenres()
                ]);

                const newCache = await caches.open('dynamic-v2');
                const response = new Response(JSON.stringify(booksResponse.data), {
                    headers: {'Content-Type': 'application/json'}
                });
                await newCache.put(`/api/books`, response);

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
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <div className="home-layout">
            <InstallBanner />
            <div className="home-page">
                <h1>Библиотека</h1>
                <div className="search-filters">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Поиск по названию или автору..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Поиск книг"
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

            {!isLoading && !error && showScrollButton && (
                <button
                    className="scroll-to-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    ⬆ Наверх
                </button>
            )}
        </div>
    );
};

export default HomePage;