import React, { useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

const SpeechControl = () => {
    const { ros } = useRos();
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('Spanish');
    const [isAnimated, setIsAnimated] = useState(true); // Estado para el habla animada

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
            animated: isAnimated, // Usar el estado del checkbox
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
        <div className="text-center flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4">Control de Voz</h2>
            <div className="flex-grow flex flex-col justify-center">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Texto para que el robot hable..."
                    className="w-full p-2 border border-gray-300 rounded-md mb-2 resize-none"
                    rows="3"
                />
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                >
                    <option value="Spanish">Español</option>
                    <option value="English">Inglés</option>
                </select>
            </div>
            <div className="flex items-center justify-center mb-4">
                <input
                    id="animated-speech"
                    type="checkbox"
                    checked={isAnimated}
                    onChange={(e) => setIsAnimated(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="animated-speech" className="ml-2 block text-sm text-gray-900">
                    Habla animada
                </label>
            </div>
            <button 
                onClick={handleSpeak}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
                Hablar
            </button>
        </div>
    );
};

export default SpeechControl;