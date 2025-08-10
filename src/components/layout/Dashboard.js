import React from 'react';

// Importación de todos los componentes de funcionalidades
import AnimationControl from '../features/manipulation/AnimationControl';
import AutonomousLifeControl from '../features/miscellaneous/AutonomousLifeControl';
import BaseControl from '../features/navigation/BaseControl';
import BreathingControl from '../features/manipulation/BreathingControl';
import CameraFeed from '../features/perception/CameraFeed';
import LedControl from '../features/miscellaneous/LedControl';
import MicrophoneFeed from '../features/speech/MicrophoneFeed';
import PostureControl from '../features/manipulation/PostureControl';
import AudioReproductionControl from '../features/speech/AudioReproductionControl';
import SecurityControl from '../features/manipulation/SecurityControl';
import SpeechControl from '../features/speech/SpeechControl';
import TrackerControl from '../features/perception/TrackerControl';
import VolumeControl from '../features/speech/VolumeControl';
import ScriptPanel from '../common/ScriptPanel';

const dashboardStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    padding: '20px',
};

const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const Dashboard = () => {
    return (
        <div>
            <BaseControl /> {/* Componente sin UI visible, solo para eventos de teclado */}
            <div style={dashboardStyle}>
                <div style={cardStyle}><CameraFeed /></div>
                <div style={cardStyle}><SpeechControl /></div>
                <div style={cardStyle}><VolumeControl /></div>
                <div style={cardStyle}><AudioReproductionControl /></div>
                <div style={cardStyle}><MicrophoneFeed /></div>
                <div style={cardStyle}><PostureControl /></div>
                <div style={cardStyle}><AnimationControl /></div>
                <div style={cardStyle}><TrackerControl /></div>
                <div style={cardStyle}><LedControl /></div>
                <div style={cardStyle}><BreathingControl /></div>
                <div style={cardStyle}><AutonomousLifeControl /></div>
                <div style={cardStyle}><SecurityControl /></div>
                <div style={cardStyle}><ScriptPanel /></div>
            </div>
        </div>
    );
};

export default Dashboard;