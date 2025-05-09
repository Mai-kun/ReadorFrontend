import React from 'react';

const BookCard = ({ book }) => {
    return (
        <div className="book-card">
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