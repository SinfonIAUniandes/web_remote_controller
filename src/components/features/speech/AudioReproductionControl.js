//audio que sirve: http://audio-edge-es6pf.mia.g.radiomast.io/ref-128k-mp3-stereo

import React, { useState } from 'react';
import { useRos } from '../../../contexts/RosContext';
import { createService, callService } from '../../../services/RosManager';

const RobotAudioControl = () => {
    const { ros } = useRos();
    const [audioUrl, setAudioUrl] = useState("");

    // Servicios de ROS para reproducir y detener audio
    const audioService = ros 
        ? createService(ros, '/naoqi_speech_node/play_web_stream', 'naoqi_utilities_msgs/srv/PlayWebStream')
        : null;

    const stopAudioService = ros 
        ? createService(ros, '/naoqi_speech_node/stop_all_sounds', 'std_srvs/srv/Trigger')
        : null;

    // Enviar URL de audio al robot
    const handlePlayUrl = () => {
        if (!audioUrl.trim()) {
            alert("Ingrese una URL de audio válida.");
            return;
        }

        if (!audioService) {
            alert("Error: No hay conexión con ROS.");
            return;
        }

        // Crear solicitud con la URL del audio
        const request = { url: audioUrl };

        // Llamar al servicio para reproducir el audio
        callService(audioService, request, (result) => {
            if (result.success) {
                console.log(`Reproduciendo audio desde URL: ${audioUrl}. Mensaje: ${result.message}`);
            } else {
                console.error(`Error al reproducir el audio: ${result.message}`);
            }
        });
    };

    // Detener audio en el robot
    const handleStopAudio = () => {
        if (!stopAudioService) {
            alert("Error: No hay conexión con ROS.");
            return;
        }

        // Llamar al servicio para detener el audio
        callService(stopAudioService, {}, (result) => {
            if (result.success) {
                console.log("Audio detenido exitosamente.");
            } else {
                console.error(`Error al detener el audio: ${result.message}`);
            }
        });
    };

    return (
        <div className="text-center flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4">Reproducir Audio en Robot</h2>
            <div className="flex-grow">
                <label htmlFor="audio-url" className="block text-sm font-medium text-gray-700 mb-1">URL del audio:</label>
                <input
                    id="audio-url"
                    type="text"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="http://.../audio.mp3"
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="mt-4 flex justify-center gap-2">
                <button 
                    onClick={handlePlayUrl} 
                    disabled={!audioUrl.trim() || !audioService}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                >
                    Reproducir
                </button>
                <button 
                    onClick={handleStopAudio} 
                    disabled={!stopAudioService}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-400"
                >
                    Detener
                </button>
            </div>
        </div>
    );
};

export default RobotAudioControl;