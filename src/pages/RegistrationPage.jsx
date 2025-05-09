// pages/RegistrationPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import InputField from '../components/ui/InputField';
import SubmitButton from '../components/ui/SubmitButton';
import '../styles/Auth.css';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        try {
            await authApi.register(formData);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>Регистрация</h1>
                {error && <div className="alert alert-danger">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <InputField
                        label="Логин"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                    
                    <InputField
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />

                    <InputField
                        label="Пароль"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />

                    <InputField
                        label="Подтвердите пароль"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />

                    <SubmitButton>Зарегистрироваться</SubmitButton>
                </form>

                <div className="auth-links">
                    Уже есть аккаунт? <a href="/login">Войдите</a>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;