// pages/BookPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksApi } from '../api/auth';
import '../styles/BookPage.css';

const BookPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await booksApi.getBookDetails(id);
                setBook(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Книга не найдена');
                navigate('/404', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    if (loading) return <div className="loading">Загрузка книги...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="book-page">
            <div className="book-header">
                <h1>{book.title}</h1>
                <button onClick={() => navigate(-1)} className="back-button">
                    Назад
                </button>
            </div>

            <div className="book-content">
                <div className="book-cover-container">
                    <img
                        src={book.coverUrl || '/placeholder-cover.jpg'}
                        alt={book.title}
                        className="book-cover"
                    />
                </div>

                <div className="book-details">
                    <p className="author">Автор: {book.author}</p>
                    <p className="genre">Жанр: {book.genres.join(', ')}</p>
                    <p className="description">{book.description}</p>

                    <div className="meta-info">
                        <p>Год издания: {book.publicationYear}</p>
                        <p>ISBN: {book.isbn || 'не указан'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookPage;