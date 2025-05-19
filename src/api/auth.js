import axios from 'axios';

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
    getBooks: (params) => api.get('/books', { params }),
    getBookDetails: (id) => api.get(`/books/${id}`),
    getTextContent: (id) => api.get(`/books/${id}/text`),
    uploadBook: (formData) => api.post('/books', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
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

export const commentsApi = {
    getComments: (bookId) => api.get(`/comments?bookId=${bookId}`),
    createComment: (data) => api.post('/comments', data),
    deleteComment: (id) => api.delete(`/comments/${id}`)
};

export const moderationApi = {
    getPendingBooks: (page) => api.get(`/moderation/pending?page=${page}`),
    approveBook: (bookId, data) => api.post(`/moderation/approve/${bookId}`, data),
    rejectBook: (bookId, data) => api.post(`/moderation/reject/${bookId}`, data),
};

// Пример проверки через Etherscan
const verifyTransaction = async (txHash) => {
    const response = await fetch(
        `https://api.etherscan.io/api?module=transaction&action=gettxinfo&txhash=${txHash}`
    );
    const data = await response.json();
    return data.status === "1"; // 1 = успешная транзакция
};