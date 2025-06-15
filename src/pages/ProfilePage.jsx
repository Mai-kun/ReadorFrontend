import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import '../styles/HomePage.css';
import { userApi } from '../api/auth';
import AddBookForm from "../components/AddBookForm";
import {useNavigate} from "react-router-dom";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddBookForm, setShowAddBookForm] = useState(false);
    const [userBooks, setUserBooks] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await userApi.getMe();
                setProfile(res.data);
                setUserBooks(res.data.books);
            } catch (err) {
                console.error('Profile fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await userApi.getMe();
                setProfile(res.data);
                setUserBooks(res.data.books);
            } catch {}
        };
        fetchData();
    }, [showAddBookForm]);
    
    if (loading) return <div className="loading">Загрузка...</div>;

    if (!profile) return <div className="error">Профиль не найден</div>;

    return (
        <div className="container profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-info">
                    <h1>{profile.username}</h1>
                    <div className="meta-info">
                        <p>Email: {profile.email}</p>
                        <p>Дата регистрации: {new Date(profile.createdAt).toLocaleDateString()}</p>
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

            {profile.role === 'Moderator' && (
                <button
                    className="moderation-button"
                    style={{
                        marginTop: '10px',
                        marginLeft: '12px',
                        backgroundColor: '#f39c12',
                        color: 'white',
                        padding: '0.5rem 1.5rem',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        outline: 'none',
                    }}
                    onClick={() => navigate('/moderation')}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e08e0b';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f39c12';
                        e.target.style.transform = 'scale(1)';
                    }}
                    onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 3px rgba(243, 156, 18, 0.3)';
                    }}
                    onBlur={(e) => {
                        e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                    }}
                >
                    Модерация
                </button>
            )}
            
            {showAddBookForm && (
                <div className="modal-overlay">
                    <AddBookForm
                        onClose={
                         async () => {
                            setShowAddBookForm(false);
                            const response = await userApi.getMe();
                            setUserBooks(response.data.books);
                        }}
                    />
                </div>
            )}
            
            {/* Statistics */}
            <div className="stats-section">
                <h2>Статистика</h2>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-label">Всего книг</span>
                        <span className="stat-value">{profile.totalBooks}</span>
                    </div>
                </div>
            </div>

            {/* User's Books */}
            <div className="books-section">
                <h2>Ваши книги</h2>
                {profile.books.length === 0 ? (
                    <p className="empty-message">Еще не загружено ни одной книги</p>
                ) : (
                    <div className="books-grid">
                        {userBooks.map(book => (
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