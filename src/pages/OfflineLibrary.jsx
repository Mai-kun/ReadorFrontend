import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OfflineLibrary.css';


const OfflineLibrary = () => {
    const [offlineBooks, setOfflineBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadOfflineBooks = async () => {
            try {
                const cache = await caches.open('dynamic-v2');
                const requests = await cache.keys();

                const booksData = await Promise.all(
                    requests
                        .filter(req => req.url.includes('/books/') && !req.url.endsWith('/text'))
                        .map(async req => {
                            const response = await cache.match(req);
                            return response.json();
                        })
                );

                setOfflineBooks(booksData);
            } catch (error) {
                console.error('Ошибка загрузки офлайн-книг:', error);
            }
        };

        loadOfflineBooks();
    }, []);

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}/read?offline=true`);
    };

    return (
        <div className="offline-library-page">
            <h1>Офлайн-библиотека</h1>
            <div className="offline-books-grid">
                {offlineBooks.map(book => (
                    <div
                        key={book.id}
                        className="offline-book-card"
                        onClick={() => handleBookClick(book.id)}
                    >
                        <img
                            src={book.coverUrl || '/placeholder-cover.jpg'}
                            alt={book.title}
                            className="offline-book-cover"
                        />
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfflineLibrary;