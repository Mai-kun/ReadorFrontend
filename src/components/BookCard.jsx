import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/BookCard.css';

const BookCard = ({ book }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const getStatusStyle = () => {
        if (book.status === 'Pending') return 'moderation-pending';
        if (book.status === 'Rejected') return 'moderation-rejected';
        return '';
    };

    return (
        <div
            className={`book-card ${getStatusStyle()}`}
            onClick={() => navigate(`/book/${book.id}`)}
            role="button"
            tabIndex={0}
        >
            <img
                src={book.coverUrl || '/placeholder-cover.jpg'}
                alt={book.title}
                className="book-cover"
            />
            <div className="book-info">
                <h3>{book.title}</h3>
                <div className="genres">
                    {book.genres.map(genre => (
                        <span key={genre} className="genre-tag">{genre}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookCard;