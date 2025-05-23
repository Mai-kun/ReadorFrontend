import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/BookCard.css';

const BookCard = ({ book }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isAvailableOffline, setIsAvailableOffline] = useState(false);
    const bookId = book.id;

    useEffect(() => {
        const checkOfflineAvailability = async () => {
            try {
                const [contentCache, dataCache] = await Promise.all([
                    caches.open('dynamic-v2'),
                    caches.open('dynamic-v2')
                ]);

                const hasContent = await contentCache.match(
                    `https://readora.cloudpub.ru/api/books/${bookId}/text`
                );

                const hasData = await dataCache.match(
                    `https://readora.cloudpub.ru/api/books/${bookId}`
                );

                setIsAvailableOffline(!!hasContent && !!hasData);
            } catch (error) {
                console.error('Ошибка проверки кэша:', error);
            }
        };

        checkOfflineAvailability();
    }, [bookId]);
    
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
            {isAvailableOffline && (
                <div className="offline-badge" title="Доступно оффлайн">
                    📴
                </div>
            )}
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