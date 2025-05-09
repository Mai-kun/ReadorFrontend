import React from 'react';

const SubmitButton = ({ children, loading = false }) => {
    return (
        <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
        >
            {loading ? 'Processing...' : children}
        </button>
    );
};

export default SubmitButton;