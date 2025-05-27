// pages/BookPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksApi, commentsApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { CommentForm } from '../components/CommentForm';
import OfflineReaderButton from '../components/OfflineReaderButton';
import '../styles/BookPage.css';

const BookPage = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const [book, setBook] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookRes, commentsRes] = await Promise.all([
                    booksApi.getBookDetails(id),
                    commentsApi.getComments(id)
                ]);

                setBook(bookRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                setError(err.response?.status === 403 ? "У вас нет прав на доступ к этой книге" : "Произошла ошибка");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);
    
    const handleNewComment = async () => {
        const commentsRes = await commentsApi.getComments(id);
        setComments(commentsRes.data);
    };    
    
    const handleDeleteComment = (commentId) => {
        commentsApi.deleteComment(commentId);
        setComments(prev => prev.filter(c => c.id !== commentId));
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="loading">{error}</div>;

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
                        className="book-cover-profile"
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

            <div className="offline-controls">
                <OfflineReaderButton
                    bookId={id}
                />
            </div>
            
            <button
                className="read-button"
                onClick={() => navigate(`/book/${book.id}/read`)}
            >
                Читать
            </button>
            
            <div className="comments-section">
                <h2>Комментарии ({comments.length})</h2>

                {isAuthenticated && (
                    <CommentForm
                        bookId={id}
                        userId={user.id}
                        onSuccess={handleNewComment}
                    />
                )}

                <div className="comments-list">
                    {comments.map(comment => (
                    <div key={comment.id} className="comment">
                        <div className="comment-header">
                    <span className="author">
                        { comment.user.name || 'Аноним'}
                    </span>
                    <span className="date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                        </div>
                            <div className="comment-text">{comment.text}</div>

                            {user?.id === comment.user.id  && (
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteComment(comment.id)}
                                >
                                    Удалить
                                </button>
                            )}
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
};

export default BookPage;