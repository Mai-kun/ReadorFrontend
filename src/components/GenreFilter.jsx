import React from 'react';

const GenreFilter = ({ genres, selectedGenre, onSelect }) => {
    return (
        <div className="genre-filter">
            <select 
                value={selectedGenre} 
                onChange={(e) => onSelect(e.target.value)}
                className="genre-select"
            >
                <option value="">Все жанры</option>
                {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                ))}
            </select>
        </div>
    );
};

export default GenreFilter;