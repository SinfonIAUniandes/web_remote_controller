import React, { useEffect, useState } from 'react';
import { useRos } from '../contexts/RosContext';
import { createService } from '../services/RosManager';
import * as ROSLIB from 'roslib';

const RobotAudioControl = () => {
    const { ros } = useRos();
    const [volume, setVolume] = useState(50);
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('es');

    useEffect(() => {
        if (ros) {
            const enableAudioService = createService(ros, '/robot_toolkit/audio_tools_srv', 'robot_toolkit_msgs/audio_tools_srv');
            const audioRequest = {
                command: "enable_tts"
            };
            enableAudioService.callService(audioRequest, (result) => {
                console.log('Audio tools service initialized:', result);
            }, (error) => {
                console.error('Error initializing audio service:', error);
            });
        }
    }, [ros]);

    const handleVolumeChange = (event) => {
        const newVolume = parseInt(event.target.value, 10);
        setVolume(newVolume);
        if (ros) {
            const volumeService = createService(ros, '/pytoolkit/ALAudioDevice/set_output_volume_srv', 'robot_toolkit_msgs/set_output_volume_srv');
            const request = { volume: newVolume };
            volumeService.callService(request, (result) => {
                console.log('Volumen actualizado:', result);
            }, (error) => {
                console.error('Error al actualizar volumen:', error);
            });
        }
    };

    const increaseVolume = () => {
        if (volume < 100) {
            handleVolumeChange({ target: { value: volume + 10 } });
        }
    };

    const decreaseVolume = () => {
        if (volume > 0) {
            handleVolumeChange({ target: { value: volume - 10 } });
        }
    };

    const handleSpeak = () => {
        if (!text.trim()) {
            alert("Por favor, ingrese un texto para que el robot hable.");
            return;
        }

        if (ros) {
            const speechService = createService(ros, '/robot_toolkit/audio_tools_srv', 'robot_toolkit_msgs/audio_tools_srv');
            const request = {
                command: "enable_tts",
                language: language,
                text: text
            };

            speechService.callService(request, (result) => {
                console.log('El robot habló:', result);
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
                <button onClick={increaseVolume}>Subir Volumen</button>
                <button onClick={decreaseVolume}>Bajar Volumen</button>
            </div>
            <div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Texto para el robot"
                />
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                </select>
                <button onClick={handleSpeak}>Hablar</button>
            </div>
        </div>
    );
};

export default RobotAudioControl;
