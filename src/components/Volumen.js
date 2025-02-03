import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createService } from '../services/RosManager';

const RobotAudioControl = () => {
    const { ros } = useRos();
    const [volume, setVolume] = useState(50);
    const [muted, setMuted] = useState(false);
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        if (ros) {
            console.log("ROS conectado, servicios listos para usar");
        }
    }, [ros]);

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
        if (ros) {
            const volumeService = createService(ros, '/pytoolkit/ALAudioDevice/set_output_volume', 'robot_toolkit_msgs/SetOutputVolume');
            volumeService.callService({ volume: newVolume }, (result) => {
                console.log('Volumen actualizado:', result);
            }, (error) => {
                console.error('Error al actualizar volumen:', error);
            });
        }
    };

    const toggleMute = () => {
        setMuted(!muted);
        if (ros) {
            const muteService = createService(ros, '/pytoolkit/ALAudioDevice/mute', 'robot_toolkit_msgs/MuteAudio');
            muteService.callService({ state: !muted }, (result) => {
                console.log('Mute cambiado:', result);
            }, (error) => {
                console.error('Error al cambiar mute:', error);
            });
        }
    };

    const handleSpeak = () => {
        if (ros && text.trim()) {
            const speechService = createService(ros, '/robot_toolkit/audio_tools', 'robot_toolkit_msgs/AudioTools');
            speechService.callService({ command: 'enable_tts', language, text }, (result) => {
                console.log('Robot habló:', result);
            }, (error) => {
                console.error('Error al hablar:', error);
            });
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Control de Audio del Robot</h2>
            <div>
                <label>Volumen: {volume}</label>
                <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} />
            </div>
            <button onClick={toggleMute}>{muted ? 'Desmutear' : 'Mutear'}</button>
            <div>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Texto para el robot" />
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="en">Inglés</option>
                    <option value="es">Español</option>
                </select>
                <button onClick={handleSpeak}>Hablar</button>
            </div>
        </div>
    );
};

export default RobotAudioControl;