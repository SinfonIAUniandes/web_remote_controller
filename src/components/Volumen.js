import React, { useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createService } from '../services/RosManager';

const RobotAudioControl = () => {
    const { ros } = useRos();
    const [volume, setVolume] = useState(50);
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('en');

    const handleVolumeChange = (event) => {
        const newVolume = parseInt(event.target.value, 10);
        setVolume(newVolume);
        if (ros) {
            const volumeService = createService(ros, '/pytoolkit/ALAudioDevice/set_output_volume_srv', 'robot_toolkit_msgs/set_output_volume_srv');
            const request = { data: newVolume };
            volumeService.callService(request, (result) => {
                console.log('Volumen actualizado:', result);
            }, (error) => {
                console.error('Error al actualizar volumen:', error);
            });
        }
    };

    const handleSpeak = () => {
        if (ros && text.trim()) {
            const speechService = createService(ros, '/robot_toolkit/audio_tools_srv', 'robot_toolkit_msgs/audio_tools_srv');
            const request = {
                data: {
                    command: 'enable_tts',
                    language,
                    text,
                    animated: true
                }
            };
            speechService.callService(request, (result) => {
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
            <div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Texto para el robot"
                />
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