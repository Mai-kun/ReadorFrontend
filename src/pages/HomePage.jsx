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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [booksResponse, genresResponse] = await Promise.all([
                    booksApi.getBooks(selectedGenre),
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

        fetchData();
    }, [selectedGenre]);

    return (
        <div className="home-page">
            <h1>Библиотека</h1>
            
            <GenreFilter
                genres={genres}
                selectedGenre={selectedGenre}
                onSelect={setSelectedGenre}
            />

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