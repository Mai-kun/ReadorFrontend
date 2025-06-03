import React, { useState, useEffect } from 'react';
import { moderationApi } from '../api/auth';
import '../styles/ModerationPage.css';
import {useNavigate} from "react-router-dom";

const ModerationPage = () => {
    const [books, setBooks] = useState([]);
    const [comments, setComments] = useState({});
    const [allBooks, setAllBooks] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const loadBooks = async (page, bookId) => {
        const response = await moderationApi.getPendingBooks(page);
        setBooks(response.data.books.filter(book => book.id !== bookId));
        setAllBooks(response.data.books.filter(book => book.id !== bookId));
        setPagination({ ...pagination, total: response.data.totalCount });
    };

    const handleApprove = async (bookId) => {
        moderationApi.approveBook(bookId, { comment: comments[bookId] || '' });
        await loadBooks(1, bookId);
    };

    const handleReject = async (bookId) => {
        moderationApi.rejectBook(bookId, { comment: comments[bookId] || '' });
        await loadBooks(1, bookId);
    };


    useEffect(() => {
        loadBooks(1);
    }, []);

    useEffect(() => {
        const filtered = allBooks.filter(book =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setBooks(filtered);
    }, [searchQuery, allBooks]);
    
    return (
        <div className="moderation-page">
            <h1>Модерация книг</h1>

            {/* Поисковое поле */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{marginBottom: '25px'}}
                />
            </div>
            
            <div className="moderation-list">
                {books.map(book => (
                    <div key={book.id} className="moderation-item">
                        <div className="book-info" >
                            <h3 onClick={() => navigate(`/book/${book.id}`)}
                                style={{ cursor: 'pointer' }}>{book.title}</h3>
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