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
            // Crear servicio para controlar volumen
            const volumeService = createService(ros, '/pytoolkit/ALAudioDevice/set_output_volume_srv', 'robot_toolkit_msgs/set_output_volume_srv');
            
            // Crear servicio para hacer hablar al robot
            const speechService = createService(ros, '/robot_toolkit/audio_tools_srv', 'robot_toolkit_msgs/audio_tools_srv');

            return () => {
                volumeService.unsubscribe();
                speechService.unsubscribe();
            };
        }
    }, [ros]);

    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
        if (ros) {
            const volumeService = createService(ros, '/pytoolkit/ALAudioDevice/set_output_volume_srv', 'robot_toolkit_msgs/set_output_volume_srv');
            volumeService.callService({ volume: newVolume }, (result) => {
                console.log('Volume updated:', result);
            });
        }
    };

    const toggleMute = () => {
        setMuted(!muted);
    };

    const handleSpeak = () => {
        if (ros && text.trim()) {
            const speechService = createService(ros, '/robot_toolkit/audio_tools_srv', 'robot_toolkit_msgs/audio_tools_srv');
            speechService.callService({ command: 'enable_tts', language, text }, (result) => {
                console.log('Robot spoke:', result);
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