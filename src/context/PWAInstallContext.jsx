import React, { createContext, useEffect, useState, useCallback } from 'react';

export const PWAInstallContext = createContext();

export const PWAInstallProvider = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallAvailable, setIsInstallAvailable] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallAvailable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const installApp = useCallback(async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('Приложение установлено');
        } else {
            console.log('Пользователь отклонил установку');
        }

        setDeferredPrompt(null);
        setIsInstallAvailable(false);
    }, [deferredPrompt]);

    return (
        <PWAInstallContext.Provider value={{ isInstallAvailable, installApp }}>
            {children}
        </PWAInstallContext.Provider>
    );
};