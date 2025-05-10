// pages/BookPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksApi, commentsApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { CommentForm } from '../components/CommentForm';
import '../styles/BookPage.css';

const BookPage = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const [book, setBook] = useState(null);
    const [showContent, setShowContent] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

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
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleNewComment = (newComment) => {
        setComments([...comments, newComment]);
    };

    if (loading) return <div className="loading">Загрузка...</div>;

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


            <button
                className="read-button"
                onClick={() => navigate(`/book/${book.id}/read`)}
            >
                Читать
            </button>

            {showContent && (
                <div className="content-modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowContent(false)}>&times;</span>
                        <div className="book-content-text">{book.content}</div>
                    </div>
                </div>
            )}

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
                                <span className="author">{comment.user.username}</span>
                                <span className="date">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="comment-text">{comment.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookPage;