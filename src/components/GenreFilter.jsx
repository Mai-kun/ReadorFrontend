import React from 'react';
import Select from 'react-select';
import '../styles/GenreFilter.css';

const GenreFilter = ({ genres, selectedGenre, onSelect }) => {
    const options = [
        { value: "", label: "Все жанры" },
        ...genres.map(genre => ({ value: genre, label: genre }))
    ];

    const customStyles = {
        control: (base) => ({
            ...base,
            borderRadius: '25px',
            padding: '4px',
            fontSize: '16px',
            borderColor: '#ccc',
            alignment: 'center',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#2c3e50'
                : state.isFocused
                    ? '#f0f8ff'
                    : 'white',
            color: state.isSelected 
                ? 'white'
                : 'black',
            cursor: 'pointer',
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '25px',
            overflow: 'hidden',
        }),
    };

    return (
        <div className="genre-filter">
            <Select
                options={options}
                value={options.find(o => o.value === selectedGenre)}
                onChange={(selected) => onSelect(selected?.value || '')}
                styles={customStyles}
                placeholder="Все жанры"
                isSearchable
                isClearable
            />
        </div>
    );
};

export default GenreFilter;
