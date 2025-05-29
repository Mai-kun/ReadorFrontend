import React, { useContext } from 'react';
import { PWAInstallContext } from '../context/PWAInstallContext';
import bannerImage from '../assets/pwa-banner.png';
import '../styles/InstallBanner.css';


const InstallBanner = () => {
    const { isInstallAvailable, installApp } = useContext(PWAInstallContext);

    if (!isInstallAvailable) return null;

    return (
        <div className="install-banner">
            <img src={bannerImage} alt="Установите как приложение" className="install-banner-icon" />
            <div className="install-banner-content">
                <button onClick={installApp}>Установить</button>
            </div>
        </div>
    );
};

export default InstallBanner;
