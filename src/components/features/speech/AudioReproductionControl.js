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
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>Reproducir audio en el Robot</h2>

            {/* Campo para ingresar la URL */}
            <div style={{ marginBottom: '10px' }}>
                <label>URL del audio:</label>
                <br />
                <input
                    type="text"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="Ingrese la URL del audio"
                    style={{
                        width: '60%',
                        padding: '8px',
                        marginTop: '5px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>

            {/* Botones para reproducir y detener audio */}
            <div style={{ marginTop: '10px' }}>
                <button 
                    onClick={handlePlayUrl} 
                    disabled={!audioUrl.trim() || !audioService}
                    style={{
                        padding: '10px 15px',
                        fontSize: '16px',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px',
                        opacity: !audioUrl.trim() || !audioService ? 0.5 : 1
                    }}
                >
                    Reproducir Audio
                </button>

                <button 
                    onClick={handleStopAudio} 
                    disabled={!stopAudioService}
                    style={{
                        padding: '10px 15px',
                        fontSize: '16px',
                        backgroundColor: '#DC3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        opacity: !stopAudioService ? 0.5 : 1
                    }}
                >
                    Detener Audio
                </button>
            </div>
        </div>
    );
};

export default RobotAudioControl;