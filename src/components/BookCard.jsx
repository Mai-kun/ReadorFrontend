import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
    const navigate = useNavigate();
    
    return (
        <div
            className="book-card"
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
                <p className="author">{book.author}</p>
                <div className="genres">
                    {book.genres.map(genre => (
                        <span key={genre} className="genre-tag">{genre}</span>
                    ))}
                </div>
                <p className="description">{book.description}</p>
            </div>
        </div>
    );
};

export default BookCard;