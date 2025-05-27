// src/pages/OfflineLibrary.jsx
import React, { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';

const OfflineLibrary = () => {
    const [offlineBooks, setOfflineBooks] = useState([]);

    useEffect(() => {
        const loadOfflineBooks = async () => {
            const cache = await caches.open('dynamic-v2');
            const keys = await cache.keys();

            const books = [];

            for (const request of keys) {
                if (request.url.endsWith('/text')) {
                    const bookId = request.url.split('/').slice(-2)[0];

                    const bookMetaReq = await cache.match(`https://readora.cloudpub.ru/api/books/${bookId}`);
                    if (bookMetaReq) {
                        const meta = await bookMetaReq.json();
                        books.push(meta);
                    }
                }
            }

            setOfflineBooks(books);
        };

        loadOfflineBooks();
    }, []);

    return (
        <div className="offline-library">
            <h2>Доступные офлайн книги</h2>
            {offlineBooks.length === 0 ? (
                <p>Нет загруженных книг</p>
            ) : (
                <div className="book-grid">
                    {offlineBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OfflineLibrary;
