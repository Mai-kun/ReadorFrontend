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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [booksResponse, genresResponse] = await Promise.all([
                    booksApi.getBooks({
                        genre: selectedGenre,
                        search: searchQuery
                    }),
                    genresApi.getGenres()
                ]);

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

    return (
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
    );
};

export default HomePage;