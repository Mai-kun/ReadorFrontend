// App.js
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import BookPage from "./pages/BookPage";
import ReaderPage from "./pages/ReaderPage";
import ModerationPage from "./pages/ModerationPage";

function App() {
    return (
        <AuthProvider>
            <HashRouter>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/book/:id" element={<BookPage />} />
                    <Route path="/book/:id/read" element={<ReaderPage />} />
                    <Route path="/" element={<HomePage />} />

                    <Route
                        path="/moderation"
                        element={
                            <ProtectedRoute requiredRole="Moderator">
                                <ModerationPage />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
}
export default App;