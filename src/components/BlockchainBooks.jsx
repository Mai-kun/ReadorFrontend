// src/components/BlockchainBooks.js
import React, { useState } from 'react';
import { blockchainService } from '../services/blockchainService';

export default function BlockchainBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBlockchainBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Получаем общее количество книг в блокчейне
            const count = await blockchainService.getBookCount();
            // Получаем детали для каждой книги
            const booksData = [];
            for (let i = 0; i < count; i++) {
                const book = await blockchainService.getBook(i);
                booksData.push({
                    id: book[0].toString(),
                    title: book[1],
                    fileHash: book[2]
                });
            }

            setBooks(booksData);
        } catch (err) {
            setError('Ошибка при загрузке данных из блокчейна');
            console.error('Blockchain fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blockchain-section">
            <h2>Книги в блокчейне</h2>

            <button
                className="blockchain-button"
                onClick={fetchBlockchainBooks}
                disabled={loading}
            >
                {loading ? 'Загрузка...' : 'Показать книги в блокчейне'}
            </button>

            {error && <p className="error-message">{error}</p>}

            {books.length > 0 && (
                <div className="blockchain-books-grid">
                    {books.map(book => (
                        <div key={book.id} className="blockchain-book-card">
                            <h3>{book.title}</h3>
                            <p>ID: {book.id}</p>
                            <p className="hash">
                                Хэш: <span title={book.fileHash}>
                                    {book.fileHash.substring(0, 12)}...
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}