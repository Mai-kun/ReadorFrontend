import '../styles/GenreSelector.css';
import '../styles/AddBookForm.css';
import { useState } from 'react';

function GenreSelector({ genresList, formData, setFormData }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Фильтрация жанров по введённому поисковому запросу
    const filteredGenres = genresList.filter(genre =>
        genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="form-group">
            <label>Жанры*</label>

            {/* Поле поиска по жанрам */}
            <input
                type="text"
                placeholder="Поиск жанра..."
                className="genre-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Список жанров с чекбоксами */}
            <div className="genres-grid">
                {filteredGenres.map(genre => (
                    <label key={genre.id} className="genre-checkbox">
                        <input
                            type="checkbox"
                            value={genre.id}
                            checked={formData.genres.includes(genre.id)}
                            onChange={(e) => {
                                const newGenres = e.target.checked
                                    ? [...formData.genres, genre.id]
                                    : formData.genres.filter(id => id !== genre.id);
                                setFormData({ ...formData, genres: newGenres });
                            }}
                        />
                        {' ' + genre.name}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default GenreSelector;
