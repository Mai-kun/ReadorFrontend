import React from 'react';

const InputField = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    error,
    placeholder, 
    className = ''
}) => {
    return (
        <div className={`form-group ${className}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`form-control ${error ? 'is-invalid' : ''}`}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

export default InputField;