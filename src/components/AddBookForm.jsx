import React, {useEffect, useRef, useState} from 'react';
import { useAuth } from '../context/AuthContext';
import {booksApi, genresApi} from '../api/auth';
import '../styles/AddBookForm.css';
import GenreSelector from "./GenreSelector";

const AddBookForm = ({ onClose }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        publicationYear: new Date().getFullYear(),
        isbn: '',
        genres: [],
        bookFile: null,
        coverImage: null
    });
    const [genresList, setGenresList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const modalRef = useRef(null);

    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };
    
    // Загрузка списка жанров при монтировании
    useEffect(() => {
        const loadGenres = async () => {
            try {
                const response = await genresApi.getGenres();
                setGenresList(response.data);
            } catch (err) {
                console.error('Error loading genres:', err);
            }
        };
        loadGenres();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.bookFile || !formData.coverImage) {
            setError('Все файлы обязательны для загрузки');
            return;
        }

        const data = new FormData();
        data.append('Title', formData.title);
        data.append('Description', formData.description);
        data.append('PublicationYear', formData.publicationYear);
        data.append('ISBN', formData.isbn);
        formData.genres.forEach((genreId) => {
            data.append('Genres', genreId);
        });
        data.append('BookFile', formData.bookFile);
        data.append('CoverImage', formData.coverImage);

        try {
            setLoading(true);
            await booksApi.uploadBook(data);
            onClose();
        } catch (err) {
            setError(err.response?.data || 'Ошибка при загрузке книги');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onMouseDown={handleOverlayClick}>
            <div className="add-book-form" ref={modalRef}>
            <h2>Добавить новую книгу</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Название книги*</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        maxLength={200}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Описание</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        maxLength={3000}
                    />
                </div>

                <div className="form-group">
                    <label>Год издания*</label>
                    <input
                        type="number"
                        value={formData.publicationYear}
                        onChange={(e) => setFormData({...formData, publicationYear: e.target.value})}
                        min="1800"
                        max={new Date().getFullYear()}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>ISBN</label>
                    <input
                        type="text"
                        value={formData.isbn}
                        onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                        pattern="^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$"
                    />
                    <small>Формат: 10 или 13 цифр с дефисами</small>
                </div>

                <GenreSelector
                    genresList={genresList}
                    formData={formData}
                    setFormData={setFormData}
                />

                <div className="form-group">
                    <label>Файл книги (TXT)*</label>
                    <input
                        type="file"
                        accept=".txt"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && !file.name.match(/\.txt$/i)) {
                                alert('Допустим только файл формата .txt');
                                e.target.value = '';
                                return;
                            }
                            setFormData({ ...formData, bookFile: file });
                        }}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Обложка (JPG/PNG/WEBP)*</label>
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && !file.name.match(/\.(jpe?g|png|webp)$/i)) {
                                alert('Допустимые форматы: JPG, JPEG, PNG, WEBP');
                                e.target.value = '';
                                return;
                            }
                            setFormData({...formData, coverImage: file});
                        }}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose}>Отмена</button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Загрузка...' : 'Опубликовать'}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default AddBookForm;