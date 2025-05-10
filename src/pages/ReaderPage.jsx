import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { booksApi } from '../api/auth';
import '../styles/ReaderPage.css';

const ReaderPage = () => {
    const { id } = useParams();
    const [textContent, setTextContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadText = async () => {
            try {
                const response = await booksApi.getTextContent(id);
                setTextContent(response.data.content);
            } catch (err) {
                setError('Не удалось загрузить текст книги');
            } finally {
                setLoading(false);
            }
        };

        loadText();
    }, [id]);

    return (
        <div className="reader-container">
            {loading && <div className="loading">Загрузка книги...</div>}

            <div className="reader-container">
                <pre className="text-content">{textContent}</pre>
            </div>
        </div>
    );
};

export default ReaderPage;