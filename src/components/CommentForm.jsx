import React, { useState } from 'react';
import { commentsApi } from '../api/auth';

export const CommentForm = ({ bookId, userId, onSuccess }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            setLoading(true);
            const response = await commentsApi.createComment({
                bookId,
                userId,
                text
            });

            onSuccess(response.data);
            setText('');
        } catch (err) {
            setError('Ошибка при отправке комментария');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Напишите ваш комментарий..."
                disabled={loading}
            />
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={loading}>
                {loading ? 'Отправка...' : 'Отправить'}
            </button>
        </form>
    );
};