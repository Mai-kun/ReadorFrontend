// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (credentials) => {
        try {
            await authApi.login(credentials);
            return await checkAuth(); // Возвращаем результат проверки
        } catch (error) {
            return false;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
            document.cookie = 'TastyCookies=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'UserId=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const checkAuth = async () => {
        try {
            const res = await authApi.checkAuth();
            setUser({
                id: res.data.id,
                username: res.data.username,
                role: res.data.role
            });
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Проверяем аутентификацию при загрузке приложения
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                logout, // Добавляем в предоставляемые значения
                login,
                checkAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context; // Должен возвращать объект с logout
};