import React, { useState, useEffect } from 'react';
import { moderationApi } from '../api/auth';
import '../styles/ModerationPage.css';

const ModerationPage = () => {
    const [books, setBooks] = useState([]);
    const [comments, setComments] = useState({});
    const [pagination, setPagination] = useState({ page: 1, total: 0 });

    const loadBooks = async (page) => {
        const response = await moderationApi.getPendingBooks(page);
        setBooks(response.data.books);
        setPagination({ ...pagination, total: response.data.totalCount });
    };

    const handleApprove = async (bookId) => {
        moderationApi.approveBook(bookId, { comment: comments[bookId] || '' });
        loadBooks(pagination.page.filter(b => b.id !== bookId));
    };

    const handleReject = async (bookId) => {
        moderationApi.rejectBook(bookId, { comment: comments[bookId] || '' });
        loadBooks(pagination.page.filter(b => b.id !== bookId));
    };


    useEffect(() => {
        loadBooks(1);
    }, []);

    return (
        <div className="moderation-page">
            <h1>Модерация книг</h1>

            <div className="moderation-list">
                {books.map(book => (
                    <div key={book.id} className="moderation-item">
                        <div className="book-info">
                            <h3>{book.title}</h3>
                            <p>Автор: {book.author}</p>
                            <p>Жанры: {book.genres.join(', ')}</p>
                            <p>Дата загрузки: {new Date(book.uploadDate).toLocaleDateString()}</p>
                        </div>

                        <div className="moderation-actions">
                        <textarea
                            placeholder="Комментарий модератора"
                            value={comments[book.id] || ''}
                            onChange={(e) =>
                                setComments({ ...comments, [book.id]: e.target.value })
                            }
                        />
                            <div className="buttons">
                                <button
                                    className="approve-btn"
                                    onClick={() => handleApprove(book.id)}
                                >
                                    Одобрить
                                </button>
                                <button
                                    className="reject-btn"
                                    onClick={() => handleReject(book.id)}
                                >
                                    Отклонить
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            {/* Пагинация */}
        </div>
    );
};

export default ModerationPage;