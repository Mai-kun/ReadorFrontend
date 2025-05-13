import React, {useEffect, useRef, useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { booksApi, genresApi } from '../api/auth';
import '../styles/AddBookForm.css';

const AddBookForm = ({ onClose, onBookAdded }) => {
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
            data.append('Genres', genreId); // ✅ отправляем как многозначное поле
        });
        data.append('BookFile', formData.bookFile);
        data.append('CoverImage', formData.coverImage);

        try {
            setLoading(true);
            const response = await booksApi.uploadBook(data);
            onBookAdded(response.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при загрузке книги');
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

                <div className="form-group">
                    <label>Жанры*</label>
                    <div className="genres-grid">
                        {genresList.map(genre => (
                            <label key={genre.id} className="genre-checkbox">
                                <input
                                    type="checkbox"
                                    value={genre.id}
                                    checked={formData.genres.includes(genre.id)}
                                    onChange={(e) => {
                                        const newGenres = e.target.checked
                                            ? [...formData.genres, genre.id]
                                            : formData.genres.filter(id => id !== genre.id);
                                        setFormData({...formData, genres: newGenres});
                                    }}
                                />
                                {' ' + genre.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Файл книги (TXT)*</label>
                    <input
                        type="file"
                        accept=".txt"
                        onChange={(e) => setFormData({...formData, bookFile: e.target.files[0]})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Обложка (JPG/PNG/WEBP)*</label>
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={(e) => setFormData({...formData, coverImage: e.target.files[0]})}
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