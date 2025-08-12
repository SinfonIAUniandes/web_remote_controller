import React, { useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

const SpeechControl = () => {
    const { ros } = useRos();
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('Spanish');

    const handleSpeak = () => {
        if (!text.trim()) {
            alert("Por favor, ingrese un texto para que el robot hable.");
            return;
        }

        if (!ros) {
            console.error("La conexión con ROS no está disponible.");
            return;
        }

        const speechService = createService(
            ros,
            '/naoqi_speech_node/say',
            'naoqi_utilities_msgs/srv/Say'
        );

        const request = {
            text: text,
            language: language,
            animated: true,
            asynchronous: true 
        };

        console.log(`Enviando texto para hablar: "${text}" en ${language}`);

        callService(speechService, request, (result) => {
            if (result.success) {
                console.log(`El robot está hablando. Mensaje: ${result.message}`);
            } else {
                console.error(`Error al intentar que el robot hable. Razón: ${result.message}`);
            }
        });
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Control de Voz</h2>
            <div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Texto para el robot"
                    style={{ marginRight: '10px' }}
                />
                <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ marginRight: '10px' }}>
                    <option value="Spanish">Español</option>
                    <option value="English">Inglés</option>
                </select>
                <button onClick={handleSpeak}>Hablar</button>
            </div>
        </div>
    );
};

export default SpeechControl;