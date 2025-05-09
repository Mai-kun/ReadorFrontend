// pages/LoginPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext'; // Добавляем импорт
import InputField from '../components/ui/InputField';
import SubmitButton from '../components/ui/SubmitButton';
import '../styles/Auth.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Вызываем хук на верхнем уровне компонента

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await authApi.login(formData);

            // Теперь используем метод login из контекста
            const success = await login(formData);

            if (success) {
                navigate('/profile');
            }
        } catch (err) {
            setError('Неверные учетные данные');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {isLoading ? (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <>
                        <h1>Вход в систему</h1>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <InputField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({...formData, email: e.target.value});
                                    setError(''); // Сбрасываем ошибку при изменении
                                }}
                                required
                            />

                            <InputField
                                label="Пароль"
                                type="password"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({...formData, password: e.target.value});
                                    setError('');
                                }}
                                required
                            />

                            <SubmitButton disabled={isLoading}>
                                {isLoading ? 'Вход...' : 'Войти'}
                            </SubmitButton>
                        </form>

                        <div className="auth-links">
                            Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;