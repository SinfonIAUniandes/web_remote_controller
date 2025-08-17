// src/App.js
import React from 'react';
import Header from './components/layout/Header';
import DesktopDashboard from './components/layout/DesktopDashboard';
import VerticalMobileDashboard from './components/layout/VerticalMobileDashboard';
import HorizontalMobileDashboard from './components/layout/HorizontalMobileDashboard';
import { useRos } from './contexts/RosContext';

const App = () => {
    const { isMobile, isLandscape } = useRos();

    const renderMobileDashboard = () => {
        if (isLandscape) {
            return <HorizontalMobileDashboard />;
        }
        return <VerticalMobileDashboard />;
    };

    return (
        <div className="App bg-slate-100 min-h-screen">
            {/* Renderiza el Header solo si no es móvil */}
            {!isMobile && <Header />}
            {/* Renderiza el componente de dashboard apropiado */}
            {isMobile ? renderMobileDashboard() : <DesktopDashboard />}
        </div>
    );
};

export default App;
