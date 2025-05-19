// components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactComponent as LogoIcon } from '../assets/logo-icon.svg';
import '../styles/Navbar.css';
import '../styles/ProfilePage.css';
import '../styles/LogoCsv.css';



const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setIsOpen(false);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
                    <LogoIcon className="logo-icon" />
                    Readora
                </Link>

                <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-item" onClick={() => setIsOpen(false)}>
                        Главная
                    </Link>

                    {!isAuthenticated ? (
                        <div className="auth-buttons">
                            <Link to="/login" className="nav-item" onClick={() => setIsOpen(false)}>
                                Войти
                            </Link>
                            <span className="divider">/</span>
                            <Link to="/register" className="nav-item" onClick={() => setIsOpen(false)}>
                                Регистрация
                            </Link>
                        </div>
                    ) : (
                        <div className="user-section">
                            <Link
                                to="/profile"
                                className="nav-item profile-btn"
                                onClick={() => setIsOpen(false)}
                            >
                                Профиль
                            </Link>
                            <button
                                className="nav-item logout-btn"
                                onClick={handleLogout}
                            >
                                Выйти
                            </button>
                        </div>
                    )}
                </div>

                <button
                    className={`hamburger ${isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Меню"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;