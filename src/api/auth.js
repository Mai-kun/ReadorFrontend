import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL: 'https://readora.cloudpub.ru/api',
    withCredentials: true
});

export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    checkAuth: () => api.get('/auth/check'),
};

export const booksApi = {
    getBooks: (genre = null) =>
        api.get('/books', {
            params: {
                genre: genre || undefined
            }
        }),
    getBookDetails: (id) => api.get(`/books/${id}`),
    uploadBook: (data) => api.post('/books', data),
    updateBook: (id, data) => api.put(`/books/${id}`, data),
    deleteBook: (id) => api.delete(`/books/${id}`)
};

export const genresApi = {
    getGenres: () => api.get('/genres'),
    createGenre: (name) => api.post('/genres', { name }),
    updateGenre: (id, name) => api.put(`/genres/${id}`, { name }),
    deleteGenre: (id) => api.delete(`/genres/${id}`)
};

export const userApi = {
    getCurrentUser: (id) => api.get(`/users/${id}`),
    getMe: () => api.get(`/users/me`),
    updateUserProfile: (data) => api.put('/users/me', data),
    getUserBooks: (userId) => api.get(`/users/${userId}/books`)
};