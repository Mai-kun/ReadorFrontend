import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import '../styles/HomePage.css';
import { userApi } from '../api/auth';
import AddBookForm from "../components/AddBookForm";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddBookForm, setShowAddBookForm] = useState(false);
    const [userBooks, setUserBooks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await userApi.getMe();
                setProfile(res.data);
            } catch (err) {
                console.error('Profile fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;

    if (!profile) return <div className="error">Profile not found</div>;

    return (
        <div className="container profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-info">
                    <h1>{profile.username}</h1>
                    <div className="meta-info">
                        <p>Email: {profile.email}</p>
                        <p>Registered: {new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="profile-actions">
                <button
                    className="add-book-button"
                    onClick={() => setShowAddBookForm(true)}
                >
                    Добавить книгу
                </button>
            </div>

            {showAddBookForm && (
                <div className="modal-overlay">
                    <AddBookForm
                        onClose={() => setShowAddBookForm(false)}
                        onBookAdded={(newBook) => setUserBooks([...userBooks, newBook])}
                    />
                </div>
            )}
            
            {/* Statistics */}
            <div className="stats-section">
                <h2>Statistics</h2>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-label">Total Books</span>
                        <span className="stat-value">{profile.totalBooks}</span>
                    </div>
                </div>
            </div>

            {/* User's Books */}
            <div className="books-section">
                <h2>Your Books</h2>
                {profile.books.length === 0 ? (
                    <p className="empty-message">No books uploaded yet</p>
                ) : (
                    <div className="books-grid">
                        {profile.books.map(book => (
                            <BookCard
                                key={book.id}
                                book={book}
                                showActions={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}