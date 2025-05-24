import React, { useContext } from 'react';
import { PWAInstallContext } from '../context/PWAInstallContext';

const InstallBanner = () => {
    const { isInstallAvailable, installApp } = useContext(PWAInstallContext);

    if (!isInstallAvailable) return null;

    return (
        <div className="install-banner">
            <p>Установите этот сайт как приложение для быстрого доступа!</p>
            <button onClick={installApp}>Установить</button>
        </div>
    );
};

export default InstallBanner;